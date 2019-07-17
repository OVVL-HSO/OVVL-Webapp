import {Action} from '@ngrx/store';
import {UserLogin, UserSignUp} from "../../../models/user-related/user.model";
import {Profile} from "../../../models/user-related/profile.model";
import {View} from "../../../models/view-related/view.model";

export const LOG_IN = '[User] Logging in';
export const LOG_IN_COMPLETE = '[User] Log In Complete';
export const SIGN_UP = '[User] Signing Up';
export const SIGN_UP_COMPLETE = '[User] Sign Up Complete';
export const SIGN_OUT = '[User] Sign Out';
export const SIGN_OUT_COMPLETE = '[User] Sign Out Complete';
export const AUTHENTICATION_ERROR = '[User] Authentication Error';
export const LOAD_PROFILE_DATA = '[User] Loading Profile Data';
export const LOAD_PROFILE_DATA_COMPLETE = '[User] Loading Profile Data Complete';

export class SignUpAction implements Action {
  readonly type = SIGN_UP;

  constructor(public payload: UserSignUp) {
  }
}

export class AuthenticationErrorAction implements Action {
  readonly type = AUTHENTICATION_ERROR;

  constructor(public error: Error) {
  }
}

export class SignUpCompleteAction implements Action {
  readonly type = SIGN_UP_COMPLETE;
}

export class LoginAction implements Action {
  readonly type = LOG_IN;

  constructor(public payload: UserLogin) {
  }
}

export class SignOutAction implements Action {
  readonly type = SIGN_OUT;
  constructor(public payload: View) {
  }
}

export class SignOutCompleteAction implements Action {
  readonly type = SIGN_OUT_COMPLETE;
}

export class LoginCompleteAction implements Action {
  readonly type = LOG_IN_COMPLETE;
}

export class LoadProfileDataAction implements Action {
  readonly type = LOAD_PROFILE_DATA;
}

export class LoadProfileDataCompleteAction implements Action {
  readonly type = LOAD_PROFILE_DATA_COMPLETE;

  constructor(public payload: Profile) {
  }
}

export type UserActions =
  AuthenticationErrorAction
  | LoginAction
  | LoginCompleteAction
  | SignUpAction
  | SignUpCompleteAction
  | SignOutAction
  | SignOutCompleteAction
  | LoadProfileDataAction
  | LoadProfileDataCompleteAction;
