import {DataFlow} from '../modelling-related/dataflow.model';
import {DFDElementType} from "../types/types.model";

export interface Threat {
  threatID: string;
  strideCategory: StrideCategory;
  title: string;
  description: string;
  affectedElements: string[];
  selected?: boolean;
  applicable?: ApplicableState;
  priority?: ThreatPrority;
}

export interface ThreatViewHighlightData {
  affectedElements: (DFDElementType | DataFlow)[];
  updatedThreats: Threat[];
}

export interface ThreatSpecificationUpdate {
  value: string;
  threat: Threat;
}

export enum StrideCategory {
  SPOOFING = 'Spoofing',
  TAMPERING = 'Tampering',
  REPUDIATION = 'Repudiation',
  INFORMATION_DISCLOSURE = 'Information Disclosure',
  DENIAL_OF_SERVICE = 'Denial Of Service',
  ELEVATION_OF_PRIVILEGE = 'Elevation Of Privilege'
}

export enum ApplicableState {
  NOT_SELECTED = 'Not Selected',
  APPLICABLE = 'Applicable',
  NOT_APPLICABLE = 'Not Applicable'
}

export enum ThreatPrority {
  UNSPECIFIED = 'unspecified',
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}
