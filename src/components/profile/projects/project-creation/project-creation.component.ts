import {Component, OnDestroy, OnInit} from '@angular/core';
import {ProjectCreationStep, ProjectDTO} from "../../../../models/user-related/project.model";
import {ProjectUtil} from "../../../../utils/project.util";
import {Store} from "@ngrx/store";
import {State} from "../../../../store";
import {StoreService} from "../../../../services/store.service";
import {untilDestroyed} from "ngx-take-until-destroy";
import {ModelStorageData} from "../../../../models/user-related/storage.model";
import {animate, style, transition, trigger} from "@angular/animations";
import {UserExists} from "../../../../models/user-related/user.model";
import {UserService} from "../../../../services/user-related/user.service";
import {Profile} from "../../../../models/user-related/profile.model";
import {CancelProjectCreationAction, CreateProjectAction} from "../../../../store/actions/user-related/projects/project-creation.action";

@Component({
  selector: 'app-project-creation',
  templateUrl: './project-creation.component.html',
  styleUrls: ['./project-creation.component.scss'],
  animations: [
    trigger(
      'creation-transition',
      [
        transition(
          ':enter', [
            style({transform: 'translateX(30%)', opacity: 0}),
            animate('200ms', style({transform: 'translateX(0)', 'opacity': 1}))
          ]
        )]
    )
  ]
})
export class ProjectCreationComponent implements OnInit, OnDestroy {

  currentStep: ProjectCreationStep = ProjectCreationStep.GENERAL;
  project: ProjectDTO;
  existingModels: ModelStorageData[];
  currentInvite: string;
  isLoading: boolean;
  errorMessage = "";
  private owner: string;

  constructor(private store: Store<State>,
              private userService: UserService,
              private storeService: StoreService) {
  }

  ngOnInit() {
    this.setProject();
    this.subscribeToModels();
    this.subscribeToUsername();
  }

  ngOnDestroy() {
  }

  updatedProject(projectUpdate: ProjectDTO) {
    this.project = projectUpdate;
  }


  manageProjectCreationStep(forward: boolean) {
    let nextStep: ProjectCreationStep = ProjectUtil.getNextCreationProcessStep(forward, this.currentStep);
    nextStep = ProjectUtil.skipLinkingStepIfNoModelsCanBeLinked(forward, nextStep, this.existingModels.length);
    this.currentStep = nextStep;
  }

  cantContinueProcess() {
    return this.currentStep === ProjectCreationStep.GENERAL ? !ProjectUtil.firstCreationStepComplete(this.project) : false;
  }

  inviteUser() {
    this.errorMessage = "";
    if (this.owner === this.currentInvite) {
      this.errorMessage = "You can't invite yourself.";
    } else {
      this.isLoading = true;
      this.userService.userExists(this.currentInvite)
        .subscribe((userExists: UserExists) => {
          this.isLoading = false;
          this.updateInvites(userExists.exists);
        });
    }
  }

  mapModelIDsToModelData() {
    return this.existingModels.filter((model: ModelStorageData) => this.project.models.some((id: string) => id === model.modelID));
  }

  createProject() {
    this.store.dispatch(new CreateProjectAction(this.project));
  }

  cancelProjectCreation() {
    this.store.dispatch(new CancelProjectCreationAction());
  }

  private setProject() {
    this.project = ProjectUtil.createEmptyProjectDTO();
  }

  private subscribeToModels() {
    this.storeService.selectStoredModelsNotYetPartOfAProject()
      .pipe(untilDestroyed(this))
      .subscribe((models: ModelStorageData[]) => this.existingModels = models);
  }

  private updateInvites(userExists: boolean) {
    if (userExists) {
      if (ProjectUtil.userIsAlreadyInvited(this.project.invites, this.currentInvite)) {
        this.errorMessage = this.currentInvite + " is already invited.";
      } else {
        this.project.invites.push(this.currentInvite);
        this.currentInvite = "";
      }
    } else {
      this.errorMessage = this.currentInvite + " is not a registered user.";
    }
  }

  private subscribeToUsername() {
    this.storeService.selectProfile()
      .pipe(untilDestroyed(this))
      .subscribe((profile: Profile) => this.owner = profile.username);
  }
}
