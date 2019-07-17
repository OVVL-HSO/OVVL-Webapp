import {Component, Input, OnInit} from '@angular/core';
import {Invitation} from "../../../models/user-related/invitation.model";
import {Store} from "@ngrx/store";
import {State} from "../../../store";
import {ShowAlertAction} from "../../../store/actions/general-interaction-related/alert.action";
import {AlertType} from "../../../models/alert.model";

@Component({
  selector: 'app-invites',
  templateUrl: './invites.component.html',
  styleUrls: ['./invites.component.scss']
})
export class InvitesComponent implements OnInit {
  invitations: Invitation[];

  @Input()
  set invites(invites: Invitation[]) {
    this.invitations = invites;
  }

  constructor(private store: Store<State>) { }

  ngOnInit() {
  }

  joinProject(invitation: Invitation) {
    this.store.dispatch(new ShowAlertAction({
      alertType: AlertType.JOIN_PROJECT,
      invitationID: invitation.invitationID,
      projectTitle: invitation.title,
      owner: invitation.owner
    }));
  }


  declineInvitation(invitation: Invitation) {
    this.store.dispatch(new ShowAlertAction({
      alertType: AlertType.DECLINE_INVITATION,
      invitationID: invitation.invitationID,
      projectTitle: invitation.title,
      owner: invitation.owner
    }));
  }
}
