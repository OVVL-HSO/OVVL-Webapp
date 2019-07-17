import {AnalysisState} from '../../../models/analysis-related/analysis.model';
import {
  AnalysisActions,
  ANALYZE_THREAT_MODEL,
  ANALYZE_THREAT_MODEL_COMPLETE,
  ERROR_ANALYZING_THREAT_MODEL,
  RESET_ANALYSIS_ACTION
} from '../../actions/analysis-related/analysis.action';

const initialState: AnalysisState = {
  analyzingModel: false,
  threats: [],
  vulnerabilities: [],
  error: {}
};

export function analysisReducer(state = initialState, action: AnalysisActions): AnalysisState {
  switch (action.type) {
    case ANALYZE_THREAT_MODEL:
      return {
        ...state,
        analyzingModel: true,
        error: {},
        threats: [...state.threats],
        vulnerabilities: [...state.vulnerabilities]
      };
    case ANALYZE_THREAT_MODEL_COMPLETE:
      return {
        ...state,
        analyzingModel: false,
        threats: action.payload.threats,
        vulnerabilities: action.payload.vulnerabilities,
        error: {}
      };
    case ERROR_ANALYZING_THREAT_MODEL:
      return {
        ...state,
        analyzingModel: false,
        threats: [...state.threats],
        vulnerabilities: [...state.vulnerabilities],
        error: action.error
      };
    case RESET_ANALYSIS_ACTION:
      return initialState;
    default:
      return state;
  }
}
