import {Component, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';
import {UnlinkModelAlert} from "../../../../models/alert.model";
import {ProjectUtil} from "../../../../utils/project.util";

@Component({
  selector: 'app-unlink-model-alert',
  templateUrl: './unlink-model-alert.component.html',
  styleUrls: ['./unlink-model-alert.component.scss']
})
export class UnlinkModelAlertComponent implements OnInit {
  alert: UnlinkModelAlert;

  @HostListener('window:keydown', ['$event'])
  onKeyPress(event: KeyboardEvent) {
    if (event.key === "Enter") {
      this.unlinkModel();
    }
  }

  @Input()
  set unlinkModelAlert(alert: UnlinkModelAlert) {
    this.alert = alert;
  }

  @Output()
  unlink = new EventEmitter();

  @Output()
  cancel = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  unlinkModel() {
    this.unlink.emit(ProjectUtil.createProjectModelLink(this.alert.projectID, this.alert.modelID));
  }

  close() {
    this.cancel.emit();
  }
}
