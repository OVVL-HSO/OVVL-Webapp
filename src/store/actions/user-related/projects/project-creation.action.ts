import {Action} from "@ngrx/store";
import {ProjectDTO} from "../../../../models/user-related/project.model";

export const ERROR_CREATING_PROJECT = '[Project] Error Creating Project';
export const INIT_PROJECT_CREATION = '[Project] Init Project Creation';
export const CANCEL_PROJECT_CREATION = '[Project] Cancel Project Creation';
export const CREATE_PROJECT = '[Project] Create Project';
export const CREATE_PROJECT_COMPLETE = '[Project] Create Project Complete';

export class InitProjectCreationAction implements Action {
  readonly type = INIT_PROJECT_CREATION;
}

export class CancelProjectCreationAction implements Action {
  readonly type = CANCEL_PROJECT_CREATION;
}

export class CreateProjectAction implements Action {
  readonly type = CREATE_PROJECT;

  constructor(public payload: ProjectDTO) {
  }
}

export class CreateProjectActionComplete implements Action {
  readonly type = CREATE_PROJECT_COMPLETE;
}

export class ErrorCreatingProjectAction implements Action {
  readonly type = ERROR_CREATING_PROJECT;

  constructor(public error: Error) {
  }
}

export type ProjectCreationActions  =
  InitProjectCreationAction
  | CancelProjectCreationAction
  | CreateProjectAction
  | CreateProjectActionComplete
  | ErrorCreatingProjectAction
