import {Component, HostListener, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {AppType, Interactor, InteractorOptions, InteractorType} from "../../../../models/modelling-related/interactor.model";
import {DataStoreType} from "../../../../models/modelling-related/datastore.model";
import {ProcessType} from "../../../../models/modelling-related/process.model";
import {DataFlowType} from "../../../../models/modelling-related/dataflow.model";
import {GeneralUtil} from "../../../../utils/general.util";
import {GenericElementType, GenericSelection} from "../../../../models/modelling-related/base.model";
import {CloseOptionsViewAction} from "../../../../store/actions/modelling-related/element-options.action";
import {CPEITem} from "../../../../models/analysis-related/cpe.model";
import {Store} from "@ngrx/store";
import {State} from "../../../../store";
import {SessionStorageService} from "../../../../services/session-storage.service";
import {take} from "rxjs/operators";
import {SearchCPEAction} from "../../../../store/actions/analysis-related/cpe.action";
import {untilDestroyed} from "ngx-take-until-destroy";
import {Observable} from "rxjs";
import {StoreService} from "../../../../services/store.service";
import {TrustBoundaryType} from "../../../../models/modelling-related/trust-boundary.model";
import {RegexUtil} from "../../../../utils/regex.util";
import {
  UpdateDataFlowAction,
  UpdateDFDElementAction,
  UpdateTrustBoundaryAction
} from "../../../../store/actions/modelling-related/element-update.action";
import {
  DeleteDataFlowAction,
  DeleteDFDlementAction,
  DeleteTrustBoundaryAction
} from "../../../../store/actions/modelling-related/element-delete.action";
import {AddModalAction} from "../../../../store/actions/view-related/modal.action";
import {ModalConfig} from "../../../../config/modal.config";
import {OptionState} from "../../../../store/reducer/modelling-related/element-options.reducer";
import {OptionUtil} from "../../../../utils/option.util";

@Component({
  selector: 'app-generic-options',
  templateUrl: './main-option.component.html',
  styleUrls: ['./main-option.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MainOptionComponent implements OnInit, OnDestroy {

  typeOptions: any[];
  cpeTerm = "";
  isInteractor: boolean;
  isProcess: boolean;
  isDataStore: boolean;
  isDataFlow: boolean;
  isTrustBoundary: boolean;

  availableCPEs$: Observable<CPEITem[]>;
  currentlyLoadingCPEs$: Observable<boolean>;
  cpeSearchStarted: boolean;
  ipv4Patter: string;
  confirmDelete = false;
  private isSignedIn: boolean;
  currentElementData: OptionState;

  constructor(private store: Store<State>, private storeService: StoreService) {
  }

  @HostListener('window:keydown', ['$event'])
  onKeyPress(event: KeyboardEvent) {
    if (event.key === "Enter" && this.isSignedIn) {
      this.updateElement();
    }
  }

  ngOnInit() {
    this.setIPv4Validatior();
    this.subscribeToOptionsState();
    this.subscribeToCPEState();
  }

  ngOnDestroy() {
  }

  updateElement() {
    switch (this.currentElementData.elementToBeChanged.genericType) {
      case GenericElementType.INTERACTOR:
      case GenericElementType.PROCESS:
      case GenericElementType.DATASTORE:
        this.store.dispatch(new UpdateDFDElementAction(this.currentElementData.elementToBeChanged));
        break;
      case GenericElementType.DATAFLOW:
        this.store.dispatch(new UpdateDataFlowAction(this.currentElementData.elementToBeChanged));
        break;
      case GenericElementType.TRUST_BOUNDARY:
        this.store.dispatch(new UpdateTrustBoundaryAction(this.currentElementData.elementToBeChanged));
        break;
      default:
        break;
    }
    this.store.dispatch(new CloseOptionsViewAction());
  }

  searchCPE() {
    this.isSignedIn = SessionStorageService.isSignedIn();
    if (this.isSignedIn) {
      this.cpeSearchStarted = true;
      this.store.dispatch(new SearchCPEAction(this.cpeTerm));
    } else {
      this.store.dispatch(new AddModalAction(ModalConfig.LOGIN_MODAL));
    }
  }

  closeOptions() {
    this.store.dispatch(new CloseOptionsViewAction());
  }

  addCPE(cpe: CPEITem) {
    if (this.currentElementData.elementToBeChanged.genericType !== GenericElementType.TRUST_BOUNDARY) {
      this.currentElementData.elementToBeChanged.cpe = cpe;
    }
  }

  resetCPE() {
    if (this.currentElementData.elementToBeChanged.genericType !== GenericElementType.TRUST_BOUNDARY) {
      this.currentElementData.elementToBeChanged.cpe = null;
    }
  }

  updateElementOptions(updatedElement) {
    if (this.currentElementData.elementToBeChanged.genericType !== GenericElementType.TRUST_BOUNDARY) {
      this.currentElementData.elementToBeChanged.options = updatedElement;
    }
  }

  getButtonBackgroundClass() {
    if (this.isInteractor) {
      return "interactor-button";
    } else if (this.isProcess) {
      return "process-button";
    } else if (this.isDataStore) {
      return "data-store-button";
    } else if (this.isDataFlow) {
      return "data-flow-button";
    } else {
      return "trust-boundary-button";
    }
  }

  deleteConfirmation() {
    this.confirmDelete = !this.confirmDelete;
  }

  deleteElement() {
    if (this.currentElementData.elementToBeChanged.genericType === GenericElementType.DATAFLOW) {
      this.store.dispatch(new DeleteDataFlowAction(this.currentElementData.elementToBeChanged.id));
    } else if (this.currentElementData.elementToBeChanged.genericType === GenericElementType.TRUST_BOUNDARY) {
      this.store.dispatch(new DeleteTrustBoundaryAction(this.currentElementData.elementToBeChanged.id));
    } else {
      this.store.dispatch(new DeleteDFDlementAction(
        this.currentElementData.elementToBeChanged.id
      ));
    }
  }

  private subscribeToOptionsState() {
    this.storeService.selectElementToBeChangedState()
      .pipe(take(1))
      .subscribe((optionState: OptionState) => {
        // Option state includes all elements related to the currently selected element
        if (optionState) {
          this.currentElementData = optionState;
          this.setCurrentElementType(optionState.elementToBeChanged.genericType);
          this.setTypeOptions();
        }
      });
  }

  private subscribeToCPEState() {
    this.availableCPEs$ = this.storeService.selectAvailableCPEs().pipe(untilDestroyed(this));
    this.currentlyLoadingCPEs$ = this.storeService.selectCurrentlyLoadingCPEState().pipe(untilDestroyed(this));
  }

  private setTypeOptions() {
    if (this.isInteractor) {
      this.typeOptions = GeneralUtil.getStringEnumAsArrayOfStrings(InteractorType);
    } else if (this.isProcess) {
      this.typeOptions = GeneralUtil.getStringEnumAsArrayOfStrings(ProcessType);
    } else if (this.isDataStore) {
      this.typeOptions = GeneralUtil.getStringEnumAsArrayOfStrings(DataStoreType);
    } else if (this.isDataFlow) {
      this.typeOptions = GeneralUtil.getStringEnumAsArrayOfStrings(DataFlowType);
    } else {
      this.typeOptions = GeneralUtil.getStringEnumAsArrayOfStrings(TrustBoundaryType);
    }
  }

  private setCurrentElementType(genericType: GenericElementType) {
    switch (genericType) {
      case GenericElementType.INTERACTOR:
        this.isInteractor = true;
        break;
      case GenericElementType.PROCESS:
        this.isProcess = true;
        break;
      case GenericElementType.DATASTORE:
        this.isDataStore = true;
        break;
      case GenericElementType.DATAFLOW:
        this.isDataFlow = true;
        break;
      case GenericElementType.TRUST_BOUNDARY:
        this.isTrustBoundary = true;
        break;
      default:
        break;
    }
  }

  private setIPv4Validatior() {
    this.ipv4Patter = RegexUtil.getIPv4Pattern();
  }

  elementTypeChanged() {
    if (this.isInteractor) {
      this.currentElementData.elementToBeChanged.options = OptionUtil
        .removeAllNotDefaultOptionsFromInteractor(this.currentElementData.elementToBeChanged.options as InteractorOptions);
      if (OptionUtil.interactorIsTypeMobileAppButDoesNotHaveAppTypeOptions(this.currentElementData.elementToBeChanged as Interactor)) {
        (this.currentElementData.elementToBeChanged.options as InteractorOptions).appType = AppType.NOT_SELECTED;
      } else if (OptionUtil.interactorIsTypeHumanButDoesNotHaveEmployeeSet(this.currentElementData.elementToBeChanged as Interactor)) {
        (this.currentElementData.elementToBeChanged.options as InteractorOptions).employee = GenericSelection.NOT_SELECTED;
      } else if (OptionUtil
        .interactorIsTypeIoTOrSensorButDoesNotHaveAccessibleSet(this.currentElementData.elementToBeChanged as Interactor)) {
        (this.currentElementData.elementToBeChanged.options as InteractorOptions).accessible = GenericSelection.NOT_SELECTED;
      }
    }
  }
}
