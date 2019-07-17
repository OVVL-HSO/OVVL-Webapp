export interface CVE {
  cveID: string;
  assigner: string;
  dataFormat: string;
  dataVersion: string;
  publishedDate: string;
  lastModifiedDate: string;
  affects: VendorData[];
  problemTypes: ProblemType[];
  references: Reference[];
  descriptions: VulnerabilityDescription[];
  vulnerableConfig: VulnerableConfiguration;
  cvss: CVSS;
  selected?: boolean;
}

export interface VendorData {
  vendorName: string;
  products: Product[];
}

export interface Product {
  productName: string;
  versionData: VersionData[];
}

export interface VersionData {
  versionValue: string;
  versionAffected: string;
}

export interface ProblemType {
  descriptions: ProblemTypeDescription[];
}

export interface ProblemTypeDescription {
  language: string;
  cweID: string;
}

export interface Reference {
  url: string;
  name: string;
  refSource: string;
  tags: string[];
}

export interface VulnerabilityDescription {
  language: string;
  content: string;
}

export interface VulnerableConfiguration {
  cveDataVersion: string;
  configs: Config[];
}

export interface Config {
  operator: Operator;
  cpeMatches?: CPEMatch[];
  children?: Config[];
}

export interface CPEMatch {
  vulnerable: boolean;
  cpe23URI: string;
  versionStartIncluding: string;
  versionStartExcluding: string;
  versionEndIncluding: string;
  versionEndExcluding: string;
}

export interface CVSS {
  cvssv3Metric: CVSSv3;
  cvssv2Metric: CVSSv2;
}

export interface CVSSv3 {
  baseScore: number;
  exploitabilitiyScore: number;
  impactScore: number;
  baseSeverity: string;
  version: string;
  vectorString: string;
  attackVector: AttackVector;
  attackComplexity: AttackComplexity;
  privilegesRequired: RequiredPrivileges;
  userInteraction: UserInteraction;
  scope: Scope;
  confidentialityImpact: Impact;
  integrityImpact: Impact;
  availabilityImpact: Impact;
}

export interface CVSSv2 {
  version: string;
  vectorString: string;
  baseScore: number;
  exploitabilityScore: number;
  impactScore: number;
  acInsufInfo: boolean;
  obtainAllPrivileges: boolean;
  obtainUserPrivileges: boolean;
  obtainOtherPrivilege: boolean;
  userInteractionRequired: boolean;
  accessVector: string;
  accessComplexity: string;
  authentication: string;
  confidentialityImpact: string;
  integrityImpact: string;
  availabilityImpact: string;
}

export enum Operator {
  AND = 'AND',
  OR = 'OR',
}

export enum AttackVector {
  NETWORK = 'NETWORK',
  ADJACENT_NETWORK = 'ADJACENT_NETWORK',
  LOCAL = 'LOCAL',
  PHYSICAL = 'PHYSICAL'
}

export enum AttackComplexity {
  LOW = 'LOW',
  HIGH = 'HIGH'
}

export enum RequiredPrivileges {
  NONE = 'NONE',
  LOW = 'LOW',
  HIGH = 'HIGH'
}

export enum UserInteraction {
  NONE = 'NONE',
  REQUIRED = 'REQUIRED'
}

export enum Scope {
  CHANGED = 'CHANGED',
  UNCHANGED = 'UNCHANGED'
}

export enum Impact {
  NONE = 'NONE',
  LOW = 'LOW',
  HIGH = 'HIGH'
}
