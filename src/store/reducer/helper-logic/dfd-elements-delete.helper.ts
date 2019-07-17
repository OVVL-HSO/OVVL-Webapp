import {ReducerUtil} from "../../../utils/reducer.util";
import {DFDElementState} from "../modelling-related/dfd-element.reducer";
import {DataFlow, DataFlowDrawingPosition} from "../../../models/modelling-related/dataflow.model";
import {CopyUtils} from "../../../utils/copy.util";
import {DataFlowUtil} from "../../../utils/data-flow.util";
import {DataFlowConnectionInfo} from "../../../models/modelling-related/base.model";

export class DELETEElementReducerHelper {

  static DELETE_ELEMENT(currentState: DFDElementState, elementToBeDeleted: string): DFDElementState {
    return {...currentState, dfdElements: ReducerUtil.deleteElementFromList(currentState.dfdElements, elementToBeDeleted)};
  }

  static DELETE_DATAFLOW(currentState: DFDElementState, idOfDataFlowToBeDeleted: string): DFDElementState {
    // If the deletion removes a duplex connection, we need to reset the other dataflow back to a normal drawing position
    const dataFlowToBeDeleted: DataFlow = DataFlowUtil
      .findDataFlowBuildingDuplexCommunication(currentState.dataFlows, idOfDataFlowToBeDeleted);
    if (dataFlowToBeDeleted) {
      currentState.dataFlows = this.resetOtherDataFlowInDuplexCommunication(currentState, dataFlowToBeDeleted.connectedElements);
    }
    return {...currentState, dataFlows: ReducerUtil.deleteElementFromList(currentState.dataFlows, idOfDataFlowToBeDeleted)};
  }

  static DELETE_BOUNDARY(currentState: DFDElementState, boundaryToBeDeleted: string): DFDElementState {
    return {...currentState, trustBoundaries: ReducerUtil.deleteElementFromList(currentState.trustBoundaries, boundaryToBeDeleted)};
  }

  static RESET_MODEL(): DFDElementState {
    return {dfdElements: [], dataFlows: [], trustBoundaries: [], modelID: ""};
  }

  private static resetOtherDataFlowInDuplexCommunication(currentState: DFDElementState,
                                                         connectedElements: DataFlowConnectionInfo): DataFlow[] {
    let otherDataFlowConnectingTheSameElements: DataFlow = ReducerUtil
      .findDataFlowConnectingSameElementsAsAnotherDataFlow(currentState.dataFlows, connectedElements);
    otherDataFlowConnectingTheSameElements = CopyUtils.copyDataFlow(otherDataFlowConnectingTheSameElements);
    otherDataFlowConnectingTheSameElements.position = DataFlowDrawingPosition.NORMAL;
    return ReducerUtil.combineExistingElementsWithUpdatedElement(currentState.dataFlows, otherDataFlowConnectingTheSameElements);
  }
}
