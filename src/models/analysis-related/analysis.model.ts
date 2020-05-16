import {CVE} from './cve.model';
import {StrideThreat} from "./stride-threat.model";
import {PrivacyThreat} from "./privacy-threat.model";

export interface AnalysisResult {
  modelID: string;
  strideThreats: StrideThreat[];
  privacyThreats: PrivacyThreat[];
  vulnerabilities: CVE[];
}

export interface AnalysisState {
  analyzingModel: boolean;
  strideThreats: StrideThreat[];
  privacyThreats: PrivacyThreat[];
  vulnerabilities: CVE[];
  error: {};
}
