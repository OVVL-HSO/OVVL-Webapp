export interface Profile {
  username: string;
  mail: string;
}

export enum ProfileTab {
  PROJECTS = 'projects',
  MODELS = 'models',
  INVITES = 'invites',
  SETTINGS = 'settings',
}
