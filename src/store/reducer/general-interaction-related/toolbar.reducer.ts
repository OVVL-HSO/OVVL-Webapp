import {TOGGLE_BOUNDARY_DRAWING, TOGGLE_DATAFLOW_DRAWING, ToolbarActions} from "../../actions/general-interaction-related/toolbar.action";

export interface ToolbarState {
  dataFlowDrawingEnabled: boolean;
  trustBoundaryDrawingEnabled: boolean;
}

const initialState: ToolbarState = {
  dataFlowDrawingEnabled: false,
  trustBoundaryDrawingEnabled: false
};

export function toolbarReducer(state: ToolbarState = initialState, action: ToolbarActions): ToolbarState {
  switch (action.type) {
    case TOGGLE_DATAFLOW_DRAWING:
      return {
        ...state,
        dataFlowDrawingEnabled: !state.dataFlowDrawingEnabled
      };
    case TOGGLE_BOUNDARY_DRAWING:
      return {
        ...state,
        trustBoundaryDrawingEnabled: !state.trustBoundaryDrawingEnabled
      };
    default:
      return state;
  }
}
