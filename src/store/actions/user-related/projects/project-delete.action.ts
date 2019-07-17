import {Action} from "@ngrx/store";

export const DELETE_PROJECT = '[Project] Deleting Project';
export const DELETE_PROJECT_COMPLETE = '[Project] Deleting Project Complete';
export const ERROR_DELETING_PROJECT = '[Project] Error Deleting Project';

export class DeleteProjectAction implements Action {
  readonly type = DELETE_PROJECT;

  constructor(public payload: string) {
  }
}

export class DeleteProjectCompleteAction implements Action {

  readonly type = DELETE_PROJECT_COMPLETE;
}


export class ErrorDeletingProjectAction implements Action {
  readonly type = ERROR_DELETING_PROJECT;

  constructor(public error: Error) {
  }
}

export type ProjectDeleteActions = DeleteProjectAction  | DeleteProjectCompleteAction | ErrorDeletingProjectAction;
