import {Action} from '@ngrx/store';
import {StoredWork} from "../../../models/user-related/storage.model";
import {Invitation} from "../../../models/user-related/invitation.model";

export const LOAD_STORED_WORK = '[Storage] Loading Stored Work';
export const LOAD_STORED_WORK_COMPLETE = '[Storage] Loading Stored Work Complete';
export const LOAD_INVITES = '[Storage] Loading Invites';
export const LOAD_INVITES_COMPLETE = '[Storage] Loading Invites Complete';
export const RESET_STORAGE = '[Storage] Reset Storage';
export const ERROR_LOADING_STORED_WORK = '[Storage] Error Loading Stored Work';
export const ERROR_LOADING_INVITATIONS = '[Storage] Error Loading Invitations';

export class LoadStoredWorkAction implements Action {
  readonly type = LOAD_STORED_WORK;
}

export class LoadStoredWorkCompleteAction implements Action {
  readonly type = LOAD_STORED_WORK_COMPLETE;

  constructor(public payload: StoredWork) {
  }
}

export class LoadInvitesAction implements Action {
  readonly type = LOAD_INVITES;
}

export class LoadInvitesCompleteAction implements Action {
  readonly type = LOAD_INVITES_COMPLETE;

  constructor(public payload: Invitation[]) {
  }
}

export class ResetStorageStateAction implements Action {
  readonly type = RESET_STORAGE;
}

export class ErrorLoadingInvitationsAction implements Action {
  readonly type = ERROR_LOADING_INVITATIONS;

  constructor(public error: Error) {
  }
}

export class ErrorLoadingStoredWorkAction implements Action {
  readonly type = ERROR_LOADING_STORED_WORK;

  constructor(public error: Error) {
  }
}

export type StorageActions = LoadStoredWorkAction
  | LoadStoredWorkCompleteAction
  | LoadInvitesAction
  | LoadInvitesCompleteAction
  | ResetStorageStateAction
  | ErrorLoadingInvitationsAction
  | ErrorLoadingStoredWorkAction;
