import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {catchError, map, switchMap} from 'rxjs/operators';
import {of} from 'rxjs';
import {ErrorSubmittingFeedbackAction, SUBMIT_FEEDBACK, SubmitFeedbackCompleteAction} from "../../actions/general-interaction-related/feedback.action";
import {FeedbackService} from "../../../services/feedback.service";
import {Feedback} from "../../../models/feedback.model";

@Injectable()
export class FeedbackEffects {
  @Effect() submitFeedbackAction$ = this.action$.pipe(
    ofType(SUBMIT_FEEDBACK),
    map((action: any) => action.payload),
    switchMap((feedback: Feedback) => this.feedbackService.submitFeedback(feedback)),
    map(() => new SubmitFeedbackCompleteAction()),
    catchError((error: Error) => {
      console.error(error);
      return of(new ErrorSubmittingFeedbackAction());
    })
  );

  constructor(private action$: Actions,
              private feedbackService: FeedbackService) {
  }
}
