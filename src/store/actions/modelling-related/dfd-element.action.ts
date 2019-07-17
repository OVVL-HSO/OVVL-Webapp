import {Action} from '@ngrx/store';
import {DFDElementType} from "../../../models/types/types.model";
import {AddElementActions} from "./element-add.action";
import {UpdateElementActions} from "./element-update.action";
import {DeleteElementActions} from "./element-delete.action";

export const CONNECT_ELEMENT = '[DFD] Connect Element';
export const HIGHLIGHT_ELEMENT = '[DFD] Highlight Element';
export const UNSELECT_ALL_ELEMENTS = '[DFD] Unselect All Elements';
export const SET_MODEL_ID = '[DFD] Set Model ID';

export class SelectElementAction implements Action {
  readonly type = HIGHLIGHT_ELEMENT;

  constructor(public payload: DFDElementType) {
  }
}

export class ConnectElementsToDataFlowAction implements Action {
  readonly type = CONNECT_ELEMENT;

  constructor(public payload: string[]) {
  }
}

export class UnselectAllDFDElementsAction implements Action {
  readonly type = UNSELECT_ALL_ELEMENTS;
}

export class SetModelIDAction implements Action {
  readonly type = SET_MODEL_ID;

  constructor(public payload: string) {
  }
}

export type ElementActions =
  AddElementActions
  | UpdateElementActions
  | DeleteElementActions
  | ConnectElementsToDataFlowAction
  | SelectElementAction
  | SetModelIDAction
  | UnselectAllDFDElementsAction;
