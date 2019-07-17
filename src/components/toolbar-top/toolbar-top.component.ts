import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {State} from '../../store';
import {SetViewAction} from '../../store/actions/view-related/view.action';
import {AnalyzeThreatModelAction} from '../../store/actions/analysis-related/analysis.action';
import {View} from "../../models/view-related/view.model";
import {SessionStorageService} from "../../services/session-storage.service";
import {untilDestroyed} from "ngx-take-until-destroy";
import {LoadStoredWorkAction} from "../../store/actions/user-related/storage.action";
import * as html2canvas from "html2canvas";
import {ElementUtil} from "../../utils/element.util";
import {StoreService} from "../../services/store.service";
import {ShowAlertAction} from "../../store/actions/general-interaction-related/alert.action";
import {AlertType} from "../../models/alert.model";
import {ActionCreators} from "redux-undo";
import {ToggleTrustBoundaryDrawingAction, ToogleDataFlowDrawingAction} from "../../store/actions/general-interaction-related/toolbar.action";
import {Observable} from "rxjs";
import {DFDElementState} from "../../store/reducer/modelling-related/dfd-element.reducer";
import {AddModalAction} from "../../store/actions/view-related/modal.action";
import {ModalConfig} from "../../config/modal.config";
import {InitDFDSavingProcessAction} from "../../store/actions/modelling-related/dfd-model.action";

@Component({
  selector: 'app-toolbar-top',
  templateUrl: './toolbar-top.component.html',
  styleUrls: ['./toolbar-top.component.scss']
})
export class ToolbarTopComponent implements OnInit, OnDestroy {
  analysisButtonClicked: boolean;
  undoState$: Observable<DFDElementState[]>;
  redoState$: Observable<DFDElementState[]>;
  designViewActive: boolean;
  profileViewActive: boolean;
  analysisViewActive: boolean;
  userHasAddedElements: boolean;

  private dataFlowDrawingEnabled: boolean;
  private trustBoundaryDrawingEnabled: boolean;
  private zoomActive: boolean;

  constructor(private store: Store<State>,
              private storeService: StoreService) {
  }

  @HostListener('window:keydown.control.z')
  onUndoKeyPress() {
    if (this.designViewActive) {
      this.undo();
    }
  }

  @HostListener('window:beforeunload', ['$event'])
  handleClose($event) {
    if (this.userHasAddedElements) {
      $event.preventDefault();
    }
  }

  @HostListener('window:keydown.control.shift.z')
  onRedoKeyPress() {
    this.redo();
  }

  ngOnInit() {
    this.subscribeToDataFlowDrawingState();
    this.subscribeToViewState();
    this.subscribeToTrustBoundaryDrawingState();
    this.subscribeToElementState();
    this.subscribeToZoomState();
    this.subscribeToUndoRedoState();
  }

  ngOnDestroy() {
  }

  analysisViewChange() {
    if (SessionStorageService.isSignedIn()) {
      this.changeBetweenAnalysisAndDesignView();
    } else {
      this.store.dispatch(new AddModalAction(ModalConfig.LOGIN_MODAL));
    }
  }

  saveDFD() {
    if (this.userHasAddedElements) {
      if (SessionStorageService.isSignedIn()) {
        this.openStorageModal();
      } else {
        this.store.dispatch(new AddModalAction(ModalConfig.LOGIN_MODAL));
      }
    }
  }

  switchToLandingView() {
    if (this.userHasAddedElements) {
      this.store.dispatch(new ShowAlertAction({alertType: AlertType.LEAVE_WORKSPACE}));
    } else {
      if (this.dataFlowDrawingEnabled) {
        this.store.dispatch(new ToogleDataFlowDrawingAction());
      }
      if (this.trustBoundaryDrawingEnabled) {
        this.store.dispatch(new ToggleTrustBoundaryDrawingAction());
      }
      this.store.dispatch(new SetViewAction(View.LANDING));
    }
  }

