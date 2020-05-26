import {Threat} from "./threat.model";

export interface CweThreat extends Threat {
  cwe: Cwe;
}

export interface Cwe {
  id: number;
  name: string;
  description: string;
  detectionMethods: DetectionMethod[];
  potentialMitigations: PotentialMitigation[];
  commonConsequences: CommonConsequence[];
  analysisInformation: AnalysisInformation;
}

export interface DetectionMethod {
  method: string;
  description: string;
  effectiveness: string;
  effectivenessNotes: string;
}

export interface PotentialMitigation {
  phase: string;
  strategy: string;
  description: string;
}

export interface CommonConsequence {
  scope: string[];
  impact: string[];
  note: string[];
}

export interface AnalysisInformation {
  cwePercentageInSelection: number;
  spoofingProportion: number;
  tamperingProportion: number;
  repudiationProportion: number;
  informationDisclosureProportion: number;
  denialOfServiceProportion: number;
  elevationOfPrivilegeProportion: number;
  meanBaseScore: number;
  meanImpactScore: number;
  meanExploitabilityScore: number;
}
