import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {MainContainerComponent} from '../components/main-container/main-container.component';
import {ToolbarTopComponent} from '../components/toolbar-top/toolbar-top.component';
import {ToolbarLeftComponent} from '../components/toolbar-left/toolbar-left.component';
import {DrawingBoardComponent} from '../components/drawing-board/drawing-board.component';
import {KonvaModule} from 'ng2-konva';
import {StoreModule} from '@ngrx/store';
import {effects, getReducers, reducerToken} from '../store';
import {DataFlowService} from '../services/modelling-related/data-flow.service';
import {EffectsModule} from '@ngrx/effects';
import {ModalService} from '../services/view-related/modal.service';
import {DomService} from '../services/view-related/dom.service';
import {StoreService} from '../services/store.service';
import {FormsModule} from '@angular/forms';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {ThreatViewSidebarComponent} from '../components/threat-view-sidebar/threat-view-sidebar.component';
import {ThreatModelService} from '../services/analysis-related/threat-model.service';
import {HttpClientModule} from '@angular/common/http';
import {PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface, PerfectScrollbarModule} from 'ngx-perfect-scrollbar';
import {CpeCveService} from '../services/analysis-related/cpe-cve.service';
import {MainOptionComponent} from '../components/modals/option-view/main-options/main-option.component';
import {InteractorOptionsComponent} from '../components/modals/option-view/interactor-options/interactor-options.component';
import {ProcessOptionsComponent} from '../components/modals/option-view/process-options/process-options.component';
import {DataStoreOptionsComponent} from '../components/modals/option-view/datastore-options/data-store-options.component';
import {DataFlowOptionsComponent} from '../components/modals/option-view/dataflow-options/data-flow-options.component';
import {LandingViewComponent} from '../components/landing-view/landing-view.component';
import {LoginComponent} from '../components/modals/login/login.component';
import {UserService} from "../services/user-related/user.service";
import {HTTPInterceptorProviders} from "../services/interceptor/auth.interceptor";
import {SaveComponent} from '../components/modals/save/save.component';
import {CpeListComponent} from '../components/modals/option-view/cpe-list/cpe-list.component';
import {AlertComponent} from '../components/modals/alert/alert.component';
import {DfdElementsService} from "../services/modelling-related/dfd-elements.service";
import {TrustBoundaryService} from "../services/modelling-related/trust-boundary.service";
import {SpinnerBigComponent} from '../components/loading-spinners/loading-spinner-big/spinner-big.component';
import {SpinnerSmallComponent} from '../components/loading-spinners/loading-spinner-small/spinner-small.component';
import {ProfileComponent} from '../components/profile/profile.component';
import { ThreatFilterComponent } from '../components/threat-view-sidebar/threat-filter/threat-filter.component';
import { ThreatComponent } from '../components/threat-view-sidebar/threat/threat.component';
import { CveComponent } from '../components/threat-view-sidebar/cve/cve.component';
import { CveFilterComponent } from '../components/threat-view-sidebar/cve-filter/cve-filter.component';
import {Ng5SliderModule} from "ng5-slider";
import { FeedbackComponent } from '../components/modals/feedback/feedback.component';
import {FeedbackService} from "../services/feedback.service";
import { ProfileSidebarComponent } from '../components/profile/profile-sidebar/profile-sidebar.component';
import {StoreDevtoolsModule} from "@ngrx/store-devtools";
import {environment} from "../environments/environment";
import { ProjectsComponent } from '../components/profile/projects/projects.component';
import { ModelsComponent } from '../components/profile/models/models.component';
import {StorageService} from "../services/user-related/storage.service";
import { StoredModelComponent } from '../components/profile/models/stored-model/stored-model.component';
import { ModelDetailsComponent } from '../components/profile/models/model-details/model-details.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { ProjectCreationComponent } from '../components/profile/projects/project-creation/project-creation.component';
import { ProjectModelListComponent } from '../components/profile/projects/project-creation/project-model-list/project-model-list.component';
import { UserInviteListComponent } from '../components/profile/projects/project-creation/user-invite-list/user-invite-list.component';
import {ProjectService} from "../services/user-related/project.service";
import { StoredProjectComponent } from '../components/profile/projects/stored-project/stored-project.component';
import { ProjectDetailsComponent } from '../components/profile/projects/project-details/project-details.component';
import { ProjectDetailsModelItemComponent } from '../components/profile/projects/project-details/project-details-model-item/project-details-model-item.component';
import { DeleteElementAlertComponent } from '../components/modals/alert/delete-element-alert/delete-element-alert.component';
import { LeavingWorkareaAlertComponent } from '../components/modals/alert/leaving-workarea-alert/leaving-workarea-alert.component';
import { NewModelAlertComponent } from '../components/modals/alert/new-model-alert/new-model-alert.component';
import { SignOutAlertComponent } from '../components/modals/alert/sign-out-alert/sign-out-alert.component';
import { DeleteModelAlertComponent } from '../components/modals/alert/delete-model-alert/delete-model-alert.component';
import { DeleteProjectAlertComponent } from '../components/modals/alert/delete-project-alert/delete-project-alert.component';
import { LoadModelAlertComponent } from '../components/modals/alert/load-model-alert/load-model-alert.component';
import { UnlinkModelAlertComponent } from '../components/modals/alert/unlink-model-alert/unlink-model-alert.component';
import { InvitesComponent } from '../components/profile/invites/invites.component';
import { StoredInviteComponent } from '../components/profile/invites/stored-invite/stored-invite.component';
import { JoinProjectAlertComponent } from '../components/modals/alert/join-project-alert/join-project-alert.component';
import { DeclineInvitationAlertComponent } from '../components/modals/alert/decline-invitation/decline-invitation-alert.component';
import { LeaveProjectAlertComponent } from '../components/modals/alert/leave-project-alert/leave-project-alert.component';
import { TrustBoundaryOptionsComponent } from '../components/modals/option-view/trust-boundary-options/trust-boundary-options.component';
import { SettingsComponent } from '../components/profile/settings/settings.component';
import {SettingsService} from "../services/user-related/settings.service";

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@NgModule({
  declarations: [
    AppComponent,
    MainContainerComponent,
    ToolbarTopComponent,
    ToolbarLeftComponent,
    DrawingBoardComponent,
    ThreatViewSidebarComponent,
    MainOptionComponent,
    InteractorOptionsComponent,
    ProcessOptionsComponent,
    DataStoreOptionsComponent,
    DataFlowOptionsComponent,
    LandingViewComponent,
    LoginComponent,
    SaveComponent,
    CpeListComponent,
    AlertComponent,
    SpinnerBigComponent,
    SpinnerSmallComponent,
    ProfileComponent,
    ThreatFilterComponent,
    ThreatComponent,
    CveComponent,
    CveFilterComponent,
    FeedbackComponent,
    ProfileSidebarComponent,
    ProjectsComponent,
    ModelsComponent,
    StoredModelComponent,
    ModelDetailsComponent,
    ProjectCreationComponent,
    ProjectModelListComponent,
    UserInviteListComponent,
    StoredProjectComponent,
    ProjectDetailsComponent,
    ProjectDetailsModelItemComponent,
    DeleteElementAlertComponent,
    LeavingWorkareaAlertComponent,
    NewModelAlertComponent,
    SignOutAlertComponent,
    DeleteModelAlertComponent,
    DeleteProjectAlertComponent,
    LoadModelAlertComponent,
    UnlinkModelAlertComponent,
    InvitesComponent,
    StoredInviteComponent,
    JoinProjectAlertComponent,
    DeclineInvitationAlertComponent,
    LeaveProjectAlertComponent,
    TrustBoundaryOptionsComponent,
    SettingsComponent
  ],
  imports: [
    BrowserModule,
    KonvaModule,
    HttpClientModule,
    StoreModule.forRoot(reducerToken),
        !environment.production ?
        StoreDevtoolsModule.instrument({
          actionsBlacklist: ['Add Temporary', 'Update Dragged', 'Dragging', 'Unselect', 'DataFlow Positions']
        }) : [],
    EffectsModule.forRoot(effects),
    FormsModule,
    MatSlideToggleModule,
    Ng5SliderModule,
    PerfectScrollbarModule,
    BrowserAnimationsModule
  ],
  providers: [
    ModalService,
    DomService,
    StoreService,
    ThreatModelService,
    CpeCveService,
    UserService,
    HTTPInterceptorProviders,
    DfdElementsService,
    TrustBoundaryService,
    DataFlowService,
    FeedbackService,
    StorageService,
    ProjectService,
    SettingsService,
    {
      provide: reducerToken,
      useFactory: getReducers
    },
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ],
  entryComponents: [
    MainOptionComponent,
    LoginComponent,
    SaveComponent,
    AlertComponent,
    FeedbackComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
