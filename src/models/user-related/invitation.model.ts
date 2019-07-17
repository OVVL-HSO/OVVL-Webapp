export interface Invitation {
  invitationID: string;
  numberOfCollaborators: number;
  owner: string;
  title: string;
  description: string;
  invitedAt: string;
}

export interface InvitationDTO {
  projectID: string;
  username: string;
}
