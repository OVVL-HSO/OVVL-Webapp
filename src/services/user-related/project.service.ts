import {Injectable} from "@angular/core";
import {AppConfig} from "../../config/app.config";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ProjectDTO, ProjectModelLink} from "../../models/user-related/project.model";
import {InvitationDTO} from "../../models/user-related/invitation.model";

@Injectable()
export class ProjectService {
  projectURL: string = AppConfig.PROJECT_URL;

  constructor(private http: HttpClient) {
  }

  createProject<T>(project: ProjectDTO): Observable<T> {
    return this.http.post<T>(this.projectURL + '/create', project);
  }

  deleteProject<T>(projectID: string): Observable<T> {
    return this.http.delete<T>(this.projectURL + '/delete/' + projectID);
  }

  unlinkModel<T>(projectModelLink: ProjectModelLink): Observable<T>  {
    return this.http.post<T>(this.projectURL + '/unlink-model', projectModelLink);
  }

  linkModel<T>(projectModelLink: ProjectModelLink): Observable<T> {
    return this.http.post<T>(this.projectURL + '/link-model', projectModelLink);

  }

  inviteUser<T>(invitation: InvitationDTO): Observable<T> {
    return this.http.post<T>(this.projectURL + '/invite', invitation);

  }

  joinProject<T>(invitationID: string): Observable<T> {
    return this.http.post<T>(this.projectURL + '/accept-invitation/' + invitationID, {});
  }

  declineInvitation<T>(invitationID: string): Observable<T> {
    return this.http.post<T>(this.projectURL + '/decline-invitation/' + invitationID, {});
  }

  leaveProject<T>(projectID: string): Observable<T> {
    return this.http.post<T>(this.projectURL + '/leave/' + projectID, {});
  }
}
