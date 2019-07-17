import {Injectable} from "@angular/core";
import {Actions, Effect, ofType} from "@ngrx/effects";
import {catchError, map, mergeMap, switchMap} from "rxjs/operators";
import {LoadStoredWorkAction} from "../../actions/user-related/storage.action";
import {Observable, of} from "rxjs";
import {Action} from "@ngrx/store";
import {ProjectDTO, ProjectModelLink} from "../../../models/user-related/project.model";
import {ProjectService} from "../../../services/user-related/project.service";
import {CloseDetailsAction} from "../../actions/user-related/profile.action";
import {InvitationDTO} from "../../../models/user-related/invitation.model";
import {
  CREATE_PROJECT,
  CREATE_PROJECT_COMPLETE,
  CreateProjectActionComplete,
  ErrorCreatingProjectAction
} from "../../actions/user-related/projects/project-creation.action";
import {
  ErrorLinkingModelToProjectAction,
  ErrorUnlinkingModelFromProjectAction,
  LINK_MODEL,
  LINK_MODEL_COMPLETE,
  LinkModelToProjectCompleteAction,
  UNLINK_MODEL,
  UNLINK_MODEL_COMPLETE,
  UnlinkModelFromProjectCompleteAction
} from "../../actions/user-related/projects/project-link.action";
import {
  DELETE_PROJECT,
  DELETE_PROJECT_COMPLETE,
  DeleteProjectCompleteAction,
  ErrorDeletingProjectAction
} from "../../actions/user-related/projects/project-delete.action";
import {
  DECLINE_INVITATION,
  DECLINE_INVITATION_COMPLETE,
  DeclineInvitationCompleteAction, ErrorDecliningInvitationAction,
  ErrorInvitingUserAction, ErrorJoiningProjectAction,
  INVITE_USER,
  INVITE_USER_COMPLETE,
  InviteUserCompleteAction,
  JOIN_PROJECT,
  JOIN_PROJECT_COMPLETE,
  JoinProjectCompleteAction
} from "../../actions/user-related/projects/project-invitation.action";
import {ProjectErrorOrigin} from "../../actions/user-related/projects/project.action";
import {
  ErrorLeavingProjectAction,
  LEAVE_PROJECT,
  LeaveProjectCompleteAction
} from "../../actions/user-related/projects/project-leave.action";

@Injectable()
export class ProjectEffects {

  @Effect() projectRequestCompleteAction$ = this.action$.pipe(
    ofType(CREATE_PROJECT_COMPLETE,
      LINK_MODEL_COMPLETE,
      UNLINK_MODEL_COMPLETE,
      INVITE_USER_COMPLETE,
      JOIN_PROJECT_COMPLETE,
      DECLINE_INVITATION_COMPLETE,
      LEAVE_PROJECT,
      DELETE_PROJECT_COMPLETE),
    map(() => new LoadStoredWorkAction())
  );

  @Effect() createProjectAction$ = this.action$.pipe(
    ofType(CREATE_PROJECT),
    map((action: any) => action.payload),
    switchMap((projectDTO: ProjectDTO) => {
      return this.projectService.createProject(projectDTO)
        .pipe(
          map(() => new CreateProjectActionComplete()),
          catchError((error: Error) => this.createErrorObservableAndLog(error, ProjectErrorOrigin.CREATE))
        );
    })
  );

  @Effect() inviteUserAction$ = this.action$.pipe(
    ofType(INVITE_USER),
    map((action: any) => action.payload),
    switchMap((invitation: InvitationDTO) => {
      return this.projectService.inviteUser(invitation)
        .pipe(
          map(() => new InviteUserCompleteAction()),
          catchError((error: Error) => this.createErrorObservableAndLog(error, ProjectErrorOrigin.INVITE))
        );
    })
  );

  @Effect() joinProjectAction$ = this.action$.pipe(
    ofType(JOIN_PROJECT),
    map((action: any) => action.payload),
    switchMap((invitationID: string) => {
      return this.projectService.joinProject(invitationID)
        .pipe(
          map(() => new JoinProjectCompleteAction()),
          catchError((error: Error) => this.createErrorObservableAndLog(error, ProjectErrorOrigin.JOIN))
        );
    })
  );

  @Effect() leaveProjectAction = this.action$.pipe(
    ofType(LEAVE_PROJECT),
    map((action: any) => action.payload),
    switchMap((projectID: string) => {
      return this.projectService.leaveProject(projectID)
        .pipe(
          map(() => new LeaveProjectCompleteAction()),
          catchError((error: Error) => this.createErrorObservableAndLog(error, ProjectErrorOrigin.LEAVE))
        );
    })
  );

  @Effect() declineInvitationAction$ = this.action$.pipe(
    ofType(DECLINE_INVITATION),
    map((action: any) => action.payload),
    mergeMap((invitationID: string) => {
      return this.projectService.declineInvitation(invitationID)
        .pipe(
          map(() => new DeclineInvitationCompleteAction()),
          catchError((error: Error) => this.createErrorObservableAndLog(error, ProjectErrorOrigin.DECLINE))
        );
    })
  );

  @Effect() linkModelAction$ = this.action$.pipe(
    ofType(LINK_MODEL),
    map((action: any) => action.payload),
    mergeMap((projectModelLink: ProjectModelLink) => {
      return this.projectService.linkModel(projectModelLink)
        .pipe(
          map(() => new LinkModelToProjectCompleteAction()),
          catchError((error: Error) => this.createErrorObservableAndLog(error, ProjectErrorOrigin.LINK))
        );
    })
  );

  @Effect() unlinkModelAction$ = this.action$.pipe(
    ofType(UNLINK_MODEL),
    map((action: any) => action.payload),
    mergeMap((projectModelLink: ProjectModelLink) => {
      return this.projectService.unlinkModel(projectModelLink)
        .pipe(
          map(() => new UnlinkModelFromProjectCompleteAction()),
          catchError((error: Error) => this.createErrorObservableAndLog(error, ProjectErrorOrigin.UNLINK))
        );
    })
  );

  @Effect() deleteProjectAction$ = this.action$.pipe(
    ofType(DELETE_PROJECT),
    map((action: any) => action.payload),
    mergeMap((projectID: string) => {
      return this.projectService.deleteProject(projectID)
        .pipe(
          mergeMap(() => [
            new DeleteProjectCompleteAction(),
            new CloseDetailsAction()]),
          catchError((error: Error) => this.createErrorObservableAndLog(error, ProjectErrorOrigin.DELETE))
        );
    })
  );

  constructor(private action$: Actions,
              private projectService: ProjectService) {
  }


  private createErrorObservableAndLog(error, origin: ProjectErrorOrigin): Observable<Action> {
    console.error(error);
    if (origin === ProjectErrorOrigin.CREATE) {
      return of(new ErrorCreatingProjectAction(error));
    } else if (origin === ProjectErrorOrigin.LINK) {
      return of (new ErrorLinkingModelToProjectAction(error));
    } else if (origin === ProjectErrorOrigin.UNLINK) {
      return of(new ErrorUnlinkingModelFromProjectAction(error));
    } else if (origin === ProjectErrorOrigin.INVITE) {
      return of(new ErrorInvitingUserAction(error));
    } else if (origin === ProjectErrorOrigin.JOIN) {
      return of(new ErrorJoiningProjectAction(error));
    } else if (origin === ProjectErrorOrigin.DECLINE) {
      return of(new ErrorDecliningInvitationAction(error));
    } else if (origin === ProjectErrorOrigin.LEAVE) {
      return of(new ErrorLeavingProjectAction(error));
    }
    return of(new ErrorDeletingProjectAction(error));
  }
}
