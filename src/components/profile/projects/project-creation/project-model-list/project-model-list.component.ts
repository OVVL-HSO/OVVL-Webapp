import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {ProjectUtil} from "../../../../../utils/project.util";
import {ProjectDTO} from "../../../../../models/user-related/project.model";
import {GeneralUtil} from "../../../../../utils/general.util";
import {ModelStorageData} from "../../../../../models/user-related/storage.model";
import {DomSanitizer, SafeStyle} from "@angular/platform-browser";

@Component({
  selector: 'app-project-model-list',
  templateUrl: './project-model-list.component.html',
  styleUrls: ['./project-model-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProjectModelListComponent implements OnInit {
  displayedModels: ModelStorageData[];
  listHeightStyle: SafeStyle;
  view: "selection" | "summary";
  @Output()
  updatedProject = new EventEmitter();
  private project: ProjectDTO;

  constructor(private sanitizer: DomSanitizer) {
  }

  @Input()
  set currentProject(project: ProjectDTO) {
    this.project = project;
  }

  @Input()
  set currentView(view: 'selection' | 'summary') {
    this.view = view;
  }

  @Input()
  set scrollbarHeight(height: number) {
    this.listHeightStyle = this.sanitizer.bypassSecurityTrustStyle("max-height: " + height.toString() + ";");
  }

  @Input()
  set models(displayedModels: ModelStorageData[]) {
    this.displayedModels = displayedModels;
  }

  ngOnInit() {
  }

  handleModelProjectLink(modelID: string) {
    if (ProjectUtil.modelIsAlreadyPartOfProject(this.project.models, modelID)) {
      this.project.models = ProjectUtil.removeModelFromProjectList(this.project.models, modelID);
    } else {
      this.project.models.push(modelID);
    }
    this.updatedProject.emit(this.project);
  }

  modelIsSelected(modelID: string) {
    return this.project.models.find((existingModelIDs: string) => existingModelIDs === modelID);
  }

  getCreationDate(date: string) {
    return GeneralUtil.convertUTCToDDMMYYYY(date);
  }
}
