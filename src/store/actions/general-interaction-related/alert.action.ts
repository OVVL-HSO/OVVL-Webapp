import {Action} from '@ngrx/store';
import {Alert} from "../../../models/alert.model";

export const SHOW_ALERT = '[AlertAction] Show Alert';
export const CLOSE_ALERT = '[AlertAction] Close Alert';

export class ShowAlertAction implements Action {
  readonly type = SHOW_ALERT;

  constructor(public payload: Alert) {
  }
}

export class CloseAlertAction implements Action {
  readonly type = CLOSE_ALERT;
}

export type AlertActions = ShowAlertAction | CloseAlertAction;
