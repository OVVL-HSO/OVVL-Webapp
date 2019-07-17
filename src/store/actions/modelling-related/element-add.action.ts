import {Action} from "@ngrx/store";
import {BaseDFDElement, DataFlowConnectionInfo} from "../../../models/modelling-related/base.model";
import {BoundaryMetaData} from "../../../models/modelling-related/trust-boundary.model";

export const ADD_ELEMENT = '[DFD] Add Element';
export const ADD_DATAFLOW = '[DataFlow] Add DataFlow';
export const ADD_BOUNDARY = '[Boundary] Add Trust Boundary';

export class AddDFDElementAction implements Action {
  readonly type = ADD_ELEMENT;

  constructor(public payload: BaseDFDElement) {
  }
}

export class AddDataFlowAction implements Action {
  readonly type = ADD_DATAFLOW;

  constructor(public payload: DataFlowConnectionInfo) {
  }
}

export class AddTrustBoundaryAction implements Action {
  readonly type = ADD_BOUNDARY;

  constructor(public payload: BoundaryMetaData) {
  }
}

export type AddElementActions = AddDFDElementAction | AddDataFlowAction | AddTrustBoundaryAction;
