import {Component, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';
import {DeleteProjectAlert} from "../../../../models/alert.model";

@Component({
  selector: 'app-leaving-workarea-alert',
  templateUrl: './leaving-workarea-alert.component.html',
  styleUrls: ['./leaving-workarea-alert.component.scss']
})
export class LeavingWorkareaAlertComponent implements OnInit {

  @Output()
  leave = new EventEmitter();

  @Output()
  cancel = new EventEmitter();

  alert: DeleteProjectAlert;

  @HostListener('window:keydown', ['$event'])
  onKeyPress(event: KeyboardEvent) {
    if (event.key === "Enter") {
      this.leaveProject();
    }
  }

  constructor() { }

  ngOnInit() {
  }

  close() {
    this.cancel.emit();
  }

  leaveProject() {
    this.leave.emit();
  }
}
