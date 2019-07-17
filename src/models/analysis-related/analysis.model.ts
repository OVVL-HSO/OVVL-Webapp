import {Threat} from './threat.model';
import {CVE} from './cve.model';

export interface AnalysisResult {
  modelID: string;
  threats: Threat[];
  vulnerabilities: CVE[];
}

export interface AnalysisState {
  analyzingModel: boolean;
  threats: Threat[];
  vulnerabilities: CVE[];
  error: {};
}
