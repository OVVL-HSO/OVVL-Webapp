import {Component, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';
import {DeleteProjectAlert} from "../../../../models/alert.model";

@Component({
  selector: 'app-delete-project-alert',
  templateUrl: './delete-project-alert.component.html',
  styleUrls: ['./delete-project-alert.component.scss']
})
export class DeleteProjectAlertComponent implements OnInit {
  alert: DeleteProjectAlert;

  @HostListener('window:keydown', ['$event'])
  onKeyPress(event: KeyboardEvent) {
    if (event.key === "Enter") {
      this.deleteProject();
    }
  }

  @Input()
  set projectDeleteAlert(alert: DeleteProjectAlert) {
    this.alert = alert;
  }

  @Output()
  delete = new EventEmitter();

  @Output()
  cancel = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  close() {
    this.cancel.emit();
  }

  deleteProject() {
    this.delete.emit(this.alert.projectID);
  }
}
