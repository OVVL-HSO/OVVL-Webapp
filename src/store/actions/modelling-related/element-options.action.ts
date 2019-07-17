import {Action} from '@ngrx/store';
import {OptionState} from "../../reducer/modelling-related/element-options.reducer";
import {DFDComponent} from "../../../models/types/types.model";

export const INIT_OPTION_VIEW = '[Options] Init Options View';
export const OPEN_OPTIONS_VIEW = '[Options] Open Options View';
export const CLOSE_OPTIONS_VIEW = '[Options] Close Options View';


export class InitOptionsViewAction implements Action {
  readonly type = INIT_OPTION_VIEW;

  constructor(public payload: DFDComponent) {
  }
}

export class OpenOptionsViewAction implements Action {
  readonly type = OPEN_OPTIONS_VIEW;

  constructor(public payload: OptionState) {
  }
}

export class CloseOptionsViewAction implements Action {
  readonly type = CLOSE_OPTIONS_VIEW;
}

export type ElementOptionsActions = InitOptionsViewAction
  | OpenOptionsViewAction
  | CloseOptionsViewAction;
