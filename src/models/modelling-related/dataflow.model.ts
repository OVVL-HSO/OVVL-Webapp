import {DataFlowConnectionInfo, DFDElement, GenericElementData, GenericElementType, GenericSelection} from './base.model';
import {PointCoordinates} from '../view-related/coordinates.model';

export interface DataFlow extends DFDElement {
  connectedElements: DataFlowConnectionInfo;
  options: DataFlowOptions;
  type?: DataFlowType;
  genericType: GenericElementType.DATAFLOW;
  position: DataFlowDrawingPosition;
}

export interface DataFlowVectorMetaData {
  originalVector: VectorCoordinates;
  updatedVector: VectorCoordinates;
  start: PointCoordinates;
  length: number;
  rotation: number;
  position: DataFlowDrawingPosition;
}

export interface DataFlowDTO {
  id: string;
  name?: string;
  cpe?: string;
  ip?: string;
  startElement: GenericElementData;
  endElement: GenericElementData;
  options: DataFlowOptions;
  type: DataFlowType;
}

export interface VectorCoordinates {
  startCoord: PointCoordinates;
  endCoord: PointCoordinates;
}

export interface DataFlowOptions {
  transfersSensitiveData: GenericSelection;
  networkType: NetworkType;
  payload: PayloadType;
  trustedNetwork: GenericSelection;
}

export enum PayloadType {
  JSON = "JSON",
  XML = "XML",
  QUERY = "Query String",
  SOAP = "SOAP",
  OTHER = "Other",
  NOT_SELECTED = 'Not Selected'
}

export enum NetworkType {
  WIRE = "Wire",
  WIFI = "Wi-Fi",
  BLUETOOTH = "Bluetooth",
  MOBILE_NETWORK = "Mobile Network",
  OTHER = "Other",
  NOT_SELECTED = 'Not Selected'
}

export enum DataFlowDrawingPosition {
  NORMAL = 'normal',
  TOP = 'top',
  BOTTOM = 'bottom'
}

export enum DataFlowType {
  GENERIC = 'Generic Data Flow',
  HTTP = 'HTTP',
  HTTPS = 'HTTPS',
  TCP_IP = 'TCP/IP',
  UDP = 'UDP',
  IPSEC = 'IPSec',
  MQTT = 'MQTT',
  FTP = 'FTP',
  SSH = 'SSH',
  SMTP = 'SMTP',
  CUSTOM = 'Custom',
  BINARY = 'Binary'
}
