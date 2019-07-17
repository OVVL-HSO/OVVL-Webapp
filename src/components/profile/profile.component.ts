import {Component, OnDestroy, OnInit} from '@angular/core';
import {SetViewAction} from "../../store/actions/view-related/view.action";
import {View} from "../../models/view-related/view.model";
import {Store} from "@ngrx/store";
import {State} from "../../store";
import {ShowAlertAction} from "../../store/actions/general-interaction-related/alert.action";
import {AlertType} from "../../models/alert.model";
import {untilDestroyed} from "ngx-take-until-destroy";
import {ElementUtil} from "../../utils/element.util";
import {StoreService} from "../../services/store.service";
import {DFDElementState} from "../../store/reducer/modelling-related/dfd-element.reducer";
import {Project} from "../../models/user-related/project.model";
import {ModelStorageData, StoredWork} from "../../models/user-related/storage.model";
import {Observable} from "rxjs";
import {ProfileTab} from "../../models/user-related/profile.model";
import {Invitation} from "../../models/user-related/invitation.model";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {

  projects: Project[];
  models: ModelStorageData[];
  invites: Invitation[];
  shownTab$: Observable<ProfileTab>;
  private userHasAddedElements: boolean;

  constructor(private store: Store<State>,
              private storeService: StoreService) {
  }

  ngOnInit() {
    this.subscribeToElementState();
    this.setUserNameAndMail();
    this.subscribeToStoredWork();
    this.subscribeToShownTab();
  }

  ngOnDestroy() {
  }

  newModel() {
    if (this.userHasAddedElements) {
      this.store.dispatch(new ShowAlertAction({alertType: AlertType.NEW_MODEL}));
    } else {
      this.leaveProfile();
    }
  }

  leaveProfile() {
    this.store.dispatch(new SetViewAction(View.DESIGN));
  }

  private subscribeToElementState() {
    this.storeService.selectElementState()
      .pipe(untilDestroyed(this))
      .subscribe((dfdState: DFDElementState) => this.userHasAddedElements = ElementUtil.atLeastOneTypeOfElementExists(dfdState));
  }

  private setUserNameAndMail() {
  }

  private subscribeToStoredWork() {
    this.storeService.selectStoredWork()
      .pipe(untilDestroyed(this))
      .subscribe((storedWork: StoredWork) => {
        this.models = storedWork.models;
        this.projects = storedWork.projects;
        this.invites = storedWork.invites;
      });
  }

  private subscribeToShownTab() {
    this.shownTab$ = this.storeService.selectShownTab().pipe(untilDestroyed(this));
  }
}
