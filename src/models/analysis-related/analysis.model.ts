import {CVE} from './cve.model';
import {SecurityThreat} from "./security-threat.model";
import {PrivacyThreat} from "./privacy-threat.model";

export interface AnalysisResult {
  modelID: string;
  securityThreats: SecurityThreat[];
  privacyThreats: PrivacyThreat[];
  vulnerabilities: CVE[];
}

export interface AnalysisState {
  analyzingModel: boolean;
  securityThreats: SecurityThreat[];
  privacyThreats: PrivacyThreat[];
  vulnerabilities: CVE[];
  error: {};
}
