import {PointCoordinates} from "../models/view-related/coordinates.model";
import {Interactor, InteractorType} from "../models/modelling-related/interactor.model";
import {DataStore, DataStoreType} from "../models/modelling-related/datastore.model";
import {Process, ProcessType} from "../models/modelling-related/process.model";
import {
  DataFlowConnectionInfo, ElementRelationInfo,
  GenericConnectedElement,
  GenericElementData,
  GenericElementType
} from "../models/modelling-related/base.model";
import {OptionUtil} from "./option.util";
import {v4 as uuid} from 'uuid';
import {DataFlow, DataFlowDrawingPosition, DataFlowType} from "../models/modelling-related/dataflow.model";
import {BoundaryMetaData, TrustBoundary, TrustBoundaryType} from "../models/modelling-related/trust-boundary.model";
import {StoredDFDModel} from "../models/modelling-related/dfd.model";
import {DFDComponent, DFDElementType} from "../models/types/types.model";
import {GeneralUtil} from "./general.util";
import {DFDElementState} from "../store/reducer/modelling-related/dfd-element.reducer";
import {DataFlowUtil} from "./data-flow.util";

export class ElementUtil {

  static getEmptyDFDModel(): StoredDFDModel {
    return {
      id: "",
      interactors: [],
      processes: [],
      dataStores: [],
      dataFlows: [],
      trustBoundaries: []
    };
  }

  static createDefaultInteractor(coordinates: PointCoordinates): Interactor {
    return {
      id: uuid(),
      name: "Interactor",
      coordinates: GeneralUtil.roundCoordinates(coordinates),
      genericType: GenericElementType.INTERACTOR,
      type: InteractorType.GENERIC,
      options: OptionUtil.getDefaultInteractorOptions(),
      selected: false,
      ip: ""
    };
  }

  static createDefaultProcess(coordinates: PointCoordinates): Process {
    return {
      id: uuid(),
      name: "Process",
      coordinates: GeneralUtil.roundCoordinates(coordinates),
      genericType: GenericElementType.PROCESS,
      type: ProcessType.GENERIC,
      options: OptionUtil.getDefaultProcessOptions(),
      selected: false,
      ip: ""
    };
  }

  static createDefaultDataStore(coordinates: PointCoordinates): DataStore {
    return {
      id: uuid(),
      name: "Data Store",
      coordinates: GeneralUtil.roundCoordinates(coordinates),
      genericType: GenericElementType.DATASTORE,
      type: DataStoreType.GENERIC,
      options: OptionUtil.getDefaultDataStoreOptions(),
      selected: false,
      ip: ""
    };
  }

  static createDefaultDataFlow(connectedElements: DataFlowConnectionInfo): DataFlow {
    return {
      id: uuid(),
      name: "Data Flow",
      connectedElements: connectedElements,
      genericType: GenericElementType.DATAFLOW,
      type: DataFlowType.GENERIC,
      options: OptionUtil.getDefaultDataFlowOptions(),
      position: DataFlowDrawingPosition.NORMAL,
      ip: ""
    };
  }

  static createDefaultTrustBoundary(boundaryData: BoundaryMetaData): TrustBoundary {
    return {
      id: uuid(),
      name: "Trust Boundary",
      coordinates: GeneralUtil.roundCoordinates(boundaryData.boundaryPosition),
      width: boundaryData.width,
      height: boundaryData.height,
      genericType: GenericElementType.TRUST_BOUNDARY,
      type: TrustBoundaryType.GENERIC,
      ip: "",
      elements: null,
      options: OptionUtil.getDefaultTrustBoundaryOptions()
    };
  }

  static createGenericConnectedElement(dfdElement: DFDElementType): GenericConnectedElement {
    return {
      id: dfdElement.id,
      coordinates: dfdElement.coordinates,
      type: dfdElement.genericType
    };
  }

  static createGenericElement(element: DFDElementType | DataFlow | TrustBoundary): GenericElementData {
    return {
      id: element.id,
      type: element.genericType
    };
  }

  static filterOutDataStoresFromAnElementList(elementList: (DFDElementType | DataFlow)[]) {
    return elementList.filter((affectedElement) => affectedElement.genericType !== GenericElementType.DATAFLOW);
  }

  static findDFDElementOrDataFlowByID(dfdElements: (DFDElementType | DataFlow)[],
                                      elementID: string): DFDElementType | DataFlow {
    return dfdElements.find((element: (DFDElementType | DataFlow)) => element.id === elementID);
  }

  static findDFDElementByID(dfdElements: DFDElementType[], elementID: string): DFDElementType {
    return dfdElements.find((element: (DFDElementType | DataFlow)) => element.id === elementID);
  }

