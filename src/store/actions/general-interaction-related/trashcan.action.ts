import {Action} from '@ngrx/store';

export const DRAGGING_ELEMENT = '[Trash] Dragging Element';
export const DROPPING_ELEMENT = '[Trash] Dropped Element';
export const HOVERING_ON_TRASH = '[Trash] Hovering on Trashcan';

export class DraggingElementAction implements Action {
  readonly type = DRAGGING_ELEMENT;
}

export class HoveringOnTrashAction implements Action {
  readonly type = HOVERING_ON_TRASH;

  constructor(public payload: boolean) {
  }
}

export class DroppingElementAction implements Action {
  readonly type = DROPPING_ELEMENT;
}

export type TrashActions =
  DraggingElementAction
  | DroppingElementAction
  | HoveringOnTrashAction;
