import {Action} from '@ngrx/store';
import {DataFlowVectorMetaData} from '../../../models/modelling-related/dataflow.model';

export const ADD_TEMP_DATAFLOW = '[DataFlow] Add Temporary DataFlow';
export const RESET_TEMP_DATAFLOW = '[DataFlow] Reset Temporary DataFlow';

export class AddTempDataFlowAction implements Action {
  readonly type = ADD_TEMP_DATAFLOW;

  constructor(public payload: DataFlowVectorMetaData) {
  }
}

export class ResetTempDataFlowAction implements Action {
  readonly type = RESET_TEMP_DATAFLOW;
}

export type DataFlowDrawingActions = AddTempDataFlowAction | ResetTempDataFlowAction;
