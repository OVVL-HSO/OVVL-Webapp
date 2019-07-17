import {Action} from '@ngrx/store';
import {AnalysisResult} from "../../../models/analysis-related/analysis.model";
import {Threat} from "../../../models/analysis-related/threat.model";

export const ANALYZE_THREAT_MODEL = '[AnalysisAction] Analyze Threat Model';
export const ANALYZE_THREAT_MODEL_COMPLETE = '[AnalysisAction] Threat Model Analysis Complete';
export const ERROR_ANALYZING_THREAT_MODEL = '[AnalysisAction] Threat Model Analysis Error';
export const UPDATE_THREAT_DATA = '[AnalysisAction] Update Threat Data';
export const UPDATE_THREAT_DATA_COMPLETE = '[AnalysisAction] Update Threat Data Complete';
export const RESET_ANALYSIS_ACTION = '[AnalysisAction] Reset Analysis Data';

export class UpdateThreatDataAction implements Action {
  readonly type = UPDATE_THREAT_DATA;

  constructor(public payload: Threat) {
  }
}

export class UpdateThreatDataCompleteAction implements Action {
  readonly type = UPDATE_THREAT_DATA_COMPLETE;
}

export class AnalyzeThreatModelAction implements Action {
  readonly type = ANALYZE_THREAT_MODEL;
}

export class AnalyzeThreatModelCompleteAction implements Action {
  readonly type = ANALYZE_THREAT_MODEL_COMPLETE;

  constructor(public payload: AnalysisResult) {
  }
}

export class ResetAnalysisDataAction implements Action {
  readonly type = RESET_ANALYSIS_ACTION;
}

export class ErrorAnalyzingThreatModelAction implements Action {
  readonly type = ERROR_ANALYZING_THREAT_MODEL;

  constructor(public error: Error) {
  }
}

export type AnalysisActions =
  AnalyzeThreatModelAction
  | AnalyzeThreatModelCompleteAction
  | ErrorAnalyzingThreatModelAction
  | UpdateThreatDataAction
  | UpdateThreatDataCompleteAction
  | ResetAnalysisDataAction;
