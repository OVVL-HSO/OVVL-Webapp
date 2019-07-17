import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Store} from '@ngrx/store';
import {State} from '../../store';
import {Observable} from 'rxjs';
import {AppConfig} from '../../config/app.config';
import {DFDModelDTO} from "../../models/modelling-related/dfd.model";
import {AnalysisResult} from "../../models/analysis-related/analysis.model";
import {Threat} from "../../models/analysis-related/threat.model";

@Injectable()
export class ThreatModelService {
  baseURL: string = AppConfig.API_BASE_URL;

  constructor(private http: HttpClient, private store: Store<State>) {
  }

  analyzeDFDModelForThreats(dfdModel: DFDModelDTO): Observable<AnalysisResult> {
    return this.http.post<AnalysisResult>(this.baseURL + 'model/analyze/', dfdModel);
  }

  updateThreatData(payload: Threat) {
    return this.http.post<AnalysisResult>(this.baseURL + 'model/threat-update/', payload);
  }
}
