import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AppConfig} from '../../config/app.config';
import {JwtResponse} from "../../models/user-related/auth.model";
import {Observable} from "rxjs";
import {Settings} from "../../models/user-related/settings.model";

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable()
export class SettingsService {

  constructor(private http: HttpClient) {
  }

  saveSettings(settings: Settings): Observable<JwtResponse> {
    return  this.http.post<JwtResponse>(AppConfig.SETTINGS_URL, settings, httpOptions);
  }

  /*loadSettings(): Observable<JwtResponse> {
    return this.http.get<JwtResponse>(AppConfig.SETTINGS_URL, httpOptions);
  }*/

  loadSettings<T>(): Observable<T> {
    return this.http.get<T>(AppConfig.SETTINGS_URL, httpOptions);
  }

}
