import {Component, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';
import {DeleteElementAlert} from "../../../../models/alert.model";

@Component({
  selector: 'app-delete-element-alert',
  templateUrl: './delete-element-alert.component.html',
  styleUrls: ['./delete-element-alert.component.scss']
})
export class DeleteElementAlertComponent implements OnInit {

  alert: DeleteElementAlert;

  @HostListener('window:keydown', ['$event'])
  onKeyPress(event: KeyboardEvent) {
    if (event.key === "Enter") {
      this.deleteElements();
    }
  }

  @Input()
  set deleteElementAlert(alert: DeleteElementAlert) {
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

  deleteElements() {
    this.delete.emit();
  }
}
