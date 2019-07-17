import {DFDElement, GenericElementType, GenericSelection, PositionedDFDElement, ScaleSelection} from './base.model';

export interface DataStore extends PositionedDFDElement, DFDElement {
  genericType: GenericElementType.DATASTORE;
  options: DataStoreOptions;
  type: DataStoreType;
}

export interface DataStoreDTO {
  id: string;
  name?: string;
  cpe?: string;
  ip?: string;
  options: DataStoreOptions;
  type: DataStoreType;
}

export interface DataStoreOptions {
  trustLevel: ScaleSelection;
  privilegeLevel: ScaleSelection;
  storesSensitiveData: GenericSelection;
  storesPersonalData: GenericSelection;
  encrypted: GenericSelection;
  removableStorage: GenericSelection;
  backup: GenericSelection;
  shared: GenericSelection;
  shellEnabled: GenericSelection;
  storesLogs: GenericSelection;
}

export enum DataStoreType {
  GENERIC = 'Generic Data Store',
  SQL_DATABASE = 'SQL Database',
  NOSQL_DATABASE = 'NoSQL Database',
  COOKIES = 'Cookies',
  SESSION_STORAGE = "Session Storage",
  CLOUD_STORAGE = 'Cloud Storage',
  DEVICE = 'Device',
  FILE = 'File',
  CACHE = 'Cache'
}
