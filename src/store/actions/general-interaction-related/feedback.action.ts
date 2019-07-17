import {Action} from '@ngrx/store';
import {Feedback} from "../../../models/feedback.model";

export const SUBMIT_FEEDBACK = '[Feedback] Submit Feedback';
export const SUBMIT_FEEDBACK_COMPLETE = '[Feedback] Submit Feedback Complete';
export const RESET_FEEDBACK = '[Feedback] Reset Feedback';
export const FEEDBACK_ERROR = '[Feedback] Error';

export class SubmitFeedbackAction implements Action {
  readonly type = SUBMIT_FEEDBACK;

  constructor(public payload: Feedback) {
  }
}

export class SubmitFeedbackCompleteAction implements Action {
  readonly type = SUBMIT_FEEDBACK_COMPLETE;
}

export class ResetFeedbackAction implements Action {
  readonly type = RESET_FEEDBACK;
}

export class ErrorSubmittingFeedbackAction implements Action {
  readonly type = FEEDBACK_ERROR;
}

export type FeedbackActions =
  SubmitFeedbackAction
  | SubmitFeedbackCompleteAction
  | ErrorSubmittingFeedbackAction
  | ResetFeedbackAction;
