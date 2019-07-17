import {ActionReducerMap} from '@ngrx/store';
import {DataFlowDrawingState, dataFlowReducer} from './reducer/modelling-related/data-flow.reducer';
import {DfdElementEffects} from './effects/modelling-related/dfd-element.effects';
import {elementOptionsReducer, OptionState} from './reducer/modelling-related/element-options.reducer';
import {viewReducer} from './reducer/view-related/view.reducer';
import {AnalysisState} from '../models/analysis-related/analysis.model';
import {analysisReducer} from './reducer/analysis-related/analysis.reducer';
import {AnalysisEffects} from './effects/analysis-related/analysis.effects';
import {userReducer, UserState} from "./reducer/user-related/user-reducer";
import {UserEffects} from "./effects/user-related/user.effects";
import {dfdElementReducer, DFDElementState} from "./reducer/modelling-related/dfd-element.reducer";
import {storageReducer, StorageState} from "./reducer/user-related/storage.reducer";
import {StorageEffects} from "./effects/user-related/storage.effects";
import {cpeReducer, CPEState} from "./reducer/analysis-related/cpe.reducer";
import {CPEEffects} from "./effects/analysis-related/cpe.effects";
import {ViewState} from "../models/view-related/view.model";
import {AlertState} from "../models/alert.model";
import {alertReducer} from "./reducer/general-interaction-related/alert.reducer";
import {ToggleEffects} from "./effects/view-related/toggle.effects";
import {DataFlowEffects} from "./effects/modelling-related/data-flow.effects";
import {trashcanReducer, TrashcanState} from "./reducer/general-interaction-related/trashcan.reducer";
import {redrawReducer, RedrawState} from "./reducer/view-related/redraw.reducer";
import {RedrawEffects} from "./effects/view-related/redraw.effects";
import undoable, {ActionTypes, includeAction} from 'redux-undo';
import {UndoRedoEffects} from "./effects/view-related/undo-redo.effects";
import {toolbarReducer, ToolbarState} from "./reducer/general-interaction-related/toolbar.reducer";
import {UPDATE_BOUNDARY, UPDATE_DATAFLOW, UPDATE_ELEMENT} from "./actions/modelling-related/element-update.action";
import {ADD_BOUNDARY, ADD_DATAFLOW, ADD_ELEMENT} from "./actions/modelling-related/element-add.action";
import {ViewEffects} from "./effects/view-related/view.effects";
import {InjectionToken} from "@angular/core";
import {modalReducer} from "./reducer/view-related/modal.reducer";
import {Modal} from "../models/view-related/modal.model";
import {AlertEffects} from "./effects/general-interaction-related/alert.effects";
import {FeedbackEffects} from "./effects/general-interaction-related/feedback.effects";
import {feedbackReducer, FeedbackState} from "./reducer/general-interaction-related/feedback.reducer";
import {profileReducer, ProfileState} from "./reducer/user-related/profile.reducer";
import {ProjectEffects} from "./effects/user-related/project.effects";
import {projectReducer, ProjectState} from "./reducer/user-related/project.reducer";
import {dfdModelReducer, DFDModelState} from "./reducer/modelling-related/dfd-model.reducer";
import {DFDModelEffects} from "./effects/modelling-related/dfd-model.effects";
import {ErrorEffects} from "./effects/error.effects";
import {ElementOptionsEffects} from "./effects/modelling-related/element-options.effects";

export interface State {
  dataFlowState: DataFlowDrawingState;
  elementOptions: OptionState;
  viewState: ViewState;
  analysisState: AnalysisState;
  userState: UserState;
  elementState: {
    past: DFDElementState[];
    present: DFDElementState;
    future: DFDElementState[];
    _latestUnfiltered: DFDElementState;
    group: any;
    index: number;
    limit: number;
  };
  storageState: StorageState;
  cpes: CPEState;
  alert: AlertState;
  trashcanState: TrashcanState;
  redrawState: RedrawState;
  toolbarState: ToolbarState;
  modalState: Modal[];
  feedbackState: FeedbackState;
  profileState: ProfileState;
  projectState: ProjectState;
  dfdModelState: DFDModelState;
}

export const reducers: ActionReducerMap<State> = {
  dataFlowState: dataFlowReducer,
  elementOptions: elementOptionsReducer,
  viewState: viewReducer,
  analysisState: analysisReducer,
  userState: userReducer,
  elementState: undoable(
    dfdElementReducer,
    {
      limit: 10,
      undoType: ActionTypes.UNDO,
      redoType: ActionTypes.REDO,
      filter: includeAction([
        ADD_ELEMENT, UPDATE_ELEMENT, ADD_DATAFLOW, UPDATE_DATAFLOW, ADD_BOUNDARY, UPDATE_BOUNDARY])
    }
  ),
  storageState: storageReducer,
  cpes: cpeReducer,
  toolbarState: toolbarReducer,
  alert: alertReducer,
  trashcanState: trashcanReducer,
  redrawState: redrawReducer,
  modalState: modalReducer,
  feedbackState: feedbackReducer,
  profileState: profileReducer,
  projectState: projectReducer,
  dfdModelState: dfdModelReducer
};

// This is used for correct AOT compilation in production
export const reducerToken = new InjectionToken<ActionReducerMap<State>>("Registered Reducers");
Object.assign(reducerToken, reducers);

export function getReducers() {
  return reducers;
}

export const effects = [
  DfdElementEffects,
  AnalysisEffects,
  CPEEffects,
  UserEffects,
  StorageEffects,
  ToggleEffects,
  DataFlowEffects,
  RedrawEffects,
  UndoRedoEffects,
  ViewEffects,
  AlertEffects,
  FeedbackEffects,
  ProjectEffects,
  DFDModelEffects,
  ElementOptionsEffects,
  ErrorEffects];
