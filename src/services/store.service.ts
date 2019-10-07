import {Injectable} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {State} from '../store';
import {Observable} from 'rxjs';
import {map, mergeMap, take} from 'rxjs/operators';
import {DataFlow, DataFlowVectorMetaData} from '../models/modelling-related/dataflow.model';
import {CPEITem} from "../models/analysis-related/cpe.model";
import {StageZoom, View, ViewState} from "../models/view-related/view.model";
import {TrustBoundary} from "../models/modelling-related/trust-boundary.model";
import {Alert} from "../models/alert.model";
import {TrashcanState} from "../store/reducer/general-interaction-related/trashcan.reducer";
import {RedrawState} from "../store/reducer/view-related/redraw.reducer";
import {DFDElementType} from "../models/types/types.model";
import {DFDElementState} from "../store/reducer/modelling-related/dfd-element.reducer";
import {AnalysisState} from "../models/analysis-related/analysis.model";
import {Modal} from "../models/view-related/modal.model";
import {FeedbackState} from "../store/reducer/general-interaction-related/feedback.reducer";
import {Profile, ProfileTab} from "../models/user-related/profile.model";
import {ModelStorageData, StoredWork} from "../models/user-related/storage.model";
import {Project} from "../models/user-related/project.model";
import {ElementUtil} from "../utils/element.util";
import {OptionState} from "../store/reducer/modelling-related/element-options.reducer";
import {Settings} from "../models/user-related/settings.model";

@Injectable()
export class StoreService {


  constructor(private store: Store<State>) {
  }

  selectDataFlowsConnectedToAnElement(id: string): Observable<DataFlow[]> {
    return this.selectDataFlows()
      .pipe(
        take(1),
        map((dataFlows: DataFlow[]) =>
          dataFlows.filter((dataFlow: DataFlow) => ElementUtil.elementIsConnectedToDataFlow(id, dataFlow.connectedElements)))
      );
  }

  selectDataFlowByID(dataFlowID: string): Observable<DataFlow> {
    return this.selectDataFlows()
      .pipe(
        take(1),
        map((dataFlows: DataFlow[]) =>
          dataFlows.find((dataFlow: DataFlow) => dataFlow.id === dataFlowID)));
  }

  selectElementsConnectedToDataFlow(dataFlow: DataFlow) {
    return this.selectDFDElements()
      .pipe(
        take(1),
        map((dfdElements: (DFDElementType)[]) =>
          dfdElements.filter((dfdElement: DFDElementType) =>
            dfdElement.id === dataFlow.connectedElements.startElement.id || dataFlow.connectedElements.endElement.id))
      );
  }

  selectProjectByID(projectID: string): Observable<Project> {
    return this.selectProjects()
      .pipe(
        take(1),
        map((projects: Project[]) => projects.find((project: Project) => project.projectID === projectID)));
  }

  selectProjectTitleByID(projectID: string): Observable<string> {
    return this.selectProjectByID(projectID)
      .pipe(
        take(1),
        map((project: Project) => project.title));
  }

  selectCurrentlySelectedModelData(): Observable<ModelStorageData> {
    return this.selectModelDetailState()
      .pipe(mergeMap((shownModel: string) =>
        this.store.select((state: State) =>
          state.storageState.storage.models.find((model: ModelStorageData) => model.modelID === shownModel))));
  }

  selectCurrentlySelectedProfileData(): Observable<Project> {
    return this.selectProjectDetailsState()
      .pipe(mergeMap((shownProjectID: string) =>
        this.store.select((state: State) =>
          state.storageState.storage.projects.find((project: Project) => project.projectID === shownProjectID))));
  }

  selectModelsLinkedToProject(projectID: string): Observable<ModelStorageData[]> {
    return this.selectStoredWork()
      .pipe(
        map((storedWork: StoredWork) => storedWork.models
          .filter((modelData: ModelStorageData) => modelData.projectID === projectID)
        )
      );
  }

  selectState(): Observable<State> {
    return this.store.pipe(select((state: State) => state));
  }

  selectDataFlowDrawingEnabledState(): Observable<boolean> {
    return this.store.pipe(select((state: State) => state.toolbarState.dataFlowDrawingEnabled));
  }

  selectCurrentViewState(): Observable<View> {
    return this.store.pipe(select((state: State) => state.viewState.currentView));
  }

  selectStageZoom(): Observable<StageZoom> {
    return this.store.pipe(select((state: State) => state.viewState.stageZoom));
  }

  selectZoomResetState(): Observable<boolean> {
    return this.store.pipe(select((state: State) => state.viewState.needsReset));
  }

  selectStageDraggableState(): Observable<boolean> {
    return this.store.pipe(select((state: State) => state.viewState.stageDraggable));
  }

  selectViewState(): Observable<ViewState> {
    return this.store.pipe(select((state: State) => state.viewState));
  }

  selectZoomingActiveState(): Observable<boolean> {
    return this.store.pipe(select((state: State) => state.viewState.zoomEnabled));
  }

