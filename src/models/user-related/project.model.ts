export interface ProjectDTO {
  title: string;
  description: string;
  models: string[];
  invites: string[];
}

export interface Project extends ProjectDTO{
  collaborators: string[];
  projectID: string;
  creationDate: string;
  owner: string;
}

export interface ProjectModelLink {
  projectID: string;
  modelID: string;
}

export enum ProjectCreationStep {
  GENERAL = 'general',
  LINKING = 'linking',
  INVITES = 'invites',
  SUMMARY = 'summary',
}
