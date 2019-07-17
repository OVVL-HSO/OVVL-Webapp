import {Action} from "@ngrx/store";
import {TrustBoundary} from "../../../models/modelling-related/trust-boundary.model";
import {DFDElementType} from "../../../models/types/types.model";
import {DataFlow} from "../../../models/modelling-related/dataflow.model";
import {GenericConnectedElement} from "../../../models/modelling-related/base.model";

export const UPDATE_ELEMENT = '[DFD] Update Element';
export const UPDATE_DATAFLOW = '[DataFlow] Update DataFlow';
export const UPDATE_BOUNDARY = '[Boundary] Update Trust Boundary';
export const UPDATE_DRAG_ELEMENT = '[DFD] Update Dragged Element';
export const CHANGE_DATAFLOW_POSITION = '[DataFlow] Update DataFlow Positions';

export class UpdateDFDElementAction implements Action {
  readonly type = UPDATE_ELEMENT;

  constructor(public payload: DFDElementType) {
  }
}

export class UpdateDataFlowAction implements Action {
  readonly type = UPDATE_DATAFLOW;

  constructor(public payload: DataFlow) {
  }
}

export class UpdateTrustBoundaryAction implements Action {
  readonly type = UPDATE_BOUNDARY;

  constructor(public payload: TrustBoundary) {
  }
}

// This action is used separately from the Update Element Action
// because otherwise we can't differentiate between normal updates and dragging updates. This is important for undo/redo.
export class UpdateDFDElementOnDragAction implements Action {
  readonly type = UPDATE_DRAG_ELEMENT;

  constructor(public payload: DFDElementType) {
  }
}

export class ChangeDataFlowPositionsAction implements Action {
  readonly type = CHANGE_DATAFLOW_POSITION;

  constructor(public payload: GenericConnectedElement) {
  }
}

export type UpdateElementActions =
  UpdateDFDElementAction
  | UpdateDataFlowAction
  | UpdateTrustBoundaryAction
  | UpdateDFDElementOnDragAction
  | ChangeDataFlowPositionsAction;
