import {DRAGGING_ELEMENT, DROPPING_ELEMENT, HOVERING_ON_TRASH, TrashActions} from "../../actions/general-interaction-related/trashcan.action";

export interface TrashcanState {
  draggingElement: boolean;
  hoveringOnTrash: boolean;
}

const initialState: TrashcanState = {draggingElement: false, hoveringOnTrash: false};

export function trashcanReducer(state: TrashcanState = initialState, action: TrashActions): TrashcanState {
  switch (action.type) {
    case DRAGGING_ELEMENT:
      return {
        ...state,
        draggingElement: true
      };
    case HOVERING_ON_TRASH:
      return {
        ...state,
        hoveringOnTrash: action.payload
      };
    case DROPPING_ELEMENT:
      return initialState;
    default:
      return state;
  }
}
