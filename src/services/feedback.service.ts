import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AppConfig} from '../config/app.config';
import {Observable} from "rxjs";
import {Feedback} from "../models/feedback.model";

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable()
export class FeedbackService {

  constructor(private http: HttpClient) {
  }

  submitFeedback(feedback: Feedback): Observable<any> {
    return this.http.post(AppConfig.FEEDBACK_URL, feedback, httpOptions);
  }
}
