import {DataFlowVectorMetaData} from '../../../models/modelling-related/dataflow.model';
import {ADD_TEMP_DATAFLOW, DataFlowDrawingActions, RESET_TEMP_DATAFLOW} from '../../actions/modelling-related/data-flow.action';

export interface DataFlowDrawingState {
  tempDataFlow?: DataFlowVectorMetaData;
}

const initialState: DataFlowDrawingState = {};

export function dataFlowReducer(state: DataFlowDrawingState = initialState, action: DataFlowDrawingActions): DataFlowDrawingState {
  switch (action.type) {
    case ADD_TEMP_DATAFLOW:
      return {
        ...state,
        tempDataFlow: action.payload
      };
    case RESET_TEMP_DATAFLOW:
      return {
        ...state,
        tempDataFlow: null
      };
    default:
      return state;
  }
}
