import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Invitation} from "../../../../models/user-related/invitation.model";
import {GeneralUtil} from "../../../../utils/general.util";

@Component({
  selector: 'app-stored-invite',
  templateUrl: './stored-invite.component.html',
  styleUrls: ['./stored-invite.component.scss']
})
export class StoredInviteComponent implements OnInit {

  invitation: Invitation;

  @Input()
  set invite(invite: Invitation) {
    this.invitation = invite;
  }

  @Output()
  join = new EventEmitter();

  @Output()
  decline = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  getInviteDate() {
    return GeneralUtil.convertUTCToDDMMYYYY(this.invitation.invitedAt);
  }

  acceptInvitation() {
    this.join.emit();
  }

  declineInvitation() {
    this.decline.emit();
  }
}
