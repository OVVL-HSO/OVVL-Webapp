import {ProjectCreationStep, ProjectDTO, ProjectModelLink} from "../models/user-related/project.model";

export class ProjectUtil {

  static createEmptyProjectDTO(): ProjectDTO {
    return {
      title: "",
      description: "",
      models: [],
      invites: []
    };
  }

  static firstCreationStepComplete(project: ProjectDTO): boolean {
    return !!project.title.length && !!project.description.length;
  }

  static removeModelFromProjectList(models: string[], modelToBeRemoved: string): string[] {
    return models.filter((modelID: string) => modelID !== modelToBeRemoved);
  }

  static modelIsAlreadyPartOfProject(existingModels: string[], newModelID: string): boolean {
    return existingModels.some((modelID: string) => modelID === newModelID);
  }

  static userIsAlreadyInvited(invites: string[], currentInvite: string): boolean {
    return invites.some((invite: string) => invite === currentInvite);
  }

  static removeInvite(invites: string[], username: string): string[] {
    return invites.filter((invite: string) => invite !== username);
  }

  static getNextCreationProcessStep(forward: boolean, currentStep: ProjectCreationStep): ProjectCreationStep {
    let nextStep: ProjectCreationStep;
    // forward defines in which direction the next step has to be. If its true, we continue, if false, we move back.
    if (currentStep === ProjectCreationStep.GENERAL && forward) {
      nextStep = ProjectCreationStep.LINKING;
    } else if (currentStep === ProjectCreationStep.LINKING) {
      nextStep = forward ? ProjectCreationStep.INVITES : ProjectCreationStep.GENERAL;
    } else if (currentStep === ProjectCreationStep.INVITES) {
      nextStep = forward ? ProjectCreationStep.SUMMARY : ProjectCreationStep.LINKING;
    } else if (currentStep === ProjectCreationStep.SUMMARY && !forward) {
      nextStep = ProjectCreationStep.INVITES;
    }
    return nextStep;
  }

  static createProjectModelLink(projectID: string, modelID: string): ProjectModelLink {
    return {
      modelID: modelID,
      projectID: projectID
    };
  }

  static userIsAlreadyPartOfProject(collaborators: string[], userToBeInvited: string) {
    return collaborators.some((collaborator) => collaborator === userToBeInvited);
  }

  static skipLinkingStepIfNoModelsCanBeLinked(forward: boolean, nextStep: ProjectCreationStep, existingModelCount: number) {
    if (nextStep === ProjectCreationStep.LINKING && existingModelCount === 0) {
      nextStep = ProjectUtil.getNextCreationProcessStep(forward, nextStep);
    }
    return nextStep;
  }
}
