import {Action} from "@ngrx/store";
import {ProjectModelLink} from "../../../../models/user-related/project.model";

export const LINK_MODEL = '[Project] Linking Model';
export const LINK_MODEL_COMPLETE = '[Project] Model Link Complete';
export const UNLINK_MODEL = '[Project] Unlinking Model';
export const UNLINK_MODEL_COMPLETE = '[Project] Unlinking Model Complete';
export const ERROR_LINKING_MODEL = '[Project] Error Linking Project';
export const ERROR_UNLINKING_MODEL = '[Project] Error Unlinking Project';

export class LinkModelToProjectAction implements Action {
  readonly type = LINK_MODEL;

  constructor(public payload: ProjectModelLink) {
  }
}

export class LinkModelToProjectCompleteAction implements Action {
  readonly type = LINK_MODEL_COMPLETE;
}

export class UnlinkModelFromProjectAction implements Action {
  readonly type = UNLINK_MODEL;

  constructor(public payload: ProjectModelLink) {
  }
}

export class UnlinkModelFromProjectCompleteAction implements Action {
  readonly type = UNLINK_MODEL_COMPLETE;
}

export class ErrorLinkingModelToProjectAction implements Action {
  readonly type = ERROR_LINKING_MODEL;

  constructor(public error: Error) {
  }
}

export class ErrorUnlinkingModelFromProjectAction implements Action {
  readonly type = ERROR_UNLINKING_MODEL;

  constructor(public error: Error) {
  }
}


export type ProjectLinkActions = LinkModelToProjectAction
  | LinkModelToProjectCompleteAction
  | UnlinkModelFromProjectAction
  | UnlinkModelFromProjectCompleteAction
  | ErrorLinkingModelToProjectAction
  | ErrorUnlinkingModelFromProjectAction;