  undo() {
    this.store.dispatch(ActionCreators.undo());
  }

  redo() {
    this.store.dispatch(ActionCreators.redo());
  }

  showProfile() {
    if (SessionStorageService.isSignedIn()) {
      this.changeBetweenProfileAndDesignView();
    } else {
      this.store.dispatch(new AddModalAction(ModalConfig.LOGIN_MODAL));
    }
  }

  private changeBetweenAnalysisAndDesignView() {
    this.analysisButtonClicked = !this.analysisButtonClicked;
    if (this.analysisButtonClicked) {
      this.toggleLeftToolbarFunctionsIfNeeded();
      this.store.dispatch(new AnalyzeThreatModelAction());
    } else {
      this.store.dispatch(new SetViewAction(View.DESIGN));
    }
  }

  private subscribeToDataFlowDrawingState() {
    this.storeService.selectDataFlowDrawingEnabledState()
      .pipe(untilDestroyed(this))
      .subscribe((dataFlowDrawingEnabled: boolean) => this.dataFlowDrawingEnabled = dataFlowDrawingEnabled);
  }

  private subscribeToTrustBoundaryDrawingState() {
    this.storeService.selectTrustBoundaryDrawingEnabledState()
      .pipe(untilDestroyed(this))
      .subscribe((trustBoundaryDrawingEnabled: boolean) => this.trustBoundaryDrawingEnabled = trustBoundaryDrawingEnabled);
  }

  private subscribeToElementState() {
    this.storeService.selectElementState()
      .pipe(untilDestroyed(this))
      .subscribe((dfdState: DFDElementState) => this.userHasAddedElements = ElementUtil.atLeastOneTypeOfElementExists(dfdState));
  }

  private subscribeToZoomState() {
    this.storeService.selectZoomingActiveState()
      .pipe(untilDestroyed(this))
      .subscribe((zoomActive: boolean) => this.zoomActive = zoomActive);
  }

  private subscribeToUndoRedoState() {
    this.undoState$ = this.storeService.selectUndoState().pipe(untilDestroyed(this));
    this.redoState$ = this.storeService.selectRedoState().pipe(untilDestroyed(this));
  }

  private subscribeToViewState() {
    this.storeService.selectCurrentViewState()
      .pipe(untilDestroyed(this))
      .subscribe((shownView: View) => {
        this.designViewActive = shownView === View.DESIGN;
        this.profileViewActive = shownView === View.PROFILE;
        this.analysisViewActive = shownView === View.ANALYSIS;
      });
  }

  private createScreenshotOfWorkingArea(): Promise<any> {
    return html2canvas(document.querySelector(".drawing-stage-container"), {logging: false, backgroundColor: "#7A7A7A"});
  }

  private toggleLeftToolbarFunctionsIfNeeded() {
    // TODO: Effect
    if (this.dataFlowDrawingEnabled) {
      this.store.dispatch(new ToogleDataFlowDrawingAction());
    }
    if (this.trustBoundaryDrawingEnabled) {
      this.store.dispatch(new ToggleTrustBoundaryDrawingAction());
    }
  }

  private changeBetweenProfileAndDesignView() {
    if (this.designViewActive) {
      this.store.dispatch(new LoadStoredWorkAction());
      this.store.dispatch(new SetViewAction(View.PROFILE));
    } else if (this.profileViewActive) {
      this.store.dispatch(new SetViewAction(View.DESIGN));
    }
  }

  private openStorageModal() {
    if (this.userHasAddedElements) {
      this.createScreenshotOfWorkingArea()
        .then((screenshotCanvas: any) => {
          const base64Screenshot = screenshotCanvas.toDataURL("image/jpeg", 0.4);
          this.store.dispatch(new InitDFDSavingProcessAction(base64Screenshot));
        });
    } else {
      this.store.dispatch(new AddModalAction(ModalConfig.STORAGE_MODAL));
    }
  }
}
