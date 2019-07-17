import {ProjectActions} from "../../actions/user-related/projects/project.action";
import {
  CANCEL_PROJECT_CREATION,
  CREATE_PROJECT,
  CREATE_PROJECT_COMPLETE, ERROR_CREATING_PROJECT,
  INIT_PROJECT_CREATION
} from "../../actions/user-related/projects/project-creation.action";
import {
  DECLINE_INVITATION, DECLINE_INVITATION_COMPLETE,
  ERROR_INVITING_USER,
  ERROR_JOINING_PROJECT,
  INVITE_USER,
  INVITE_USER_COMPLETE,
  JOIN_PROJECT,
  JOIN_PROJECT_COMPLETE
} from "../../actions/user-related/projects/project-invitation.action";
import {
  ERROR_LINKING_MODEL, ERROR_UNLINKING_MODEL,
  LINK_MODEL,
  LINK_MODEL_COMPLETE,
  UNLINK_MODEL,
  UNLINK_MODEL_COMPLETE
} from "../../actions/user-related/projects/project-link.action";
import {DELETE_PROJECT, DELETE_PROJECT_COMPLETE, ERROR_DELETING_PROJECT} from "../../actions/user-related/projects/project-delete.action";
import {ERROR_LEAVING_PROJECT, LEAVE_PROJECT, LEAVE_PROJECT_COMPLETE} from "../../actions/user-related/projects/project-leave.action";

export interface ProjectState {
  creatingProject: boolean;
  loading: boolean;
  error?: Error;
}

const initialState: ProjectState = {
  creatingProject: false,
  loading: false
};

export function projectReducer(state: ProjectState = initialState, action: ProjectActions): ProjectState {
  switch (action.type) {
    case INIT_PROJECT_CREATION:
      return {
        ...state,
        creatingProject: true
      };
    case CANCEL_PROJECT_CREATION:
      return {
        ...state,
        creatingProject: false
      };
    case LEAVE_PROJECT:
    case DECLINE_INVITATION:
    case JOIN_PROJECT:
    case INVITE_USER:
    case LINK_MODEL:
    case UNLINK_MODEL:
    case DELETE_PROJECT:
    case CREATE_PROJECT:
      return {
        ...state,
        loading: true
      };
    case LEAVE_PROJECT_COMPLETE:
    case DECLINE_INVITATION_COMPLETE:
    case JOIN_PROJECT_COMPLETE:
    case INVITE_USER_COMPLETE:
    case LINK_MODEL_COMPLETE:
    case UNLINK_MODEL_COMPLETE:
    case DELETE_PROJECT_COMPLETE:
    case CREATE_PROJECT_COMPLETE:
      return {
        ...state,
        creatingProject: false,
        loading: false,
        error: null
      };
    case ERROR_LEAVING_PROJECT:
    case ERROR_JOINING_PROJECT:
    case ERROR_INVITING_USER:
    case ERROR_LINKING_MODEL:
    case ERROR_UNLINKING_MODEL:
    case ERROR_DELETING_PROJECT:
    case ERROR_CREATING_PROJECT:
      return {
        ...state,
        loading: false,
        error: action.error
      };
    default:
      return state;
  }
}
