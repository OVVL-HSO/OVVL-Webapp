import {Project} from "./project.model";
import {Invitation} from "./invitation.model";

export interface StoredWork {
  models: ModelStorageData[];
  projects: Project[];
  invites: Invitation[];
}

export interface BaseModelStorageData {
  name?: string;
  projectTitle?: string;
  summary: string;
  screenshot: string;
  projectID?: string;
}

export interface ModelStorageData extends BaseModelStorageData {
  modelID: string;
  date: string;
  editedDate?: string;
  owner: string;
}
