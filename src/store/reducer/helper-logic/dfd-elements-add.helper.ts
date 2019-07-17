import {ReducerUtil} from "../../../utils/reducer.util";
import {DataFlow, DataFlowDrawingPosition} from "../../../models/modelling-related/dataflow.model";
import {ElementUtil} from "../../../utils/element.util";
import {DFDElementState} from "../modelling-related/dfd-element.reducer";
import {BaseDFDElement, DataFlowConnectionInfo, GenericElementType} from "../../../models/modelling-related/base.model";
import {DFDElementType} from "../../../models/types/types.model";
import {BoundaryMetaData, TrustBoundary} from "../../../models/modelling-related/trust-boundary.model";

export class ADDElementReducerHelper {

  static ADD_ELEMENT(currentState: DFDElementState, newElementData: BaseDFDElement): DFDElementState {
    let newElement: DFDElementType;
    if (newElementData.type === GenericElementType.INTERACTOR) {
      newElement = ElementUtil.createDefaultInteractor(newElementData.coordinates);
    } else if (newElementData.type === GenericElementType.PROCESS) {
      newElement = ElementUtil.createDefaultProcess(newElementData.coordinates);
    } else {
      newElement = ElementUtil.createDefaultDataStore(newElementData.coordinates);
    }
    return {...currentState, dfdElements: [...currentState.dfdElements, newElement]};
  }

  static ADD_DATAFLOW(currentState: DFDElementState, newDataFlowData: DataFlowConnectionInfo): DFDElementState {
    // If the dataFlow already exist in the same form, just return the state
    if (ReducerUtil.dataFlowAlreadyExists(currentState.dataFlows, newDataFlowData)) {
      return {...currentState};
    }
    const newDataFlow: DataFlow = ElementUtil.createDefaultDataFlow(newDataFlowData);
    // If the elements connected by the new dataFlow are already connected in the other direction...
    // ... we want to updated their drawing position, so they can be drawn accordingly
    if (ReducerUtil.connectedElementsAreAlreadyConnected(currentState.dataFlows, newDataFlowData)) {
      const dataFlowsWithUpdatedDrawingPosition = ReducerUtil.updateDataFlowsDrawingPosition(currentState.dataFlows, newDataFlowData);
      newDataFlow.position = DataFlowDrawingPosition.TOP;
      dataFlowsWithUpdatedDrawingPosition.push(newDataFlow);
      return {
        ...currentState,
        dataFlows: [...dataFlowsWithUpdatedDrawingPosition]
      };
    }
    return {
      ...currentState,
      dataFlows: [...currentState.dataFlows, newDataFlow]
    };
  }

  static ADD_BOUNDARY(currentState: DFDElementState, newBoundaryData: BoundaryMetaData): DFDElementState {
    const newBoundary: TrustBoundary = ElementUtil.createDefaultTrustBoundary(newBoundaryData);
    return {...currentState, trustBoundaries: [...currentState.trustBoundaries, newBoundary]};
  }
}
