import {FEEDBACK_ERROR, FeedbackActions, RESET_FEEDBACK, SUBMIT_FEEDBACK, SUBMIT_FEEDBACK_COMPLETE} from "../../actions/general-interaction-related/feedback.action";

export interface FeedbackState {
  feedbackSent: boolean;
  error?: Error;
  submitting: boolean;
}

const initialState: FeedbackState = {
  feedbackSent: false,
  submitting: false
};

export function feedbackReducer(state: FeedbackState = initialState, action: FeedbackActions): FeedbackState {
  switch (action.type) {
    case SUBMIT_FEEDBACK:
      return {...state, submitting: true};
    case SUBMIT_FEEDBACK_COMPLETE:
      return {...state, feedbackSent: true, submitting: false};
    case FEEDBACK_ERROR:
    case RESET_FEEDBACK:
      return initialState;
    default:
      return state;
  }
}
