import {Action} from "@ngrx/store";


export const TOGGLE_DATAFLOW_DRAWING = '[DataFlow] Toggle DataFlow Drawing';
export const TOGGLE_BOUNDARY_DRAWING = '[Boundary] Toggle Boundary Drawing';

export class ToogleDataFlowDrawingAction implements Action {
  readonly type = TOGGLE_DATAFLOW_DRAWING;
}

export class ToggleTrustBoundaryDrawingAction implements Action {
  readonly type = TOGGLE_BOUNDARY_DRAWING;
}


export type ToolbarActions = ToogleDataFlowDrawingAction | ToggleTrustBoundaryDrawingAction;
