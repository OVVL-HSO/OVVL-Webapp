import {Action} from "@ngrx/store";

export const LEAVE_PROJECT = '[Project] Leaving Project';
export const LEAVE_PROJECT_COMPLETE = '[Project] Leaving Project Complete';
export const ERROR_LEAVING_PROJECT = '[Project] Error Leaving Project';

export class LeaveProjectAction implements Action {
  readonly type = LEAVE_PROJECT;

  constructor(public payload: string) {
  }
}

export class LeaveProjectCompleteAction implements Action {
  readonly type = LEAVE_PROJECT_COMPLETE;
}

export class ErrorLeavingProjectAction implements Action {
  readonly type = ERROR_LEAVING_PROJECT;

  constructor(public error: Error) {
  }
}

export type ProjectLeaveActions  =
  LeaveProjectAction
  | LeaveProjectCompleteAction
  | ErrorLeavingProjectAction;
