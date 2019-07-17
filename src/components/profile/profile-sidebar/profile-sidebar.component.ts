import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {StoreService} from "../../../services/store.service";
import {Profile, ProfileTab} from "../../../models/user-related/profile.model";
import {untilDestroyed} from "ngx-take-until-destroy";
import {ShowAlertAction} from "../../../store/actions/general-interaction-related/alert.action";
import {AlertType} from "../../../models/alert.model";
import {Store} from "@ngrx/store";
import {State} from "../../../store";
import {Observable} from "rxjs";
import {SetProfileTabAction} from "../../../store/actions/user-related/profile.action";

@Component({
  selector: 'app-profile-sidebar',
  templateUrl: './profile-sidebar.component.html',
  styleUrls: ['./profile-sidebar.component.scss']
})
export class ProfileSidebarComponent implements OnInit, OnDestroy {
  shownTab$: Observable<ProfileTab>;
  profile$: Observable<Profile>;
  inviteCount$: Observable<number>;

  @Output()
  changedTab = new EventEmitter();

  constructor(private storeService: StoreService, private store: Store<State>) {
  }

  ngOnInit() {
    this.subscribeToProfileData();
    this.subscribeToShownTab();
    this.subscribeToInvites();
  }

  ngOnDestroy() {
  }

  switchTab(tab) {
    this.store.dispatch(new SetProfileTabAction(tab));
  }

  confirmSignOut() {
    this.store.dispatch(new ShowAlertAction({alertType: AlertType.SIGN_OUT}));
  }

  private subscribeToProfileData() {
    this.profile$ = this.storeService.selectProfile().pipe(untilDestroyed(this));
  }

  private subscribeToShownTab() {
    this.shownTab$ = this.storeService.selectShownTab().pipe(untilDestroyed(this));
  }

  private subscribeToInvites() {
    this.inviteCount$ = this.storeService.selectInvitationCount().pipe(untilDestroyed(this));
  }
}
