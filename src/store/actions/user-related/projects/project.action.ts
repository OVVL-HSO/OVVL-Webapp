import {ProjectCreationActions} from "./project-creation.action";
import {ProjectDeleteActions} from "./project-delete.action";
import {ProjectLinkActions} from "./project-link.action";
import {ProjectInvitationActions} from "./project-invitation.action";
import {ProjectLeaveActions} from "./project-leave.action";


export enum ProjectErrorOrigin {
  CREATE = "create",
  DELETE = "delete",
  LINK = "link",
  UNLINK = "unlink",
  INVITE = "invite",
  JOIN = "join",
  DECLINE = "decline",
  LEAVE = "leave"
}

export type ProjectActions =
  | ProjectCreationActions
  | ProjectDeleteActions
  | ProjectLinkActions
  | ProjectLeaveActions
  | ProjectInvitationActions;
