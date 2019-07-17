import {Injectable} from "@angular/core";
import {AppConfig} from "../../config/app.config";
import {HttpClient} from "@angular/common/http";
import {DFDModel} from "../../models/modelling-related/dfd.model";
import {Observable} from "rxjs";

@Injectable()
export class StorageService {
  storageUrl: string = AppConfig.STORAGE_URL;
  modelURL: string = AppConfig.MODEL_URL;

  constructor(private http: HttpClient) {
  }

  saveDFDModel<T>(threatModelDTO: DFDModel): Observable<T> {
    return this.http.post<T>(this.modelURL + '/save', threatModelDTO);
  }


  loadSavedModel<T>(modelID: string): Observable<T> {
    return this.http.get<T>(this.modelURL + '/' + modelID);
  }

  loadStoredWork<T>(): Observable<T> {
    return this.http.get<T>(this.storageUrl + '/work');
  }

  deleteDFDModel<T>(modelID: string): Observable<T> {
    return this.http.delete<T>(this.modelURL + '/delete/' + modelID);
  }

  loadInvites<T>(): Observable<T> {
    return this.http.get<T>(this.storageUrl + '/invites');
  }

}
