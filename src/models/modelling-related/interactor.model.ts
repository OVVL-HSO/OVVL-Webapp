import {DFDElement, GenericElementType, GenericSelection, PositionedDFDElement, ScaleSelection} from './base.model';

export interface Interactor extends PositionedDFDElement, DFDElement {
  genericType: GenericElementType.INTERACTOR;
  options: InteractorOptions;
  type: InteractorType;
}

export interface InteractorDTO {
  id: string;
  name?: string;
  cpe?: string;
  ip?: string;
  options: InteractorOptions;
  type: InteractorType;
}

export interface InteractorOptions {
  trustLevel: ScaleSelection;
  privilegeLevel: ScaleSelection;
  authenticatesItself: GenericSelection;
  sanitizesInput: GenericSelection;
  appType?: AppType;
  employee?: GenericSelection;
  accessible?: GenericSelection;
}

export enum AppType {
  NATIVE = "Native",
  CROSS_PLATFORM = "Cross-Platform",
  HYBRID = "Hybrid",
  PWA = "Progressive Web App",
  NOT_SELECTED = 'Not Selected'
}

export enum InteractorType {
  GENERIC = 'Generic Interactor',
  WEB_APPLICATION = 'Web Application',
  MOBILE_APPLICATION = 'Mobile Application',
  HUMAN = 'Human',
  BROWSER = 'Browser',
  IOT_GATEWAY = 'IoT Gateway',
  SENSOR = 'Sensor',
  OPERATING_SYSTEM = 'Operating System',
  EXTERNAL_SYSTEM = 'External System',
  EXTERNAL_API = 'External API'
}
