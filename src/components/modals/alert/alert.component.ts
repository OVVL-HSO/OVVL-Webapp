import {Component, OnDestroy, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {State} from "../../../store";
import {CloseAlertAction} from "../../../store/actions/general-interaction-related/alert.action";
import {View} from "../../../models/view-related/view.model";
import {SetViewAction} from "../../../store/actions/view-related/view.action";
import {ElementUtil} from "../../../utils/element.util";
import {StoreService} from "../../../services/store.service";
import {untilDestroyed} from "ngx-take-until-destroy";
import {
  Alert,
  AlertType,
  DeclineInvitationAlert,
  DeleteElementAlert,
  DeleteModelAlert,
  DeleteProjectAlert,
  JoinProjectAlert,
  LeaveProjectAlert,
  LeaveWorkSpaceAlert,
  LoadModelAlert,
  NewModelAlert,
  SignOutAlert,
  UnlinkModelAlert
} from "../../../models/alert.model";
import {GenericElementData, GenericElementType} from "../../../models/modelling-related/base.model";
import {
  DeleteDFDlementAction,
  DeleteTrustBoundaryAction,
  ResetCurrentDFDModelAction
} from "../../../store/actions/modelling-related/element-delete.action";
import {
  ToggleTrustBoundaryDrawingAction,
  ToogleDataFlowDrawingAction
} from "../../../store/actions/general-interaction-related/toolbar.action";
import {DeleteDFDAction, LoadSavedDFDAction} from "../../../store/actions/modelling-related/dfd-model.action";
import {ProjectModelLink} from "../../../models/user-related/project.model";
import {DeleteProjectAction} from "../../../store/actions/user-related/projects/project-delete.action";
import {UnlinkModelFromProjectAction} from "../../../store/actions/user-related/projects/project-link.action";
import {DeclineInvitationAction, JoinProjectAction} from "../../../store/actions/user-related/projects/project-invitation.action";
import {LeaveProjectAction} from "../../../store/actions/user-related/projects/project-leave.action";
import {SignOutAction} from "../../../store/actions/user-related/user.action";

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit, OnDestroy {

  deleteElementAlert: DeleteElementAlert;
  leaveWorkSpaceAlert: LeaveWorkSpaceAlert;
  newModelAlert: NewModelAlert;
  signOutAlert: SignOutAlert;
  modelDeleteAlert: DeleteModelAlert;
  projectDeleteAlert: DeleteProjectAlert;
  loadModelAlert: LoadModelAlert;
  unlinkModelAlert: UnlinkModelAlert;
  joinProjectAlert: JoinProjectAlert;
  leaveProjectAlert: LeaveProjectAlert;
  declineInvitationAlert: DeclineInvitationAlert;

  private dataFlowDrawingEnabled: boolean;
  private trustBoundaryDrawingEnabled: boolean;

  constructor(private store: Store<State>,
              private storeService: StoreService) {
  }


  ngOnInit() {
    this.subscribeToAlertType();
    this.subscribeToDataFlowDrawingState();
    this.subscribeToTrustBoundaryDrawingState();
  }

  ngOnDestroy() {
  }

  deleteModel(modelID: string) {
    this.store.dispatch(new DeleteDFDAction(modelID));
    this.close();
  }

  deleteProject(projectID: string) {
    this.store.dispatch(new DeleteProjectAction(projectID));
    this.close();
  }

  leave() {
    this.store.dispatch(new SetViewAction(View.LANDING));
    this.resetModel();
  }

  deleteElements() {
    this.deleteElementAlert.elements
      .forEach((genericElement: GenericElementData) => genericElement.type !== GenericElementType.TRUST_BOUNDARY ?
        this.store.dispatch(new DeleteDFDlementAction(genericElement.id))
        : this.store.dispatch(new DeleteTrustBoundaryAction(genericElement.id)));
    this.close();
  }

  newModel() {
    this.store.dispatch(new SetViewAction(View.DESIGN));
    this.resetModel();
  }

  signOut() {
    this.store.dispatch(new SignOutAction(View.LANDING));
    this.resetModel();
    this.close();
  }

  close() {
    this.store.dispatch(new CloseAlertAction());
  }

  private resetModel() {
    if (this.dataFlowDrawingEnabled) {
      this.store.dispatch(new ToogleDataFlowDrawingAction());
    }
    if (this.trustBoundaryDrawingEnabled) {
      this.store.dispatch(new ToggleTrustBoundaryDrawingAction());
    }
    this.store.dispatch(new ResetCurrentDFDModelAction(ElementUtil.getEmptyDFDModel()));
    this.store.dispatch(new CloseAlertAction());
  }

  private subscribeToAlertType() {
    this.storeService.selectAlertType()
      .pipe(untilDestroyed(this))
      .subscribe(((currentAlertType: Alert) => {
        if (currentAlertType) {
          this.setCurrentAlertType(currentAlertType);
        }
      }));
  }

  private subscribeToDataFlowDrawingState() {
    this.storeService.selectDataFlowDrawingEnabledState()
      .pipe(untilDestroyed(this))
      .subscribe((dataFlowDrawingEnabled: boolean) => this.dataFlowDrawingEnabled = dataFlowDrawingEnabled);
  }

  private subscribeToTrustBoundaryDrawingState() {
    this.storeService.selectTrustBoundaryDrawingEnabledState()
      .pipe(untilDestroyed(this))
      .subscribe((trustBoundaryDrawingEnabled: boolean) => this.trustBoundaryDrawingEnabled = trustBoundaryDrawingEnabled);
  }

  private setCurrentAlertType(alert: Alert) {
    switch (alert.alertType) {
      case AlertType.LEAVE_WORKSPACE:
        this.leaveWorkSpaceAlert = alert;
        break;
      case AlertType.NEW_MODEL:
        this.newModelAlert = alert;
        break;
      case AlertType.DELETE_ELEMENT:
        this.deleteElementAlert = alert;
        break;
      case AlertType.SIGN_OUT:
        this.signOutAlert = alert;
        break;
      case AlertType.DELETE_MODEL:
        this.modelDeleteAlert = alert;
        break;
      case AlertType.DELETE_PROJECT:
        this.projectDeleteAlert = alert;
        break;
      case AlertType.LOAD_MODEL:
        this.loadModelAlert = alert;
        break;
      case AlertType.UNLINK_MODEL:
        this.unlinkModelAlert = alert;
        break;
      case AlertType.JOIN_PROJECT:
        this.joinProjectAlert = alert;
        break;
      case AlertType.LEAVE_PROJECT:
        this.leaveProjectAlert = alert;
        break;
      case AlertType.DECLINE_INVITATION:
        this.declineInvitationAlert = alert;
        break;
      default:
        break;
    }
  }

  loadModel(modelID: string) {
    this.store.dispatch(new LoadSavedDFDAction(modelID));
    this.close();
  }

  unlinkModel(projectModelLink: ProjectModelLink) {
    this.store.dispatch(new UnlinkModelFromProjectAction(projectModelLink));
    this.close();
  }

  joinProject(invitationID: string) {
    this.store.dispatch(new JoinProjectAction(invitationID));
    this.close();
  }

  declineInvitation(projectID: string) {
    this.store.dispatch(new DeclineInvitationAction(projectID));
    this.close();
  }

  leaveProject(projectID: string) {
    this.store.dispatch(new LeaveProjectAction(projectID));
    this.close();
  }
}
