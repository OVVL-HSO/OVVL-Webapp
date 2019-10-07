import {
  LOAD_USER_SETTINGS,
  LOAD_USER_SETTINGS_COMPLETE,
  RESET_SETTINGS,
  SAVE_SETTINGS,
  SET_NIGHTMODE,
  SettingsActions
} from "../../actions/user-related/settings.action";

export interface SettingsState {
  darktheme: boolean;
}

const initialState: SettingsState = {darktheme: true
};

export function settingsReducer(state: SettingsState = initialState, action: SettingsActions): SettingsState {
  switch (action.type) {
    case SET_NIGHTMODE:
      return {
        ...state,
        darktheme: !state.darktheme
      };
    case RESET_SETTINGS:
      return initialState;
    case SAVE_SETTINGS:
      return state;
    case LOAD_USER_SETTINGS:
      return state;
    case LOAD_USER_SETTINGS_COMPLETE:
      return {
        ...state,
        darktheme: action.payload.darktheme
      };
    default:
      return state;
  }
}
