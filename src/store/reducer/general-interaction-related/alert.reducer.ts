import {AlertState} from "../../../models/alert.model";
import {AlertActions, CLOSE_ALERT, SHOW_ALERT} from "../../actions/general-interaction-related/alert.action";


export function alertReducer(state = null, action: AlertActions): AlertState {
  switch (action.type) {
    case SHOW_ALERT:
      return {
        alert: action.payload
      };
    case CLOSE_ALERT:
      return {
        alert: null
      };
    default:
      return state;
  }
}
