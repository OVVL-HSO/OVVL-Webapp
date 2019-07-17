import {Interactor, InteractorDTO} from "./interactor.model";
import {DataFlow, DataFlowDTO} from "./dataflow.model";
import {DataStore, DataStoreDTO} from "./datastore.model";
import {Process, ProcessDTO} from "./process.model";
import {TrustBoundary} from "./trust-boundary.model";
import {BaseModelStorageData, ModelStorageData} from "../user-related/storage.model";

export interface DFDModelDTO {
  interactors: InteractorDTO[];
  dataFlows: DataFlowDTO[];
  dataStores: DataStoreDTO[];
  processes: ProcessDTO[];
  trustBoundaries: TrustBoundary[];
  modelID: string;
}

export interface StoredDFDModel {
  id: string;
  interactors: Interactor[];
  dataFlows: DataFlow[];
  dataStores: DataStore[];
  processes: Process[];
  trustBoundaries: TrustBoundary[];
}

export interface DFDModel {
  interactors: Interactor[];
  dataFlows: DataFlow[];
  dataStores: DataStore[];
  processes: Process[];
  trustBoundaries: TrustBoundary[];
  storageData: BaseModelStorageData;
}
