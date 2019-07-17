import {ElementUtil} from "../../../utils/element.util";
import {ReducerUtil} from "../../../utils/reducer.util";
import {CopyUtils} from "../../../utils/copy.util";
import {DFDElementType} from "../../../models/types/types.model";
import {DataFlow} from "../../../models/modelling-related/dataflow.model";
import {TrustBoundary} from "../../../models/modelling-related/trust-boundary.model";
import {ADDElementReducerHelper} from "../helper-logic/dfd-elements-add.helper";
import {UPDATEElementReducerHelper} from "../helper-logic/dfd-elements-update.helper";
import {DELETEElementReducerHelper} from "../helper-logic/dfd-elements-delete.helper";
import {
  CONNECT_ELEMENT,
  ElementActions,
  HIGHLIGHT_ELEMENT,
  SET_MODEL_ID,
  UNSELECT_ALL_ELEMENTS
} from "../../actions/modelling-related/dfd-element.action";
import {ADD_BOUNDARY, ADD_DATAFLOW, ADD_ELEMENT} from "../../actions/modelling-related/element-add.action";
import {
  CHANGE_DATAFLOW_POSITION,
  UPDATE_BOUNDARY,
  UPDATE_DATAFLOW,
  UPDATE_DRAG_ELEMENT,
  UPDATE_ELEMENT
} from "../../actions/modelling-related/element-update.action";
import {DELETE_BOUNDARY, DELETE_DATAFLOW, DELETE_ELEMENT, RESET_DFD_MODEL} from "../../actions/modelling-related/element-delete.action";

export interface DFDElementState {
  dfdElements: (DFDElementType)[];
  dataFlows: DataFlow[];
  trustBoundaries: TrustBoundary[];
  modelID: string;
}

const initialState: DFDElementState = {
  dfdElements: [],
  dataFlows: [],
  trustBoundaries: [],
  modelID: ""
};


export function dfdElementReducer(state: DFDElementState = initialState, action: ElementActions): DFDElementState {
  let updatedElements: DFDElementType[] = [];
  switch (action.type) {
    case ADD_ELEMENT:
      return ADDElementReducerHelper.ADD_ELEMENT(state, action.payload);
    case ADD_DATAFLOW:
      return ADDElementReducerHelper.ADD_DATAFLOW(state, action.payload);
    case ADD_BOUNDARY:
      return ADDElementReducerHelper.ADD_BOUNDARY(state, action.payload);

    case HIGHLIGHT_ELEMENT:
    case UPDATE_DRAG_ELEMENT:
    case UPDATE_ELEMENT:
      return UPDATEElementReducerHelper.UPDATE_ELEMENT(state, action.payload);
    case UPDATE_DATAFLOW:
      return UPDATEElementReducerHelper.UPDATE_DATAFLOW(state, action.payload);
    case UPDATE_BOUNDARY:
      return UPDATEElementReducerHelper.UPDATE_BOUNDARY(state, action.payload);


    case DELETE_ELEMENT:
      return DELETEElementReducerHelper.DELETE_ELEMENT(state, action.payload);
    case DELETE_DATAFLOW:
      return DELETEElementReducerHelper.DELETE_DATAFLOW(state, action.payload);
    case DELETE_BOUNDARY:
      return DELETEElementReducerHelper.DELETE_BOUNDARY(state, action.payload);
    case RESET_DFD_MODEL:
      return DELETEElementReducerHelper.RESET_MODEL();

    case CHANGE_DATAFLOW_POSITION:
      const updatedDataFlows: DataFlow[]
        = ReducerUtil.updateDataFlowCoordinates(state.dataFlows, action.payload);
      return {
        ...state,
        dataFlows: updatedDataFlows,
      };
    case CONNECT_ELEMENT:
      updatedElements = state.dfdElements;
      action.payload.forEach((elementID: string) => {
        const elementToBeUpdated: DFDElementType = ElementUtil.findDFDElementByID(state.dfdElements, elementID);
        const copiedElement: DFDElementType = CopyUtils.copyDFDElement(elementToBeUpdated);
        copiedElement.connectedToDataFlow = true;
        updatedElements = ReducerUtil.combineExistingElementsWithUpdatedElement(updatedElements, copiedElement);
      });
      return {...state, dfdElements: updatedElements};
    case UNSELECT_ALL_ELEMENTS:
      updatedElements = [];
      state.dfdElements.forEach((element: DFDElementType) => {
        if (!element.selected) {
          updatedElements.push(element);
        } else {
          const unselectedElement: DFDElementType = CopyUtils.copyDFDElement(element);
          unselectedElement.selected = false;
          updatedElements.push(unselectedElement);
        }
      });
      return {...state, dfdElements: updatedElements};
    case SET_MODEL_ID:
      return {
        ...state,
        modelID: action.payload
      };
    default:
      return state;
  }
}
