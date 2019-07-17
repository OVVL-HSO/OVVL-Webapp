import {REDRAW, REDRAW_ALL, REDRAW_ALL_COMPLETE, REDRAW_COMPLETE, RedrawActions} from "../../actions/view-related/redraw.action";
import {ReducerUtil} from "../../../utils/reducer.util";

export interface RedrawState {
  elementsToBeRedrawn: string[];
  redrawAll: boolean;
}

const initialState: RedrawState = {elementsToBeRedrawn: [], redrawAll: false};

export function redrawReducer(state: RedrawState = initialState, action: RedrawActions): RedrawState {
  switch (action.type) {
    case REDRAW:
      return {
        ...state,
        elementsToBeRedrawn: [...state.elementsToBeRedrawn, action.payload]
      };
    case REDRAW_ALL:
      return {
        ...state,
        redrawAll: true
      };
    case REDRAW_COMPLETE:
      return {
        ...state,
        elementsToBeRedrawn: ReducerUtil.removeIDFromIDList(state.elementsToBeRedrawn, action.payload)
      };
    case REDRAW_ALL_COMPLETE:
      return {
        ...state,
        redrawAll: false
      };
    default:
      return state;
  }
}
