import {Action} from "@ngrx/store";
import {InvitationDTO} from "../../../../models/user-related/invitation.model";

export const INVITE_USER = '[Project] Inviting User';
export const INVITE_USER_COMPLETE = '[Project] Inviting User Complete';
export const JOIN_PROJECT = '[Project] Joining Project';
export const DECLINE_INVITATION = '[Project] Declining Invitation Complete';
export const DECLINE_INVITATION_COMPLETE = '[Project] Invitation Declined';
export const JOIN_PROJECT_COMPLETE = '[Project] Joining Project Complete';
export const ERROR_INVITING_USER = '[Project] Error Inviting User';
export const ERROR_JOINING_PROJECT = '[Project] Error Joining Project';
export const ERROR_DECLINING_INVITATION = '[Project] Error Declining Invitation';


export class InviteUserAction implements Action {
  readonly type = INVITE_USER;

  constructor(public payload: InvitationDTO) {
  }
}

export class InviteUserCompleteAction implements Action {
  readonly type = INVITE_USER_COMPLETE;
}

export class JoinProjectAction implements Action {
  readonly type = JOIN_PROJECT;

  constructor(public payload: string) {
  }
}

export class JoinProjectCompleteAction implements Action {
  readonly type = JOIN_PROJECT_COMPLETE;
}

export class DeclineInvitationAction implements Action {
  readonly type = DECLINE_INVITATION;

  constructor(public payload: string) {
  }
}

export class DeclineInvitationCompleteAction implements Action {
  readonly type = DECLINE_INVITATION_COMPLETE;
}

export class ErrorInvitingUserAction implements Action {
  readonly type = ERROR_INVITING_USER;

  constructor(public error: Error) {
  }
}

export class ErrorJoiningProjectAction implements Action {
  readonly type = ERROR_JOINING_PROJECT;

  constructor(public error: Error) {
  }
}

export class ErrorDecliningInvitationAction implements Action {
  readonly type = ERROR_DECLINING_INVITATION;

  constructor(public error: Error) {
  }
}

export type ProjectInvitationActions = InviteUserAction
  | InviteUserCompleteAction
  | JoinProjectAction
  | JoinProjectCompleteAction
  | DeclineInvitationAction
  | DeclineInvitationCompleteAction
  | ErrorInvitingUserAction
  | ErrorJoiningProjectAction
  | ErrorDecliningInvitationAction;
