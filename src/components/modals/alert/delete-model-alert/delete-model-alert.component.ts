import {Component, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';
import {DeleteModelAlert} from "../../../../models/alert.model";

@Component({
  selector: 'app-delete-model-alert',
  templateUrl: './delete-model-alert.component.html',
  styleUrls: ['./delete-model-alert.component.scss']
})
export class DeleteModelAlertComponent implements OnInit {

  alert: DeleteModelAlert;

  @HostListener('window:keydown', ['$event'])
  onKeyPress(event: KeyboardEvent) {
    if (event.key === "Enter") {
      this.deleteModel();
    }
  }

  @Input()
  set modelDeleteAlert(alert: DeleteModelAlert) {
    this.alert = alert;
  }

  @Output()
  delete = new EventEmitter();

  @Output()
  cancel = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  deleteModel() {
    this.delete.emit(this.alert.modelID);
  }

  close() {
    this.cancel.emit();
  }
}
