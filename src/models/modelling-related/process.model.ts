import {DFDElement, GenericElementType, GenericSelection, PositionedDFDElement, ScaleSelection} from './base.model';

export interface Process extends PositionedDFDElement, DFDElement {
  genericType: GenericElementType.PROCESS;
  options: ProcessOptions;
  type: ProcessType;
}

export interface ProcessDTO {
  id: string;
  name?: string;
  cpe?: string;
  ip?: string;
  options: ProcessOptions;
  type: ProcessType;
}

export interface ProcessOptions {
  trustLevel: ScaleSelection;
  privilegeLevel: ScaleSelection;
  managed: GenericSelection;
  dataHandling: DataHandling;
  inputOrigin: InputOrigin;
  sanitizesInput: GenericSelection;
  validatesInput: GenericSelection;
  requiresAuthentication: GenericSelection;
  authenticatesItself: GenericSelection;
  ddosProtection: GenericSelection;
  customCommunicationProtocol: GenericSelection;
}

export enum DataHandling {
  PERSONAL = 'Personal Data',
  SENSITIVE = 'Sensitive Data',
  BOTH = 'Both',
  OTHER = 'Other',
  NOT_SELECTED = 'Not Selected'
}

export enum InputOrigin {
  ANYWHERE = 'Anywhere',
  INTERNAL_NETWORK = 'Internal Network',
  LOCAL_SYSTEM = 'Local System',
  NOT_SELECTED = 'Not Selected'
}

export enum ProcessType {
  GENERIC = 'Generic Process',
  WEB_SERVER = 'Web Server',
  VIRTUAL_MACHINE = 'Virtual Machine',
  THICK_CLIENT = 'Thick Client',
  THIN_CLIENT = 'Thin Client',
  THREAD = 'Thread',
  APPLICATION = 'Application',
  WEB_SERVICE = 'Web Service'
}
