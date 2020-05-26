import {CVE} from './cve.model';
import {StrideThreat} from "./stride-threat.model";
import {CweThreat} from "./cwe-threat.model";

export interface AnalysisResult {
  modelID: string;
  strideThreats: StrideThreat[];
  cweThreats: CweThreat[];
  vulnerabilities: CVE[];
}

export interface AnalysisState {
  analyzingModel: boolean;
  strideThreats: StrideThreat[];
  cweThreats: CweThreat[];
  vulnerabilities: CVE[];
  error: {};
}
