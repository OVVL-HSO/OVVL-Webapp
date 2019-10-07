import {environment} from "../environments/environment";

export class AppConfig {
  static readonly SERVER_URL = environment.SERVER_URL;
  static readonly API_BASE_URL = AppConfig.SERVER_URL;
  static readonly LOGIN_URL = AppConfig.SERVER_URL + 'auth/signin';
  static readonly MODEL_URL = AppConfig.SERVER_URL + 'model';
  static readonly SIGN_UP_URL = AppConfig.SERVER_URL + 'auth/signup';
  static readonly PROFILE_URL = AppConfig.SERVER_URL + 'profile';
  static readonly FEEDBACK_URL = AppConfig.SERVER_URL + 'feedback';
  static readonly STORAGE_URL = AppConfig.SERVER_URL + 'storage';
  static readonly PROJECT_URL = AppConfig.SERVER_URL + 'project';
  static readonly SETTINGS_URL = AppConfig.SERVER_URL + 'settings';
}
