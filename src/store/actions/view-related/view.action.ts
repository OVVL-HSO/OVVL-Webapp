import {Action} from '@ngrx/store';
import {StageZoom, View} from "../../../models/view-related/view.model";

export const SET_VIEW = '[View] Set View';
export const SET_ZOOM = '[View] Set Zoom Level';
export const TOGGLE_STAGE_DRAGGABILITY = '[View] Toogle Stage Draggability';
export const ZOOM_ENABLED = '[View] Toogle Zoom';
export const RESET_ZOOM = '[View] Reset Zoom';
export const RESET_ZOOM_COMPLETE = '[View] Reset Zoom Complete';

export class SetViewAction implements Action {
  readonly type = SET_VIEW;

  constructor(public payload: View) {
  }
}

export class SetZoomLevelAction implements Action {
  readonly type = SET_ZOOM;

  constructor(public payload: StageZoom) {
  }
}

export class ToggleStageDraggability implements Action {
  readonly type = TOGGLE_STAGE_DRAGGABILITY;
}

export class SetZoomEnabledAction implements Action {
  readonly type = ZOOM_ENABLED;

  constructor(public payload: boolean) {
  }
}

export class ResetZoomAction implements Action {
  readonly type = RESET_ZOOM;
}

export class ResetZoomCompleteAction implements Action {
  readonly type = RESET_ZOOM_COMPLETE;
}

export type ViewActions =
  SetViewAction
  | SetZoomLevelAction
  | SetZoomEnabledAction
  | ToggleStageDraggability
  | ResetZoomAction
  | ResetZoomCompleteAction;
