import {
  ERROR_LOADING_INVITATIONS,
  ERROR_LOADING_STORED_WORK,
  LOAD_INVITES,
  LOAD_INVITES_COMPLETE,
  LOAD_STORED_WORK,
  LOAD_STORED_WORK_COMPLETE,
  RESET_STORAGE,
  StorageActions
} from "../../actions/user-related/storage.action";
import {StoredWork} from "../../../models/user-related/storage.model";
import {StorageUtil} from "../../../utils/storage.util";


export interface StorageState {
  loading: boolean;
  storage: StoredWork;
  error: Error;
}

const initialState: StorageState = {
  loading: false,
  storage: {
    projects: [],
    models: [],
    invites: []
  },
  error: null
};

export function storageReducer(state = initialState, action: StorageActions): StorageState {
  switch (action.type) {
    case LOAD_INVITES:
    case LOAD_STORED_WORK:
      return {
        ...state,
        loading: true
      };
    case LOAD_STORED_WORK_COMPLETE:
      // Loading is not set to false, because load invites is always called directly after.
      return {
        ...state,
        error: null,
        storage: {
          invites: [...state.storage.invites],
          projects: StorageUtil.sortProjectsByDateNewestFirst(action.payload.projects),
          models: StorageUtil.sortModelDataByDateNewestFirst(action.payload.models)
        }
      };
    case LOAD_INVITES_COMPLETE:
      return {
        ...state,
        loading: false,
        error: null,
        storage: {
          invites: action.payload,
          projects: [...state.storage.projects],
          models: [...state.storage.models]
        }
      };
    case RESET_STORAGE:
      return initialState;
    case ERROR_LOADING_INVITATIONS:
    case ERROR_LOADING_STORED_WORK:
      return {
        ...state,
        loading: false,
        error: action.error
      };
    default:
      return state;
  }
}
