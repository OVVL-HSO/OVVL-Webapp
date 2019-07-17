import {ReducerUtil} from "../../../utils/reducer.util";
import {DataFlow} from "../../../models/modelling-related/dataflow.model";
import {DFDElementState} from "../modelling-related/dfd-element.reducer";
import {DFDElementType} from "../../../models/types/types.model";
import {TrustBoundary} from "../../../models/modelling-related/trust-boundary.model";

export class UPDATEElementReducerHelper {

  static UPDATE_ELEMENT(currentState: DFDElementState, updatedElement: DFDElementType): DFDElementState {
    return {...currentState, dfdElements: ReducerUtil.combineExistingElementsWithUpdatedElement(currentState.dfdElements, updatedElement)};
  }

  static UPDATE_DATAFLOW(currentState: DFDElementState, updatedDataFlow: DataFlow): DFDElementState {
    return {
      ...currentState,
      dataFlows: ReducerUtil.combineExistingElementsWithUpdatedElement(currentState.dataFlows, updatedDataFlow)
    };
  }

  static UPDATE_BOUNDARY(currentState: DFDElementState, updatedBoundary: TrustBoundary): DFDElementState {
    return {
      ...currentState,
      trustBoundaries: ReducerUtil.combineExistingElementsWithUpdatedElement(currentState.trustBoundaries, updatedBoundary)
    };
  }
}
