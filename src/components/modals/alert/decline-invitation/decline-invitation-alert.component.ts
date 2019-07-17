import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DeclineInvitationAlert} from "../../../../models/alert.model";

@Component({
  selector: 'app-decline-invitation-alert',
  templateUrl: './decline-invitation-alert.component.html',
  styleUrls: ['./decline-invitation-alert.component.scss']
})
export class DeclineInvitationAlertComponent implements OnInit {
  alert: DeclineInvitationAlert;

  @Output()
  decline = new EventEmitter();

  @Output()
  cancel = new EventEmitter();

  @Input()
  set declineInvitationAlert(alert: DeclineInvitationAlert) {
    this.alert = alert;
  }

  constructor() { }

  ngOnInit() {
  }

  declineInvitation() {
    this.decline.emit(this.alert.invitationID);
  }

  close() {
    this.cancel.emit();
  }

}
