import {Component, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';
import {DeleteProjectAlert} from "../../../../models/alert.model";

@Component({
  selector: 'app-new-model-alert',
  templateUrl: './new-model-alert.component.html',
  styleUrls: ['./new-model-alert.component.scss']
})
export class NewModelAlertComponent implements OnInit {

  @Output()
  reset = new EventEmitter();

  @Output()
  cancel = new EventEmitter();

  alert: DeleteProjectAlert;

  @HostListener('window:keydown', ['$event'])
  onKeyPress(event: KeyboardEvent) {
    if (event.key === "Enter") {
      this.newModel();
    }
  }

  constructor() { }

  ngOnInit() {
  }

  close() {
    this.cancel.emit();
  }

  newModel() {
    this.reset.emit();
  }
}
