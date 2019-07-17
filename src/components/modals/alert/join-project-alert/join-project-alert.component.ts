import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {JoinProjectAlert} from "../../../../models/alert.model";

@Component({
  selector: 'app-join-project-alert',
  templateUrl: './join-project-alert.component.html',
  styleUrls: ['./join-project-alert.component.scss']
})
export class JoinProjectAlertComponent implements OnInit {
  alert: JoinProjectAlert;

  @Output()
  join = new EventEmitter();

  @Output()
  cancel = new EventEmitter();

  @Input()
  set joinProjectAlert(alert: JoinProjectAlert) {
    this.alert = alert;
  }

  constructor() { }

  ngOnInit() {
  }

  joinProject() {
    this.join.emit(this.alert.invitationID);
  }

  close() {
    this.cancel.emit();
  }

}
