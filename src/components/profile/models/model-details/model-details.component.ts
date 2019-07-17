import {Component, OnDestroy, OnInit} from '@angular/core';
import {StoreService} from "../../../../services/store.service";
import {Store} from "@ngrx/store";
import {State} from "../../../../store";
import {untilDestroyed} from "ngx-take-until-destroy";
import {ModelStorageData} from "../../../../models/user-related/storage.model";
import {GeneralUtil} from "../../../../utils/general.util";
import {Project, ProjectModelLink} from "../../../../models/user-related/project.model";
import {ShowAlertAction} from "../../../../store/actions/general-interaction-related/alert.action";
import {AlertType} from "../../../../models/alert.model";
import {Observable} from "rxjs";
import {ProjectUtil} from "../../../../utils/project.util";
import {LinkModelToProjectAction} from "../../../../store/actions/user-related/projects/project-link.action";

@Component({
  selector: 'app-model-details',
  templateUrl: './model-details.component.html',
  styleUrls: ['./model-details.component.scss']
})
export class ModelDetailsComponent implements OnInit, OnDestroy {
  model: ModelStorageData;
  project: Project;
  username: string;
  existingProjects$: Observable<Project[]>;
  idOfProjectSupposedToBeLinkedToModel = "";

  constructor(private storeService: StoreService, private store: Store<State>) {
  }

  ngOnInit() {
    this.subscribeToSelectedModelAndLinkedProjectData();
    this.subscribeToExistingProjects();
    this.subscribeToUsername();
  }

  ngOnDestroy() {
  }

  convertDateStringToDate(date: string) {
    return GeneralUtil.convertUTCToDDMMYYYY(date);
  }

  deleteModel() {
    this.store.dispatch(new ShowAlertAction(
      {
        alertType: AlertType.DELETE_MODEL,
        modelTitle: this.model.name,
        modelID: this.model.modelID,
        projectTitle: this.model.projectID && this.project.title
      }));
  }

  userCanDeleteModel() {
    return this.model.owner === this.username;
  }

  private subscribeToSelectedModelAndLinkedProjectData() {
    this.storeService.selectCurrentlySelectedModelData()
      .pipe(untilDestroyed(this))
      .subscribe((model: ModelStorageData) => {
        if (model) {
          this.model = model;
          if (this.model.projectID) {
            this.subscribeToLinkedProjectData();
          }
        }
      });
  }

  private subscribeToLinkedProjectData() {
    this.storeService.selectProjectByID(this.model.projectID)
      .pipe(untilDestroyed(this))
      .subscribe((project: Project) => this.project = project);
  }

  private subscribeToUsername() {
    this.storeService.selectUsername()
      .pipe(untilDestroyed(this))
      .subscribe((username: string) => this.username = username);
  }

  private subscribeToExistingProjects() {
    this.existingProjects$ = this.storeService.selectProjects().pipe(untilDestroyed(this));
  }

  handleProjectLink() {
    let projectModelLink: ProjectModelLink;
    if (!this.model.projectID && this.idOfProjectSupposedToBeLinkedToModel) {
      projectModelLink = ProjectUtil.createProjectModelLink(this.idOfProjectSupposedToBeLinkedToModel, this.model.modelID);
      this.store.dispatch(new LinkModelToProjectAction(projectModelLink));
    } else {
      this.store.dispatch(new ShowAlertAction({
        alertType: AlertType.UNLINK_MODEL,
        modelTitle: this.model.name,
        modelID: this.model.modelID,
        projectTitle: this.project.title,
        projectID: this.project.projectID
      }));
      this.idOfProjectSupposedToBeLinkedToModel = "";
    }
  }

  getProjectOwnerName() {
    if (this.project.owner === this.username) {
      return "You";
    } else {
      return this.project.owner;
    }
  }

  getCollaboratorNames() {
    if (this.project.collaborators.length === 0) {
      return "0 Collaborators";
    }
    return "Collaborators: " + this.project.collaborators.join(", ");
  }

  downloadModel() {
    this.store.dispatch(new ShowAlertAction({
      alertType: AlertType.LOAD_MODEL,
      modelID: this.model.modelID,
      modelTitle: this.model.name
    }));
  }

  userIsAllowedToUnlinkModel() {
    return this.model.projectID && (this.model.owner === this.username || this.username === this.project.owner);
  }
}
