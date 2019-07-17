import {Action} from '@ngrx/store';
import {Modal} from "../../../models/view-related/modal.model";

export const ADD_MODAL = '[Modal] Init Modal';
export const REMOVE_MODAL = '[Modal] Close Modal';

export class AddModalAction implements Action {
  readonly type = ADD_MODAL;

  constructor(public payload: Modal) {
  }
}

export class RemoveModalAction implements Action {
  readonly type = REMOVE_MODAL;

  constructor(public payload: Modal) {
  }
}


export type ModalActions = AddModalAction | RemoveModalAction;
