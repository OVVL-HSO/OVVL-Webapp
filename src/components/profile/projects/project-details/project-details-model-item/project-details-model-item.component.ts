import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ModelStorageData} from "../../../../../models/user-related/storage.model";
import {GeneralUtil} from "../../../../../utils/general.util";

@Component({
  selector: 'app-project-details-model-item',
  templateUrl: './project-details-model-item.component.html',
  styleUrls: ['./project-details-model-item.component.scss']
})
export class ProjectDetailsModelItemComponent implements OnInit {
  model: ModelStorageData;
  nameOfCurrentUser: string;
  ownerOfProject: string;

  @Input()
  set linkedModel(models: ModelStorageData) {
    this.model = models;
  }

  @Output()
  loadModel = new EventEmitter();

  @Output()
  unlinkModel = new EventEmitter();

  @Input()
  set username(username: string) {
    this.nameOfCurrentUser = username;
  }

  @Input()
  set projectOwner(projectOwner: string) {
    this.ownerOfProject = projectOwner;
  }

  getCreationDate(date: string) {
    return GeneralUtil.convertUTCToDDMMYYYY(date);
  }

  constructor() { }

  ngOnInit() {
  }

  loadModelFromServer() {
    this.loadModel.emit(this.model);
  }

  unlinkModelFromProject() {
    this.unlinkModel.emit(this.model);
  }
}
