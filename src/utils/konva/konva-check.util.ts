import {PointCoordinates} from "../../models/view-related/coordinates.model";
import {StageZoom} from "../../models/view-related/view.model";
import {ViewUtil} from "../view.util";
import {ShapeConfig} from "../../config/shape.config";
import {KonvaAdjustmentUtil} from "./konva-adjustment.util";

export class KonvaCheckUtil {

  // TODO: This does not look nice at all
  static draggedDFDElementIsHoveringCloseToTrashcan(coordinates: PointCoordinates,
                                                    stageZoom: StageZoom,
                                                    draggingHappeningInWorkspace: boolean,
                                                    // An offset needs to be applied when the dragging is initiated from the toolbar,
                                                    // Not from the workspace
                                                    offsetMultiplier): boolean {
    if (draggingHappeningInWorkspace) {
      coordinates = ViewUtil.removeOffsetFromCoordinatesDependingOnZoom(coordinates, stageZoom);
      return coordinates.x
        > ShapeConfig.GET_TRASHCAN_POSITION().x - ShapeConfig.GET_DFD_SHAPE_RADIUS() * 2
        && coordinates.x
        < ShapeConfig.GET_TRASHCAN_POSITION().x + ShapeConfig.GET_TRASHCAN_WIDTH() + ShapeConfig.GET_DFD_SHAPE_RADIUS() * 2
        && coordinates.y
        > ShapeConfig.GET_TRASHCAN_POSITION().y - ShapeConfig.GET_DFD_SHAPE_RADIUS() * 2
        && coordinates.y
        < ShapeConfig.GET_TRASHCAN_POSITION().y + ShapeConfig.GET_TRASHCAN_HEIGHT() + ShapeConfig.GET_DFD_SHAPE_RADIUS() * 2;
    } else {
      const groupPositionAdjustedForOffset: PointCoordinates = KonvaAdjustmentUtil
        .applyOffsetToDragDropElement(coordinates, offsetMultiplier);
      // Honestly, I have no idea why these values are so different then if no offset needs to be applied.
      // It works and is dynamic, so just let it be.
      return groupPositionAdjustedForOffset.x
        > ShapeConfig.GET_LEFT_TOOLBAR_WIDTH() + ShapeConfig.GET_TRASHCAN_POSITION().x - ShapeConfig.GET_DFD_SHAPE_RADIUS() * 3
        && groupPositionAdjustedForOffset.x
        < ShapeConfig.GET_LEFT_TOOLBAR_WIDTH() + ShapeConfig.GET_TRASHCAN_POSITION().x + ShapeConfig.GET_TRASHCAN_WIDTH()
        && groupPositionAdjustedForOffset.y
        > ShapeConfig.GET_TRASHCAN_POSITION().y - ShapeConfig.GET_DFD_SHAPE_RADIUS() * 4
        && groupPositionAdjustedForOffset.y
        < ShapeConfig.GET_TRASHCAN_POSITION().y + ShapeConfig.GET_TRASHCAN_HEIGHT() + ShapeConfig.GET_DFD_SHAPE_RADIUS() * 2;
    }
  }
}