  selectAvailableCPEs(): Observable<CPEITem[]> {
    return this.store.pipe(select((state: State) => state.cpes.availableCPE));
  }

  selectCurrentlyLoadingCPEState(): Observable<boolean> {
    return this.store.pipe(select((state: State) => state.cpes.currentlyLoading));
  }

  selectElementToBeChangedState(): Observable<OptionState> {
    return this.store.pipe(select((state: State) => state.elementOptions));
  }

  selectAuthenticatingState(): Observable<boolean> {
    return this.store.pipe(select((state: State) => state.userState.authenticating));
  }

  selectAuthErrorState(): Observable<Error> {
    return this.store.pipe(select((state: State) => state.userState.authError));
  }

  selectAnalysisState(): Observable<AnalysisState> {
    return this.store.pipe(select((state: State) => state.analysisState));
  }

  selectElementState(): Observable<DFDElementState> {
    return this.store.pipe(select((state: State) => state.elementState.present));
  }

  selectDFDElements(): Observable<DFDElementType[]> {
    return this.store.pipe(select((state: State) => state.elementState.present.dfdElements));
  }

  selectDataFlows(): Observable<DataFlow[]> {
    return this.store.pipe(select((state: State) => state.elementState.present.dataFlows));
  }

  selectTrustBoundaryState(): Observable<TrustBoundary[]> {
    return this.store.pipe(select((state: State) => state.elementState.present.trustBoundaries));
  }


  selectTempDataFlow(): Observable<DataFlowVectorMetaData> {
    return this.store.pipe(select((state: State) => state.dataFlowState.tempDataFlow));
  }

  selectAlertType(): Observable<Alert> {
    return this.store.pipe(select((state: State) => state.alert.alert));
  }

  selectTrustBoundaryDrawingEnabledState(): Observable<boolean> {
    return this.store.pipe(select((state: State) => state.toolbarState.trustBoundaryDrawingEnabled));
  }

  selectTrashCanState(): Observable<TrashcanState> {
    return this.store.pipe(select((state: State) => state.trashcanState));
  }

  selectRedrawState(): Observable<RedrawState> {
    return this.store.pipe(select((state: State) => state.redrawState));
  }

  selectAnalysingState(): Observable<boolean> {
    return this.store.pipe(select((state: State) => state.analysisState.analyzingModel));
  }

  selectUndoState() {
    return this.store.pipe(select((state: State) => state.elementState.past));
  }

  selectRedoState() {
    return this.store.pipe(select((state: State) => state.elementState.future));
  }

  selectModalState(): Observable<Modal[]> {
    return this.store.pipe(select((state: State) => state.modalState));
  }

  selectFeedbackState(): Observable<FeedbackState> {
    return this.store.pipe(select((state: State) => state.feedbackState));
  }

  selectEmail(): Observable<string> {
    return this.store.pipe(select((state: State) => state.userState.profile.mail));
  }

  selectProfile(): Observable<Profile> {
    return this.store.pipe(select((state: State) => state.userState.profile));
  }

  selectUsername(): Observable<string> {
    return this.store.pipe(select((state: State) => state.userState.profile.username));
  }

  selectStoredWork(): Observable<StoredWork> {
    return this.store.pipe(select((state: State) => state.storageState.storage));
  }

  selectProjects(): Observable<Project[]> {
    return this.store.pipe(select((state: State) => state.storageState.storage.projects));
  }

  selectStoredModelsNotYetPartOfAProject(): Observable<ModelStorageData[]> {
    return this.store.pipe(select((state: State) =>
      state.storageState.storage.models.filter((model: ModelStorageData) => !model.projectID)));
  }

  selectShownTab(): Observable<ProfileTab> {
    return this.store.pipe(select((state: State) => state.profileState.shownTab));
  }

  selectModelDetailState(): Observable<string> {
    return this.store.pipe(select((state: State) => state.profileState.shownModel));
  }

  selectProjectCreationState(): Observable<boolean> {
    return this.store.pipe(select((state: State) => state.projectState.creatingProject));
  }

  selectWorkAreaScreenshot(): Observable<string> {
    return this.store.pipe(select((state: State) => state.dfdModelState.screenshotWorkingArea));
  }

  selectSavingState(): Observable<boolean> {
    return this.store.pipe(select((state: State) => state.dfdModelState.saving));
  }

  selectProjectDetailsState(): Observable<string> {
    return this.store.pipe(select((state: State) => state.profileState.shownProject));
  }

  selectInvitationCount(): Observable<number> {
    return this.store.pipe(select((state: State) => state.storageState.storage.invites.length));
  }

  selectUserSettings(): Observable<Settings> {
    return this.store.pipe(select((state: State) => state.settingsState));
  }

  selectUserTheme(): Observable<boolean> {
    return this.store.pipe(select((state: State) => state.settingsState.darktheme));
  }


}
