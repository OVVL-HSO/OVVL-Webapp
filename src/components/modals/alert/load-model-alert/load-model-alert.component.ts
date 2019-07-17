import {Component, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';
import {LoadModelAlert} from "../../../../models/alert.model";

@Component({
  selector: 'app-load-model-alert',
  templateUrl: './load-model-alert.component.html',
  styleUrls: ['./load-model-alert.component.scss']
})
export class LoadModelAlertComponent implements OnInit {

  alert: LoadModelAlert;

  @HostListener('window:keydown', ['$event'])
  onKeyPress(event: KeyboardEvent) {
    if (event.key === "Enter") {
      this.loadModel();
    }
  }

  @Input()
  set model(alert: LoadModelAlert) {
    this.alert = alert;
  }

  @Output()
  load = new EventEmitter();

  @Output()
  cancel = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  close() {
    this.cancel.emit();
  }

  loadModel() {
    this.load.emit(this.alert.modelID);
  }

}
