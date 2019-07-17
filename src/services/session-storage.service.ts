import {JwtResponse} from "../models/user-related/auth.model";

const TOKEN_KEY = 'AuthToken';

export class SessionStorageService {

  static storeJWTData(jwtData: JwtResponse) {
    this.saveToken(jwtData.accessToken);
  }

  static isSignedIn(): boolean {
    return (!!sessionStorage.getItem(TOKEN_KEY));
  }

  static getToken(): string {
    return sessionStorage.getItem(TOKEN_KEY);
  }

  static signOut() {
    window.sessionStorage.clear();
  }

  private static saveToken(token: string) {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }
}
