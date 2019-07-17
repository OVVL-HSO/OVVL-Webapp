export interface ThreatFilter {
  stride: StrideFilter;
  priority: ThreatFilterPriority;
  applicable: ApplicableFilterState;
}

export interface CVEFilter {
  searchTerm: string;
  yearRange: NumberRange;
  severityRange: NumberRange;
}

export interface NumberRange {
  min: number;
  max: number;
}

export interface StrideFilter {
  spoofing: boolean;
  tampering: boolean;
  repudiation: boolean;
  dos: boolean;
  infoDiscl: boolean;
  elevationOfP: boolean;
}

export enum ThreatFilterPriority {
  ALL = 'all',
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

export interface ApplicableFilterState {
  notSelected: boolean;
  applicable: boolean;
  notApplicable: boolean;
}

