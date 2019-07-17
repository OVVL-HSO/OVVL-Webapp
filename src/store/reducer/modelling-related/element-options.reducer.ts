import {CLOSE_OPTIONS_VIEW, ElementOptionsActions, OPEN_OPTIONS_VIEW} from '../../actions/modelling-related/element-options.action';
import {DFDComponent} from "../../../models/types/types.model";
import {ElementRelationInfo} from "../../../models/modelling-related/base.model";

export interface OptionState {
  elementToBeChanged: DFDComponent;
  connectedElements: ElementRelationInfo;
}

const initialState: OptionState = {
  elementToBeChanged: null,
  connectedElements: {
    elementsSendingData: [],
    elementsReceivingData: []
  }
};

export function elementOptionsReducer(state = initialState, action: ElementOptionsActions): OptionState {
  switch (action.type) {
    case OPEN_OPTIONS_VIEW:
      return action.payload;
    case CLOSE_OPTIONS_VIEW:
      return initialState;
    default:
      return state;
  }
}
