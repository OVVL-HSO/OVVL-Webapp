import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DeclineInvitationAlert, LeaveProjectAlert} from "../../../../models/alert.model";

@Component({
  selector: 'app-leave-project-alert',
  templateUrl: './leave-project-alert.component.html',
  styleUrls: ['./leave-project-alert.component.scss']
})
export class LeaveProjectAlertComponent implements OnInit {

  alert: LeaveProjectAlert;

  @Output()
  leave = new EventEmitter();

  @Output()
  cancel = new EventEmitter();

  @Input()
  set leaveProjectAlert(alert: LeaveProjectAlert) {
    this.alert = alert;
  }

  constructor() { }

  ngOnInit() {
  }

  leaveProject() {
    this.leave.emit(this.alert.projectID);
  }

  close() {
    this.cancel.emit();
  }
}
