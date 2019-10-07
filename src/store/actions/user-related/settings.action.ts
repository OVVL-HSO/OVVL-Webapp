import {Action} from "@ngrx/store";
import {Settings} from "../../../models/user-related/settings.model";

export const SET_NIGHTMODE = '[Settings] Toggle Light/Darkmode';
export const RESET_SETTINGS = '[Settings] Reset Settings';
export const SAVE_SETTINGS = '[Settings] Save Settings';
export const SAVE_SETTINGS_COMPLETE = '[Settings] Save Settings Complete';
export const SAVE_ERROR = '[Settings] Save Settings Error';
export const LOAD_USER_SETTINGS = '[Settings] Load User Settings';
export const LOAD_USER_SETTINGS_COMPLETE = '[Settings] Load User Settings Complete';

export class ToggleNightAction implements Action {
  readonly type = SET_NIGHTMODE;
}

export class SaveSettingsAction implements Action {
    readonly type = SAVE_SETTINGS;

    constructor(public payload: Settings) {
    }
}

export class ResetSettingseAction implements Action {
  readonly type = RESET_SETTINGS;
}

export class SaveSettingsCompleteAction implements Action {
  readonly type = SAVE_SETTINGS_COMPLETE;
}

export class SaveSettingsErrorAction implements Action {
  readonly type = SAVE_ERROR;

  constructor(public error: Error) {
  }
}

export class LoadUserSettingsAction implements Action {
  readonly type = LOAD_USER_SETTINGS;
}

export class LoadUserSettingsCompleteAction implements Action {
  readonly type = LOAD_USER_SETTINGS_COMPLETE;

  constructor(public payload: Settings) {
  }
}

export type SettingsActions  =
  ToggleNightAction
  | SaveSettingsAction
  | SaveSettingsCompleteAction
  | ResetSettingseAction
  | SaveSettingsErrorAction
  | LoadUserSettingsAction
  | LoadUserSettingsCompleteAction;
