import {
  RESET_ZOOM,
  RESET_ZOOM_COMPLETE,
  SET_VIEW,
  SET_ZOOM,
  TOGGLE_STAGE_DRAGGABILITY,
  ViewActions,
  ZOOM_ENABLED
} from '../../actions/view-related/view.action';
import {View, ViewState} from "../../../models/view-related/view.model";

const initialState: ViewState = {
  currentView: View.LANDING,
  stageZoom: {
    scale: 1,
    position: {
      x: 0,
      y: 0
    },
  },
  zoomEnabled: true,
  needsReset: false,
  stageDraggable: true
};

export function viewReducer(state: ViewState = initialState, action: ViewActions): ViewState {
  switch (action.type) {
    case SET_VIEW:
      return {
        ...state,
        currentView: action.payload
      };
    case SET_ZOOM:
      return {
        ...state,
        stageZoom: action.payload
      };
    case ZOOM_ENABLED:
      return {
        ...state,
        zoomEnabled: action.payload
      };
    case RESET_ZOOM:
      return {
        ...state,
        stageZoom: {
          scale: 1,
          position: {
            x: 0,
            y: 0
          }
        },
        needsReset: true
      };
    case RESET_ZOOM_COMPLETE:
      return {
        ...state,
        stageZoom: {
          scale: 1,
          position: {
            x: 0,
            y: 0
          }
        },
        needsReset: false
      };
    case TOGGLE_STAGE_DRAGGABILITY:
      return {
        ...state,
        stageDraggable: !state.stageDraggable
      };
    default:
      return state;
  }
}
