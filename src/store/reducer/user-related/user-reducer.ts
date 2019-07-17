import {
  AUTHENTICATION_ERROR,
  LOAD_PROFILE_DATA_COMPLETE,
  LOG_IN,
  LOG_IN_COMPLETE,
  SIGN_OUT_COMPLETE,
  SIGN_UP,
  UserActions
} from "../../actions/user-related/user.action";
import {Profile} from "../../../models/user-related/profile.model";

export interface UserState {
  authenticating: boolean;
  signedIn: boolean;
  authError: Error;
  profile: Profile;
}

const initialState: UserState = {
  authenticating: false,
  signedIn: false,
  authError: null,
  profile: {
    username: "",
    mail: ""
  }
};


export function userReducer(state: UserState = initialState, action: UserActions): UserState {
  switch (action.type) {
    case SIGN_UP:
    case LOG_IN:
      return {...state, authenticating: true, signedIn: false};
    case LOG_IN_COMPLETE:
      return {...state, authError: null, authenticating: false, signedIn: true};
    case SIGN_OUT_COMPLETE:
      return initialState;
    case AUTHENTICATION_ERROR:
      return {...state, authenticating: false, authError: action.error};
    case LOAD_PROFILE_DATA_COMPLETE:
      return {...state, profile: action.payload};
    default:
      return state;
  }
}
