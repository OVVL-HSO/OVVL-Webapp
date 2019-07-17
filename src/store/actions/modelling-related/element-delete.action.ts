import {Action} from "@ngrx/store";
import {StoredDFDModel} from "../../../models/modelling-related/dfd.model";

export const DELETE_ELEMENT = '[DFD] Delete Element';
export const DELETE_DATAFLOW = '[DataFlow] Delete DataFlow';
export const DELETE_BOUNDARY = '[Boundary] Delete Trust Boundary';

export const RESET_DFD_MODEL = '[DFD] Reset DFD Model';
export const RESET_DFD_MODEL_COMPLETE = '[DFD] Reset DFD Model Complete';

export class DeleteDFDlementAction implements Action {
  readonly type = DELETE_ELEMENT;

  constructor(public payload: string) {
  }
}

export class DeleteDataFlowAction implements Action {
  readonly type = DELETE_DATAFLOW;

  constructor(public payload: string) {
  }
}

export class DeleteTrustBoundaryAction implements Action {
  readonly type = DELETE_BOUNDARY;

  constructor(public payload: string) {
  }
}

export class ResetCurrentDFDModelAction implements Action {
  readonly type = RESET_DFD_MODEL;

  constructor(public payload: StoredDFDModel) {
  }
}

export class ResetCurrentDFDModelCompleteAction implements Action {
  readonly type = RESET_DFD_MODEL_COMPLETE;

  constructor(public payload: StoredDFDModel) {
  }
}

export type DeleteElementActions =
  | DeleteDFDlementAction
  | DeleteDataFlowAction
  | DeleteTrustBoundaryAction
  | ResetCurrentDFDModelAction
  | ResetCurrentDFDModelCompleteAction;
