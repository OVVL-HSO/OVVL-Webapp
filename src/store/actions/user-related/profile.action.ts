import {Action} from '@ngrx/store';
import {ProfileTab} from "../../../models/user-related/profile.model";

export const SHOW_MODEL_DETAILS = '[Profile] Show Model Details';
export const SHOW_PROJECT_DETAILS = '[Profile] Show Project Details';
export const CLOSE_DETAILS = '[Profile] Close Details';
export const SET_PROFILE_TAB = '[Profile] Set Profile Tab';
export const RESET_PROFILE = '[Profile] Reset Profile';


export class SetProfileTabAction implements Action {
  readonly type = SET_PROFILE_TAB;

  constructor(public payload: ProfileTab) {
  }
}

export class ResetProfileStateAction implements Action {
  readonly type = RESET_PROFILE;
}

export class ShowModelDetailsAction implements Action {
  readonly type = SHOW_MODEL_DETAILS;

  constructor(public payload: string) {
  }
}

export class ShowProjectDetailsAction implements Action {
  readonly type = SHOW_PROJECT_DETAILS;

  constructor(public payload: string) {
  }
}

export class CloseDetailsAction implements Action {
  readonly type = CLOSE_DETAILS;
}

export type ProfileActions =
  ShowModelDetailsAction
  | CloseDetailsAction
  | ShowProjectDetailsAction
  | ResetProfileStateAction
  | SetProfileTabAction;
