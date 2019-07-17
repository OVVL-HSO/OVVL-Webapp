import {Interactor, InteractorOptions, InteractorType} from '../models/modelling-related/interactor.model';
import {DataFlowOptions, NetworkType, PayloadType} from '../models/modelling-related/dataflow.model';
import {DataHandling, InputOrigin, Process, ProcessOptions} from '../models/modelling-related/process.model';
import {DataStoreOptions} from '../models/modelling-related/datastore.model';
import {PhysicalAccess, TrustBoundaryOptions} from "../models/modelling-related/trust-boundary.model";
import {GenericElementType, GenericSelection, ScaleSelection} from "../models/modelling-related/base.model";
import {DFDElementType} from "../models/types/types.model";

export class OptionUtil {
  static getDefaultInteractorOptions(): InteractorOptions {
    return {
      trustLevel: ScaleSelection.NOT_SELECTED,
      privilegeLevel: ScaleSelection.NOT_SELECTED,
      authenticatesItself: GenericSelection.NOT_SELECTED,
      sanitizesInput: GenericSelection.NOT_SELECTED,
    };
  }

  static getDefaultDataFlowOptions(): DataFlowOptions {
    return {
      transfersSensitiveData: GenericSelection.NOT_SELECTED,
      networkType: NetworkType.NOT_SELECTED,
      payload: PayloadType.NOT_SELECTED,
      trustedNetwork: GenericSelection.NOT_SELECTED
    };
  }

  static getDefaultProcessOptions(): ProcessOptions {
    return {
      trustLevel: ScaleSelection.NOT_SELECTED,
      privilegeLevel: ScaleSelection.NOT_SELECTED,
      managed: GenericSelection.NOT_SELECTED,
      dataHandling: DataHandling.NOT_SELECTED,
      inputOrigin: InputOrigin.NOT_SELECTED,
      sanitizesInput: GenericSelection.NOT_SELECTED,
      validatesInput: GenericSelection.NOT_SELECTED,
      requiresAuthentication: GenericSelection.NOT_SELECTED,
      authenticatesItself: GenericSelection.NOT_SELECTED,
      ddosProtection: GenericSelection.NOT_SELECTED,
      customCommunicationProtocol: GenericSelection.NOT_SELECTED
    };
  }

  static getDefaultDataStoreOptions(): DataStoreOptions {
    return {
      trustLevel: ScaleSelection.NOT_SELECTED,
      privilegeLevel: ScaleSelection.NOT_SELECTED,
      storesSensitiveData: GenericSelection.NOT_SELECTED,
      storesPersonalData:  GenericSelection.NOT_SELECTED,
      encrypted: GenericSelection.NOT_SELECTED,
      removableStorage: GenericSelection.NOT_SELECTED,
      backup: GenericSelection.NOT_SELECTED,
      shared: GenericSelection.NOT_SELECTED,
      shellEnabled: GenericSelection.NOT_SELECTED,
      storesLogs: GenericSelection.NOT_SELECTED
    };
  }

  static getDefaultTrustBoundaryOptions(): TrustBoundaryOptions {
    return {
      requiresAuthentication: GenericSelection.NOT_SELECTED,
      physicalAccess: PhysicalAccess.NOT_SELECTED,
    };
  }

  static getProcessesWhichRequireAuthenticationFromElementArray(elementsReceivingData: DFDElementType[]): Process[] {
    return elementsReceivingData
      .filter((element: DFDElementType) =>
        element.genericType === GenericElementType.PROCESS
        && element.options.requiresAuthentication === GenericSelection.YES) as Process[];
  }

  static interactorIsTypeMobileAppButDoesNotHaveAppTypeOptions(interactor: Interactor) {
    return interactor.type === InteractorType.MOBILE_APPLICATION && !interactor.options.appType;
  }

  static interactorIsTypeHumanButDoesNotHaveEmployeeSet(interactor: Interactor) {
    return interactor.type === InteractorType.HUMAN && !interactor.options.employee;
  }

  static interactorIsTypeIoTOrSensorButDoesNotHaveAccessibleSet(interactor: Interactor) {
    return (interactor.type === InteractorType.IOT_GATEWAY || interactor.type === InteractorType.SENSOR)
      && !interactor.options.accessible;
  }

  static interactorIsNeitherAppNorHumanNorIoTNorSensor(interactor: Interactor) {
    return interactor.type !== InteractorType.MOBILE_APPLICATION
      && interactor.type !== InteractorType.HUMAN
      && interactor.type !== InteractorType.IOT_GATEWAY
      && interactor.type !== InteractorType.SENSOR;
  }

  static removeAllNotDefaultOptionsFromInteractor(options: InteractorOptions): InteractorOptions {
    return {
      trustLevel: options.trustLevel,
      privilegeLevel: options.privilegeLevel,
      authenticatesItself: options.authenticatesItself,
      sanitizesInput: options.sanitizesInput
    };
  }
}
