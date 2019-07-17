import {ADD_MODAL, ModalActions, REMOVE_MODAL} from "../../actions/view-related/modal.action";
import {Modal} from "../../../models/view-related/modal.model";


export function modalReducer(state = [], action: ModalActions): Modal[] {
  switch (action.type) {
    case ADD_MODAL:
      return [...state, action.payload];
    case REMOVE_MODAL:
      return state.filter((modal: Modal) => modal.modalID !== action.payload.modalID);
    default:
      return state;
  }
}