  static findTheFirstSelectedDFDElementInAnArray(dfdElements: (DFDElementType | DataFlow)[]) {
    return dfdElements.find((element: DFDElementType | DataFlow) => element.selected);
  }

  static atLeastOneTypeOfElementExists(dfdElements: DFDElementState): boolean {
    // Without the double negations typescript thinks this returns a number for some reason
    return !!(dfdElements && (dfdElements.dfdElements.length || dfdElements.trustBoundaries.length));
  }

  static twoArraysOfElementsContainTheSameElements(elementArrayOne: (DFDElementType)[],
                                                   elementArrayTwo: (DFDElementType)[]) {
    const AsubB = elementArrayOne.every(a => elementArrayTwo.some(b => a.id === b.id));
    const sameLength: boolean = elementArrayOne.length === elementArrayTwo.length;
    return AsubB && sameLength;
  }

  static findElementsInAnArrayWhichDontExistInAnotherArray(elementArrayOne: (DFDElementType)[],
                                                           elementArrayTwo: (DFDElementType)[]) {
    return elementArrayOne.filter(arr1Item => !elementArrayTwo.some(arr2Item => arr1Item.id === arr2Item.id));
  }

  static findElementsOfSameType<T extends DFDElementType>(dfdElements: any[], genericType: GenericElementType): T[] {
    return dfdElements.filter((dfdElement: DFDElementType) => dfdElement && dfdElement.genericType === genericType);
  }


  static convertDFDElementsToDTOs<T extends Interactor | Process | DataStore>(dfdElements: T[]): any[] {
    return dfdElements.map((element: T) => this.convertElementToDTO<T>(element));
  }

  static convertElementToDTO<E extends Interactor | Process | DataStore>(
    element: E
  ) {
    return {
      id: element.id,
      name: element.name,
      type: element.type,
      options: element.options,
      cpe: element.cpe ? element.cpe.cpe23Name : "",
      ip: element.ip ? element.ip : ""
    };
  }

  static findAllElementsConnectedToAnElement(dfdComponent: DFDComponent, allDFDComponents: DFDElementState): ElementRelationInfo {
    if (dfdComponent.genericType === GenericElementType.DATAFLOW) {
      return this.findStartAndEndElementOfDataFlowInFormOfElementRelationInfo(allDFDComponents.dfdElements, dfdComponent.connectedElements);
    } else {
      return this.getAllRelationInfoRelativeToOneDFDElement(allDFDComponents, dfdComponent);
    }
  }

  static findStartAndEndElementOfDataFlowInFormOfElementRelationInfo(dfdElements: DFDElementType[],
                                                                     dataFlowConnectionInfo: DataFlowConnectionInfo): ElementRelationInfo {
    return {
      elementsSendingData: [this.findDFDElementByID(dfdElements, dataFlowConnectionInfo.startElement.id)],
      elementsReceivingData: [this.findDFDElementByID(dfdElements, dataFlowConnectionInfo.endElement.id)]
    };
  }

  static elementIsConnectedToDataFlow(id: string, dataFlowConnection: DataFlowConnectionInfo): boolean {
    return dataFlowConnection.startElement.id === id || dataFlowConnection.endElement.id === id;
  }

  private static getAllRelationInfoRelativeToOneDFDElement(allDFDComponents: DFDElementState,
                                                           dfdComponent: DFDComponent): ElementRelationInfo {
    const elementsReceivingData: DFDElementType[] = [];
    const elementsSendingData: DFDElementType[] = [];
    // 1. Find DataFlows element is connected to
    const connectedDataFlows = this.findDataFlowsElementIsConnectedTo(allDFDComponents.dataFlows, dfdComponent.id);
    // 2. Find the other element also connected to the dataflow and store it in the right array
    connectedDataFlows.forEach((dataFlow: DataFlow) => {
      if (dataFlow.connectedElements.startElement.id === dfdComponent.id) {
        elementsReceivingData.push(this.findDFDElementByID(allDFDComponents.dfdElements, dataFlow.connectedElements.endElement.id));
      } else {
        elementsSendingData.push(this.findDFDElementByID(allDFDComponents.dfdElements, dataFlow.connectedElements.startElement.id));
      }
    });
    return {
      elementsReceivingData: elementsReceivingData,
      elementsSendingData: elementsSendingData
    };
  }

  static findDataFlowsElementIsConnectedTo(dataFlows: DataFlow[], id: string) {
    return dataFlows.filter((dataFlow: DataFlow) =>
      ElementUtil.elementIsConnectedToDataFlow(id, dataFlow.connectedElements));
  }
}
