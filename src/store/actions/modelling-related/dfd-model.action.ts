import {Action} from "@ngrx/store";
import {BaseModelStorageData} from "../../../models/user-related/storage.model";

export const LOAD_SAVED_DFD = '[Storage] Loading DFD';
export const LOAD_SAVED_DFD_COMPLETE = '[Storage] Loading DFD Complete';
export const INIT_SAVE_DFD = '[Storage] Initialize Saving DFD';
export const SAVE_DFD = '[Storage] Saving DFD';
export const SAVE_DFD_COMPLETE = '[Storage] Saving DFD Complete';
export const ERROR_SAVING_DFD = '[Storage] Error Saving DFD';
export const ERROR_LOADING_DFD = '[Storage] Error Loading DFD';
export const DELETE_DFD = '[Storage] Deleting DFD';
export const DELETE_DFD_COMPLETE = '[Storage] Deleting DFD Complete';
export const ERROR_DELETING_DFD = '[Storage] Error Deleting Model';

export class LoadSavedDFDAction implements Action {
  readonly type = LOAD_SAVED_DFD;

  constructor(public payload: string) {
  }
}

export class LoadSaveDFDCompleteAction implements Action {
  readonly type = LOAD_SAVED_DFD_COMPLETE;
}

export class InitDFDSavingProcessAction implements Action {
  readonly type = INIT_SAVE_DFD;

  constructor(public payload: string) {
  }
}

export class DeleteDFDAction implements Action {
  readonly type = DELETE_DFD;

  constructor(public payload: string) {
  }
}

export class DeleteDFDCompleteAction implements Action {
  readonly type = DELETE_DFD_COMPLETE;
}

export class SaveDFDAction implements Action {
  readonly type = SAVE_DFD;

  constructor(public payload: BaseModelStorageData) {
  }
}

export class SavingDFDCompleteAction implements Action {
  readonly type = SAVE_DFD_COMPLETE;
}

export class ErrorSavingDFDAction implements Action {
  readonly type = ERROR_SAVING_DFD;

  constructor(public error: Error) {
  }
}

export class ErrorLoadingDFDAction implements Action {
  readonly type = ERROR_LOADING_DFD;

  constructor(public error: Error) {
  }
}

export class ErrorDeletingDFDAction implements Action {
  readonly type = ERROR_DELETING_DFD;

  constructor(public error: Error) {
  }
}

export type DfdModelActions = LoadSavedDFDAction
  | LoadSaveDFDCompleteAction
  | InitDFDSavingProcessAction
  | SaveDFDAction
  | ErrorSavingDFDAction
  | ErrorLoadingDFDAction
  | DeleteDFDAction
  | DeleteDFDCompleteAction
  | ErrorDeletingDFDAction
  | SavingDFDCompleteAction;
