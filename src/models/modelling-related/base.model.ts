import {PointCoordinates} from '../view-related/coordinates.model';
import {CPEITem} from '../analysis-related/cpe.model';
import {DFDElementType} from "../types/types.model";

export interface DFDElement {
  id: string;
  name?: string;
  cpe?: CPEITem;
  selected?: boolean;
  ip?: string;
}

export interface PositionedDFDElement extends DFDElement {
  coordinates: PointCoordinates;
  connectedToDataFlow?: boolean;
}

export interface BaseDFDElement {
  type: GenericElementType;
  coordinates: PointCoordinates;
}

export interface GenericElementData {
  id: string;
  type: GenericElementType;
}

// This interface is used so a dataflow knows the position of the connected elements
export interface GenericConnectedElement {
  id: string;
  coordinates: PointCoordinates;
  type: GenericElementType;
}

export interface DataFlowConnectionInfo {
  startElement: GenericConnectedElement;
  endElement: GenericConnectedElement;
}

export interface ElementRelationInfo {
  elementsSendingData: DFDElementType[];
  elementsReceivingData: DFDElementType[];
}

export enum GenericElementType {
  PROCESS = 'process',
  INTERACTOR = 'interactor',
  DATASTORE = 'datastore',
  DATAFLOW = 'dataflow',
  TRUST_BOUNDARY = 'trustboundary'
}

export enum GenericSelection {
  YES = "Yes",
  NO = "No",
  NOT_SELECTED = "Not Selected"
}

export enum ScaleSelection {
  LOW = "Low",
  MEDIUM = "Medium",
  HIGH = "High",
  NOT_SELECTED = "Not Selected"
}
