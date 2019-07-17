import {Component, OnDestroy, OnInit} from '@angular/core';
import {StoreService} from "../../../services/store.service";
import {Feedback, FeedbackType} from "../../../models/feedback.model";
import {Store} from "@ngrx/store";
import {State} from "../../../store";
import {ResetFeedbackAction, SubmitFeedbackAction} from "../../../store/actions/general-interaction-related/feedback.action";
import {untilDestroyed} from "ngx-take-until-destroy";
import {FeedbackState} from "../../../store/reducer/general-interaction-related/feedback.reducer";
import {RemoveModalAction} from "../../../store/actions/view-related/modal.action";
import {ModalConfig} from "../../../config/modal.config";

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent implements OnInit, OnDestroy {
  mail = "";
  feedbackContent = "";
  feedbackType: FeedbackType = FeedbackType.FEEDBACK;
  feedbackSent = false;
  errorSendingFeedback = false;
  contactWanted: boolean;
  currentlySubmitting: boolean;

  constructor(private storeService: StoreService,
              private store: Store<State>) {
  }

  ngOnInit() {
    this.getUserData();
    this.subscribeToFeedbackState();
    this.subscribeToEmail();
  }

  ngOnDestroy() {
    this.store.dispatch(new ResetFeedbackAction());
  }

  submitFeedback() {
    if (this.mail.length) {
      this.contactWanted = true;
    }
    this.store.dispatch(new SubmitFeedbackAction(this.createFeedback()));
  }

  closeModal() {
    this.store.dispatch(new RemoveModalAction(ModalConfig.FEEDBACK_MODAL));
  }

  private getUserData() {
    // TODO: Implement
  }

  private createFeedback(): Feedback {
    return {
      contactMail: this.mail,
      message: this.feedbackContent,
      type: this.feedbackType,
      date: new Date().toISOString()
    };
  }

  private subscribeToFeedbackState() {
    this.storeService.selectFeedbackState()
      .pipe(untilDestroyed(this))
      .subscribe((feedbackState: FeedbackState) => {
        this.feedbackSent = feedbackState.feedbackSent;
        this.currentlySubmitting = feedbackState.submitting;
        if (feedbackState.error) {
          this.errorSendingFeedback = true;
        }
      });
  }

  private subscribeToEmail() {
    this.storeService.selectEmail().pipe(untilDestroyed(this))
      .subscribe((mail: string) => this.mail = mail);
  }
}
