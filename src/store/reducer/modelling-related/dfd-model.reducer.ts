import {
  DELETE_DFD,
  DELETE_DFD_COMPLETE,
  DfdModelActions, ERROR_DELETING_DFD, ERROR_LOADING_DFD, ERROR_SAVING_DFD,
  INIT_SAVE_DFD,
  LOAD_SAVED_DFD, LOAD_SAVED_DFD_COMPLETE,
  SAVE_DFD,
  SAVE_DFD_COMPLETE
} from "../../actions/modelling-related/dfd-model.action";


export interface DFDModelState {
  screenshotWorkingArea: string;
  currentModelID: string;
  loading: boolean;
  saving: boolean;
  error: Error;
}

const initialState: DFDModelState = {
  screenshotWorkingArea: "",
  currentModelID: "",
  loading: false,
  saving: false,
  error: null
};

export function dfdModelReducer(state = initialState, action: DfdModelActions): DFDModelState {
  switch (action.type) {
    case INIT_SAVE_DFD:
      return {
        ...state,
        screenshotWorkingArea: action.payload
      };
    case SAVE_DFD:
      return {
        ...state,
        saving: true
      };
    case SAVE_DFD_COMPLETE:
      return {
        ...state,
        saving: false,
        screenshotWorkingArea: "",
        error: null
      };
    case DELETE_DFD:
    case LOAD_SAVED_DFD:
      return {
        ...state,
        loading: true
      };
    case DELETE_DFD_COMPLETE:
    case LOAD_SAVED_DFD_COMPLETE:
      return {
        ...state,
        loading: false,
        error: null,
      };
    case ERROR_SAVING_DFD:
    case ERROR_LOADING_DFD:
    case ERROR_DELETING_DFD:
      return {
        ...state,
        loading: false,
        saving: false,
        error: action.error
      };
    default:
      return state;
  }
}
