import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ProjectUtil} from "../../../../../utils/project.util";
import {ProjectDTO} from "../../../../../models/user-related/project.model";

@Component({
  selector: 'app-user-invite-list',
  templateUrl: './user-invite-list.component.html',
  styleUrls: ['./user-invite-list.component.scss']
})
export class UserInviteListComponent implements OnInit {

  project: ProjectDTO;
  @Output()
  updatedProject = new EventEmitter();

  constructor() {
  }

  @Input()
  set currentProject(project: ProjectDTO) {
    this.project = project;
  }

  ngOnInit() {
  }


  removeUser(username: string) {
    this.project.invites = ProjectUtil.removeInvite(this.project.invites, username);
    this.updatedProject.emit(this.project);
  }
}
