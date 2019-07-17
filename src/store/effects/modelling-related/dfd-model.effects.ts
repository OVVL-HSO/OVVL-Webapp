import {Injectable} from "@angular/core";
import {Actions, Effect, ofType} from "@ngrx/effects";
import {catchError, map, mergeMap, switchMap, take} from "rxjs/operators";
import {AddModalAction, RemoveModalAction} from "../../actions/view-related/modal.action";
import {ModalConfig} from "../../../config/modal.config";
import {
  LoadStoredWorkAction,
} from "../../actions/user-related/storage.action";
import {BaseModelStorageData} from "../../../models/user-related/storage.model";
import {State} from "../..";
import {DFDModel, StoredDFDModel} from "../../../models/modelling-related/dfd.model";
import {StorageUtil} from "../../../utils/storage.util";
import {CloseDetailsAction} from "../../actions/user-related/profile.action";
import {
  RESET_DFD_MODEL, RESET_DFD_MODEL_COMPLETE,
  ResetCurrentDFDModelAction,
  ResetCurrentDFDModelCompleteAction
} from "../../actions/modelling-related/element-delete.action";
import {SetViewAction} from "../../actions/view-related/view.action";
import {View} from "../../../models/view-related/view.model";
import {DFDElementType} from "../../../models/types/types.model";
import {DataFlow} from "../../../models/modelling-related/dataflow.model";
import {TrustBoundary} from "../../../models/modelling-related/trust-boundary.model";
import {from, Observable, of} from "rxjs";
import {GenericElementType} from "../../../models/modelling-related/base.model";
import {UpdateDataFlowAction, UpdateDFDElementAction, UpdateTrustBoundaryAction} from "../../actions/modelling-related/element-update.action";
import {StorageService} from "../../../services/user-related/storage.service";
import {StoreService} from "../../../services/store.service";
import {Action} from "@ngrx/store";
import {
  DELETE_DFD,
  DELETE_DFD_COMPLETE, DeleteDFDCompleteAction,
  ErrorDeletingDFDAction,
  ErrorLoadingDFDAction,
  ErrorSavingDFDAction, INIT_SAVE_DFD,
  LOAD_SAVED_DFD,
  LoadSaveDFDCompleteAction, SAVE_DFD, SAVE_DFD_COMPLETE, SavingDFDCompleteAction
} from "../../actions/modelling-related/dfd-model.action";

@Injectable()
export class DFDModelEffects {

  @Effect() initSavingAction$ = this.action$.pipe(
    ofType(INIT_SAVE_DFD),
    map(() => new AddModalAction(ModalConfig.STORAGE_MODAL)),
  );

  @Effect() saveDFDModelAction$ = this.action$.pipe(
    ofType(SAVE_DFD),
    map((action: any) => action.payload),
    switchMap((storageData: BaseModelStorageData) => {
      const storageMetaData: BaseModelStorageData = storageData;
      // FIXME: THIS CAN BE DONE BETTER
      return this.storeService.selectState()
        .pipe(
          take(1),
          switchMap((state: State) => {
            const dfdModel: DFDModel = StorageUtil.convertStateToSaveableDFD(state, storageMetaData);
            return this.storageService.saveDFDModel(dfdModel)
              .pipe(
                map(() => new SavingDFDCompleteAction),
                catchError((error: Error) => this.createErrorObservableAndLog(error, "save"))
              );
          }),
          catchError((error: Error) => this.createErrorObservableAndLog(error, "save"))
        );
    })
  );

  @Effect() saveDFDCompleteAction$ = this.action$.pipe(
    ofType(SAVE_DFD_COMPLETE),
    map((action: any) => action.payload),
    mergeMap(() => {
      return [new LoadStoredWorkAction(), new RemoveModalAction(ModalConfig.STORAGE_MODAL)];
    }),
  );


  @Effect() deleteDFDModelCompleteAction$ = this.action$.pipe(
    ofType(DELETE_DFD),
    map((action: any) => action.payload),
    switchMap((modelID: string) => this.storageService.deleteDFDModel(modelID)
      .pipe(
        mergeMap(() => [new CloseDetailsAction(), new DeleteDFDCompleteAction()]),
        catchError((error: Error) => this.createErrorObservableAndLog(error, "delete"))
      ))
  );

  @Effect() deleteDFDModelAction$ = this.action$.pipe(
    ofType(DELETE_DFD_COMPLETE),
    map(() => new LoadStoredWorkAction()));

  @Effect() loadSavedDFDAction$ = this.action$.pipe(
    ofType(LOAD_SAVED_DFD),
    map((action: any) => action.payload),
    switchMap((modelID: string) => {
      return this.storageService.loadSavedModel(modelID)
        .pipe(
          mergeMap((storedModel: StoredDFDModel) => {
            return [new ResetCurrentDFDModelAction(storedModel),
              new SetViewAction(View.DESIGN),
              new LoadSaveDFDCompleteAction()];
          }),
          catchError((error: Error) => this.createErrorObservableAndLog(error, "load"))
        );
    })
  );

  @Effect() resetDFDModelAction$ = this.action$.pipe(
    ofType(RESET_DFD_MODEL),
    map((action: any) => action.payload),
    mergeMap((storedModel: StoredDFDModel) => [new ResetCurrentDFDModelCompleteAction(storedModel)]),
    catchError((error: Error) => this.createErrorObservableAndLog(error, "load"))
  );

  @Effect() resetDFDModelCompleteAction$ = this.action$.pipe(
    ofType(RESET_DFD_MODEL_COMPLETE),
    map((action: any) => action.payload),
    switchMap((storedModel: StoredDFDModel) => {
      let elements: (DFDElementType | DataFlow | TrustBoundary)[] = [];
      elements = elements.concat(
        storedModel.interactors,
        storedModel.processes,
        storedModel.dataStores,
        storedModel.dataFlows,
        storedModel.trustBoundaries);
      return from(elements);
    }),
    map((element: (DFDElementType | DataFlow | TrustBoundary)) => {
      if (element.genericType === GenericElementType.DATAFLOW) {
        return new UpdateDataFlowAction(element);
      } else if (element.genericType === GenericElementType.TRUST_BOUNDARY) {
        return new UpdateTrustBoundaryAction(element);
      } else {
        return new UpdateDFDElementAction(element);
      }
    }),
    catchError((error: Error) => this.createErrorObservableAndLog(error, "load"))
  );

  constructor(private action$: Actions,
              private storageService: StorageService,
              private storeService: StoreService) {
  }

  private createErrorObservableAndLog(error, errorType: "load" | "save" | "delete"): Observable<Action> {
    console.error(error);
    if (errorType === "save") {
      return of(new ErrorSavingDFDAction(error));
    } else if (errorType === "load") {
      return of(new ErrorLoadingDFDAction(error));
    }
    return of(new ErrorDeletingDFDAction(error));
  }
}
