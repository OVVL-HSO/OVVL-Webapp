import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AppConfig} from '../../config/app.config';
import {JwtResponse} from "../../models/user-related/auth.model";
import {Observable} from "rxjs";
import {UserExists, UserLogin, UserSignUp} from "../../models/user-related/user.model";
import {Profile} from "../../models/user-related/profile.model";

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable()
export class UserService {

  constructor(private http: HttpClient) {
  }

  login(credentials: UserLogin): Observable<JwtResponse> {
    return this.http.post<JwtResponse>(AppConfig.LOGIN_URL, credentials, httpOptions);
  }

  signUp(info: UserSignUp): Observable<string> {
    return this.http.post<string>(AppConfig.SIGN_UP_URL, info, httpOptions);
  }

  loadUserData(): Observable<Profile> {
    return this.http.get<Profile>(AppConfig.PROFILE_URL + "/info", httpOptions);
  }

  userExists(username: string): Observable<UserExists> {
    return this.http.get<UserExists>(AppConfig.PROFILE_URL + "/" + username, httpOptions);
  }
}
