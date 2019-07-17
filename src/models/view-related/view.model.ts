import {PointCoordinates} from "./coordinates.model";

export interface ViewState {
  currentView: View;
  zoomEnabled: boolean;
  needsReset: boolean;
  stageDraggable: boolean;
  stageZoom?: StageZoom;
}

export enum View {
  LANDING = 'landing',
  DESIGN = 'design',
  ANALYSIS = 'analysis',
  PROFILE = 'profile',
}

export interface StageZoom {
  scale: number;
  position: PointCoordinates;
}
