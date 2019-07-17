import {Action} from '@ngrx/store';

export const REDRAW = '[Redraw] Redraw';
export const REDRAW_ALL = '[Redraw] Redraw All';
export const REDRAW_COMPLETE = '[Redraw] Redraw Complete';
export const REDRAW_ALL_COMPLETE = '[Redraw] Redraw All Complete';

export class RedrawAllAction implements Action {
  readonly type = REDRAW_ALL;
}

// FIXME: Reduce amount of times this action is called.
export class RedrawAllCompleteAction implements Action {
  readonly type = REDRAW_ALL_COMPLETE;
}

export class RedrawAction implements Action {
  readonly type = REDRAW;

  constructor(public payload: string) {
  }
}

export class RedrawCompleteAction implements Action {
  readonly type = REDRAW_COMPLETE;

  constructor(public payload: string) {
  }
}

export type RedrawActions =
  RedrawAction
  | RedrawCompleteAction
  | RedrawAllAction
  | RedrawAllCompleteAction;
