export interface Feedback {
  date: string;
  message: string;
  type: FeedbackType;
  contactMail: string;
}

export enum FeedbackType {
  BUG = 'Bug',
  FEAUTRE_REQUEST = 'Feature Request',
  FEEDBACK = 'Feedback',
  SUGGESTION = 'Suggestion',
  QUESTION = 'Question',
  OTHER = 'Other',
}
