import {ProfileTab} from "../../../models/user-related/profile.model";
import {
  CLOSE_DETAILS,
  ProfileActions,
  RESET_PROFILE,
  SET_PROFILE_TAB,
  SHOW_MODEL_DETAILS,
  SHOW_PROJECT_DETAILS
} from "../../actions/user-related/profile.action";

export interface ProfileState {
  shownTab: ProfileTab;
  shownModel: string;
  shownProject: string;
}

const initialState: ProfileState = {
  shownTab: ProfileTab.PROJECTS,
  shownModel: "",
  shownProject: ""
};

export function profileReducer(state: ProfileState = initialState, action: ProfileActions): ProfileState {
  switch (action.type) {
    case SET_PROFILE_TAB:
      return {
        // If the tab gets changed to something else that Models and a model is currently selected, we need to deselect it.
        shownProject: state.shownProject && action.payload !== ProfileTab.PROJECTS ? "" : state.shownProject,
        // Same for Projects
        shownModel: state.shownModel && action.payload !== ProfileTab.MODELS ? "" : state.shownModel,
        shownTab: action.payload
      };
    case SHOW_MODEL_DETAILS:
      return {
        ...state,
        // If a model item is clicked again after its details already being shown, we want to close it
        shownModel: state.shownModel !== action.payload ? action.payload : ''

      };
    case SHOW_PROJECT_DETAILS:
      return {
        ...state,
        shownProject: state.shownProject !== action.payload ? action.payload : ''
      };
    case CLOSE_DETAILS:
      return {
        ...state,
        shownModel: "",
        shownProject: ""
      };
    case RESET_PROFILE:
      return initialState;
    default:
      return state;
  }
}
