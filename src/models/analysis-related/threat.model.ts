import {DataFlow} from '../modelling-related/dataflow.model';
import {DFDElementType} from "../types/types.model";
import {StrideCategory} from "./security-threat.model";

export interface Threat {
  threatID: string;
  title: string;
  description: string;
  affectedElements: string[];
  selected?: boolean;
  applicable?: ApplicableState;
  priority?: ThreatPrority;
  threatCategory: any;
}

export interface ThreatViewHighlightData {
  affectedElements: (DFDElementType | DataFlow)[];
  updatedThreats: Threat[];
}

export interface ThreatSpecificationUpdate {
  value: string;
  threat: Threat;
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
