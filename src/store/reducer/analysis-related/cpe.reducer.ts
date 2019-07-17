import {CPEITem} from "../../../models/analysis-related/cpe.model";
import {CPEActions, ERROR_SEARCHING_CPE, RESET_CPE, SEARCH_CPE, SEARCH_CPE_COMPLETE} from "../../actions/analysis-related/cpe.action";

export interface CPEState {
  availableCPE: CPEITem[];
  currentlyLoading: boolean;
}

const initialState: CPEState = {
  availableCPE: [],
  currentlyLoading: false
};

export function cpeReducer(state: CPEState = initialState, action: CPEActions): CPEState {
  switch (action.type) {
    case SEARCH_CPE:
      return {
        availableCPE: [],
        currentlyLoading: true
      };
    case SEARCH_CPE_COMPLETE:
      return {
        availableCPE: action.payload,
        currentlyLoading: false
      };
    case RESET_CPE:
    case ERROR_SEARCHING_CPE:
      return initialState;
    default:
      return state;
  }
}
