import {PointCoordinates} from '../models/view-related/coordinates.model';
import {StageZoom} from "../models/view-related/view.model";
import {ZoomConfig} from "../config/zoom.config";
import * as Konva from "konva";

export class ViewUtil {

  static getStageZoom(scale: number, position: PointCoordinates): StageZoom {
    return {
      scale: scale,
      position: position
    };
  }

  static applyOffsetToCoordinatesDependingOnZoom(currentPosition: PointCoordinates,
                                                 zoomLevel: StageZoom): PointCoordinates {
    return {
      x: currentPosition.x / zoomLevel.scale - zoomLevel.position.x / zoomLevel.scale,
      y: currentPosition.y / zoomLevel.scale - zoomLevel.position.y / zoomLevel.scale
    };
  }

  static removeOffsetFromCoordinatesDependingOnZoom(currentPosition: PointCoordinates,
                                                    zoomLevel: StageZoom): PointCoordinates {
    return {
      x: (currentPosition.x + zoomLevel.position.x / zoomLevel.scale) * zoomLevel.scale,
      y: (currentPosition.y + zoomLevel.position.y / zoomLevel.scale) * zoomLevel.scale
    };
  }

  static applyScalingToPoint(point: PointCoordinates, scale: number): PointCoordinates {
    return {
      x: point.x / scale,
      y: point.y / scale
    };
  }

  static convertScaleIntoPercentage(scale: number) {
    let scalePercentage = 0;
    if (scale === 1) {
      return scalePercentage;
    } else if (scale > 1) {
      scalePercentage = 100 * (scale - 1) / (ZoomConfig.MAX_SCALE - 1);
    } else {
      scalePercentage = -100 * (scale - 1) / (ZoomConfig.MIN_SCALE - 1);
    }
    return Math.round(scalePercentage);
  }

  static scaleIsWithinScaleLimits(newScale: number) {
    return newScale <= ZoomConfig.MAX_SCALE + ZoomConfig.SCALE_FACTOR && newScale >= ZoomConfig.MIN_SCALE - ZoomConfig.SCALE_FACTOR;
  }

  static getZoomData(zoomIn: boolean,
                     scaleFactor: number,
                     currentStagePosition: PointCoordinates,
                     initialScale: number): StageZoom {
    const mousePointTo = {
      x: ZoomConfig.WORKING_AREA_WIDTH / 2 / initialScale - currentStagePosition.x / initialScale,
      y: ZoomConfig.WORKING_AREA_HEIGHT / 2 / initialScale - currentStagePosition.y / initialScale,
    };

    const newScale = zoomIn ? initialScale + scaleFactor : initialScale - scaleFactor;
    const newPos = {
      x: -(mousePointTo.x - ZoomConfig.WORKING_AREA_WIDTH / 2 / newScale) * newScale,
      y: -(mousePointTo.y - ZoomConfig.WORKING_AREA_HEIGHT / 2 / newScale) * newScale
    };
    return {
      scale: newScale,
      position: newPos
    };
  }

  static applyZoomToDrawingStage(drawingStage: Konva.Stage, zoomData: StageZoom) {
    drawingStage.scale({x: zoomData.scale, y: zoomData.scale});
    drawingStage.position(zoomData.position);
    drawingStage.batchDraw();
  }

  static resetZoomOnDrawingStage(drawingStage: Konva.Stage) {
    drawingStage.x(0);
    drawingStage.y(0);
    drawingStage.scaleX(1);
    drawingStage.scaleY(1);
    drawingStage.batchDraw();
  }
}
