import {GenericElementData} from "./modelling-related/base.model";

export interface AlertState {
  alert?: Alert;
}

export type Alert = LeaveWorkSpaceAlert
  | NewModelAlert
  | SignOutAlert
  | LoadModelAlert
  | UnlinkModelAlert
  | DeleteElementAlert
  | DeleteProjectAlert
  | DeleteModelAlert
  | JoinProjectAlert
  | LeaveProjectAlert
  | DeclineInvitationAlert;

export interface DeleteElementAlert {
  alertType: AlertType.DELETE_ELEMENT;
  elements: GenericElementData[];
}

export interface LeaveWorkSpaceAlert {
  alertType: AlertType.LEAVE_WORKSPACE;
}

export interface NewModelAlert {
  alertType: AlertType.NEW_MODEL;
}

export interface SignOutAlert {
  alertType: AlertType.SIGN_OUT;
}

export interface DeleteModelAlert {
  alertType: AlertType.DELETE_MODEL;
  projectTitle?: string;
  modelTitle: string;
  modelID: string;
}

export interface DeleteProjectAlert {
  alertType: AlertType.DELETE_PROJECT;
  projectTitle: string;
  projectID: string;
  modelCount: number;
}

export interface LoadModelAlert {
  alertType: AlertType.LOAD_MODEL;
  modelTitle: string;
  modelID: string;
}

export interface JoinProjectAlert {
  alertType: AlertType.JOIN_PROJECT;
  invitationID: string;
  projectTitle: string;
  owner: string;
}

export interface LeaveProjectAlert {
  alertType: AlertType.LEAVE_PROJECT;
  projectTitle: string;
  projectID: string;
  owner: string;
}

export interface DeclineInvitationAlert {
  alertType: AlertType.DECLINE_INVITATION;
  invitationID: string;
  projectTitle: string;
  owner: string;
}

export interface UnlinkModelAlert {
  alertType: AlertType.UNLINK_MODEL;
  modelTitle: string;
  projectTitle: string;
  modelID: string;
  projectID: string;
}

export enum AlertType {
  LEAVE_WORKSPACE = 'Reset',
  NEW_MODEL = 'New Model',
  SIGN_OUT = 'Sign Out',
  LOAD_MODEL = 'Load Model',
  UNLINK_MODEL = 'Unlink Model',
  DELETE_ELEMENT = 'Delete Element',
  DELETE_MODEL = 'Delete Model',
  DELETE_PROJECT = 'Delete Project',
  JOIN_PROJECT = 'Join Project',
  LEAVE_PROJECT = 'Leave Project',
  DECLINE_INVITATION = 'Decline Invitation'
}
