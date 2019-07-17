import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {Project} from "../../../../models/user-related/project.model";
import {StoreService} from "../../../../services/store.service";
import {Store} from "@ngrx/store";
import {State} from "../../../../store";
import {untilDestroyed} from "ngx-take-until-destroy";
import {Observable} from "rxjs";
import {ModelStorageData} from "../../../../models/user-related/storage.model";
import {GeneralUtil} from "../../../../utils/general.util";
import {ShowAlertAction} from "../../../../store/actions/general-interaction-related/alert.action";
import {AlertType} from "../../../../models/alert.model";
import {UserExists} from "../../../../models/user-related/user.model";
import {UserService} from "../../../../services/user-related/user.service";
import {ProjectUtil} from "../../../../utils/project.util";
import {InviteUserAction} from "../../../../store/actions/user-related/projects/project-invitation.action";

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProjectDetailsComponent implements OnInit, OnDestroy {

  project: Project;
  linkedModels$: Observable<ModelStorageData[]>;
  displayedOwnerName = "";
  username: string;
  inviteEnabled: boolean;
  userToBeInvited = "";
  errorMessage: string;
  isInviting: boolean;

  constructor(private storeService: StoreService,
              private store: Store<State>,
              private userService: UserService) {
  }

  ngOnInit() {
    this.subscribeToSelectedProject();
  }

  ngOnDestroy() {
  }

  getCreationDate(date: string) {
    return GeneralUtil.convertUTCToDDMMYYYY(date);
  }

  deleteProject() {
    this.store.dispatch(new ShowAlertAction({
      alertType: AlertType.DELETE_PROJECT,
      projectID: this.project.projectID,
      projectTitle: this.project.title,
      modelCount: this.project.models.length
    }));
  }

  private subscribeToSelectedProject() {
    this.storeService.selectCurrentlySelectedProfileData()
      .pipe(untilDestroyed(this))
      .subscribe((project: Project) => {
        this.handleProjectDependantDataAndSubscriptions(project);
      });
  }

  private handleProjectDependantDataAndSubscriptions(project: Project) {
    if (project) {
      this.project = project;
      this.setDisplayedOwnerName();
      if (project.models) {
        this.subscribeToModelsLinkedToProject();
      }
    }
  }

  private subscribeToModelsLinkedToProject() {
    this.linkedModels$ = this.storeService.selectModelsLinkedToProject(this.project.projectID)
      .pipe(untilDestroyed(this));
  }

  private setDisplayedOwnerName() {
    this.storeService.selectUsername()
      .pipe(untilDestroyed(this))
      .subscribe((username: string) => {
        this.username = username;
        if (this.project.owner === username) {
          this.displayedOwnerName = "Your";
        } else {
          this.displayedOwnerName = this.project.owner + "'s";
        }
      });
  }

  loadModelFromServer(modelStorageData: ModelStorageData) {
    this.store.dispatch(new ShowAlertAction({
      alertType: AlertType.LOAD_MODEL,
      modelTitle: modelStorageData.name,
      modelID: modelStorageData.modelID
    }));
  }

  unlinkModelFromProject(modelStorageData: ModelStorageData) {
    this.store.dispatch(new ShowAlertAction({
      alertType: AlertType.UNLINK_MODEL,
      modelTitle: modelStorageData.name,
      modelID: modelStorageData.modelID,
      projectTitle: this.project.title,
      projectID: this.project.projectID
    }));
  }

  toggleUserInvites() {
    this.inviteEnabled = !this.inviteEnabled;
  }

  inviteUser() {
    this.errorMessage = "";
    if (this.project.owner === this.userToBeInvited) {
      this.errorMessage = "You can't invite yourself.";
    } else {
      this.isInviting = true;
      this.userService.userExists(this.userToBeInvited)
        .subscribe((userExists: UserExists) => {
          this.handleInvite(userExists.exists);
        });
    }
  }

  private handleInvite(userExists: boolean) {
    if (userExists) {
      if (ProjectUtil.userIsAlreadyInvited(this.project.invites, this.userToBeInvited)) {
        this.errorMessage = this.userToBeInvited + " is already invited.";
      } else if (ProjectUtil.userIsAlreadyPartOfProject(this.project.invites, this.userToBeInvited)) {
        this.errorMessage = this.userToBeInvited + " is already part of the project.";
      } else {
        this.store.dispatch(new InviteUserAction({projectID: this.project.projectID, username: this.userToBeInvited}));
        this.userToBeInvited = "";
      }
    } else {
      this.errorMessage = this.userToBeInvited + " is not a registered user.";
    }
  }

  leaveProject() {
    this.store.dispatch(new ShowAlertAction({
      alertType: AlertType.LEAVE_PROJECT,
      projectID: this.project.projectID,
      projectTitle: this.project.title,
      owner: this.project.owner
    }));
  }
}
