import {DataFlow, DataFlowDrawingPosition} from '../models/modelling-related/dataflow.model';
import {DataFlowConnectionInfo, GenericConnectedElement, GenericElementData} from '../models/modelling-related/base.model';
import {CopyUtils} from './copy.util';
import {TrustBoundary} from "../models/modelling-related/trust-boundary.model";
import {DFDElementType} from "../models/types/types.model";
import {ElementUtil} from "./element.util";

export class ReducerUtil {
  static updateDataFlowCoordinates(dataFlows: DataFlow[], movedElement: GenericConnectedElement): DataFlow[] {
    const updatedDataFlows: DataFlow[] = [];
    const dataFlowsThatGetChanged: DataFlow[] = [];
    const dataFlowsThatRemainUnchanged: DataFlow[] = [];

    // The dataflows need to be split, otherwise unaffected dataflows switch drawing positions on every dataflow update (top->bottom, etc.)
    dataFlows.forEach((dataFlow: DataFlow) => {
      const copiedDataFlow: DataFlow = CopyUtils.copyDataFlow(dataFlow);
      if (ElementUtil.elementIsConnectedToDataFlow(movedElement.id, dataFlow.connectedElements)) {
        dataFlowsThatGetChanged.push(copiedDataFlow);
      } else {
        dataFlowsThatRemainUnchanged.push(copiedDataFlow);
      }
    });

    dataFlowsThatGetChanged.forEach((dataFlow: DataFlow) => {
      if (dataFlow.connectedElements.startElement.id === movedElement.id) {
        dataFlow.connectedElements.startElement = movedElement;
      } else {
        dataFlow.connectedElements.endElement = movedElement;
      }
      updatedDataFlows.push(dataFlow);
    });

    return dataFlowsThatRemainUnchanged.concat(updatedDataFlows);
  }

  static dataFlowAlreadyExists(dataFlows: DataFlow[], newDataFlowConnection: DataFlowConnectionInfo): boolean {
    return dataFlows.some((dataFlow: DataFlow) => this.dataFlowCoordinatesAreTheSame(dataFlow, newDataFlowConnection));
  }

  static connectedElementsAreAlreadyConnected(dataFlows: DataFlow[], newDataFlowConnection: DataFlowConnectionInfo): boolean {
    return dataFlows.some((dataFlow: DataFlow) => this.elementsAreAlreadyConnected(dataFlow.connectedElements, newDataFlowConnection));
  }

  static updateDataFlowsDrawingPosition(dataFlows: DataFlow[], newDataFlowConnection: DataFlowConnectionInfo): DataFlow[] {
    const updatedDataFlows: DataFlow[] = [];
    for (let i = 0; i < dataFlows.length; i++) {
      if (this.elementsAreAlreadyConnected(dataFlows[i].connectedElements, newDataFlowConnection)) {
        const updatedDataFlow: DataFlow = CopyUtils.copyDataFlow(dataFlows[i]);
        updatedDataFlow.position = DataFlowDrawingPosition.BOTTOM;
        updatedDataFlows.push(updatedDataFlow);
      } else {
        updatedDataFlows.push(CopyUtils.copyDataFlow(dataFlows[i]));
      }
    }
    return updatedDataFlows;
  }

  static combineExistingElementsWithUpdatedElement<T extends DFDElementType | DataFlow | TrustBoundary>
  (elements: T[], newElement: T): T[] {
    const combinedElements: T[] = this.addElementsToListThatDontMatchAnID(elements, newElement.id);
    combinedElements.push(newElement);
    return combinedElements;
  }

  static deleteElementFromList<T extends DFDElementType | DataFlow | TrustBoundary>
  (elements: T[], id: string): T[] {
    return this.addElementsToListThatDontMatchAnID(elements, id);
  }

  static addElementsToListThatDontMatchAnID<T extends DFDElementType | DataFlow | TrustBoundary | GenericElementData>
  (elements: T[], id: string): T[] {
    return elements.filter((element: T) => element.id !== id);
  }

  static removeIDFromIDList(existingIDs: string[], id: string): string[] {
    return existingIDs.filter((existingID: string) => existingID !== id);
  }

  static findDataFlowConnectingSameElementsAsAnotherDataFlow(dataFlows: DataFlow[], connectedElements: DataFlowConnectionInfo): DataFlow {
    return dataFlows.find((dataFlow: DataFlow) => this.elementsAreAlreadyConnected(dataFlow.connectedElements, connectedElements));
  }

  private static dataFlowCoordinatesAreTheSame(dataFlow: DataFlow, newDataFlowConnection: DataFlowConnectionInfo): boolean {
    return dataFlow.connectedElements.startElement.id === newDataFlowConnection.startElement.id
      && dataFlow.connectedElements.endElement.id === newDataFlowConnection.endElement.id;
  }

  private static elementsAreAlreadyConnected(existingDataFlowConnection: DataFlowConnectionInfo,
                                             newDataFlowConnection: DataFlowConnectionInfo): boolean {
    return existingDataFlowConnection.startElement.id === newDataFlowConnection.endElement.id
      && existingDataFlowConnection.endElement.id === newDataFlowConnection.startElement.id;
  }
}
