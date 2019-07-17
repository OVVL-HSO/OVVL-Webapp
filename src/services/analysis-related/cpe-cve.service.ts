import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AppConfig} from '../../config/app.config';
import {GeneralUtil} from "../../utils/general.util";

@Injectable()
export class CpeCveService {
  private baseURL: string = AppConfig.API_BASE_URL;

  constructor(private http: HttpClient) {
  }

  searchForCPE(softwareName: string): Observable<any> {
    return this.http.get(this.baseURL + 'software/find?query=' + softwareName);
  }

  findCVEs(cpe: string[]) {
    return this.http.get(this.baseURL + 'software/vulnerabilities?cpes=' + GeneralUtil.combineAnArrayOfStringsToASingleString(cpe));
  }
}
