import {Action} from '@ngrx/store';
import {CPEITem} from "../../../models/analysis-related/cpe.model";

export const SEARCH_CPE = '[CPE] Search CPE';
export const SEARCH_CPE_COMPLETE = '[CPE] Search CPE Complete';
export const RESET_CPE = '[CPE] Reset CPEs';
export const ERROR_SEARCHING_CPE = '[CPE] Error Searching CPE';

export class SearchCPEAction implements Action {
  readonly type = SEARCH_CPE;

  constructor(public payload: string) {
  }
}

export class SearchCPECompleteAction implements Action {
  readonly type = SEARCH_CPE_COMPLETE;

  constructor(public payload: CPEITem[]) {
  }
}

export class ResetCPEsAction implements Action {
  readonly type = RESET_CPE;
}

export class ErrorSearchingCPEAction implements Action {
  readonly type = ERROR_SEARCHING_CPE;
}

export type CPEActions =
  SearchCPEAction
  | SearchCPECompleteAction
  | ResetCPEsAction
  | ErrorSearchingCPEAction;
