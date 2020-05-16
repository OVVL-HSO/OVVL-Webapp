import {PointCoordinates} from "../view-related/coordinates.model";
import {GenericElementType, GenericSelection} from "./base.model";
import {CPEITem} from "../analysis-related/cpe.model";

export interface TrustBoundary {
  id: string;
  coordinates: PointCoordinates;
  width: number;
  height: number;
  name: string;
  genericType: GenericElementType.TRUST_BOUNDARY;
  type: TrustBoundaryType;
  cpe?: CPEITem[];
  options: TrustBoundaryOptions;
  elements: string[];
  ip: string;
}

export interface BoundaryMetaData {
  boundaryPosition: PointCoordinates;
  width: number;
  height: number;
}

export interface TrustBoundaryOptions {
  requiresAuthentication: GenericSelection;
  physicalAccess: PhysicalAccess;
}

export enum PhysicalAccess {
  ANYONE = 'Anyone',
  CLEARANCE = 'Requires Clearance',
  NOT_SELECTED = 'Not Selected'
}

export enum TrustBoundaryType {
  GENERIC = 'Generic Trust Boundary',
  INTERNAL_NETWORK = 'Internal Network',
  EXTERNAL_NETWORK = 'External Network',
  PHYSICAL_BOUNDARY = 'Physical Boundary',
  LOCAL_SYSTEM = 'Local System'
}
