import {DataFlowConnectionInfo, GenericConnectedElement} from '../models/modelling-related/base.model';
import {
  DataFlow,
  DataFlowDrawingPosition,
  DataFlowDTO,
  DataFlowVectorMetaData,
  VectorCoordinates
} from '../models/modelling-related/dataflow.model';
import {PointCoordinates} from '../models/view-related/coordinates.model';
import {GeometryUtil} from './geometry.util';
import {ViewUtil} from './view.util';
import {ShapeConfig} from "../config/shape.config";
import {KonvaElementsUtil} from "./konva/konva-elements.util";
import {StageZoom} from "../models/view-related/view.model";
import {ElementUtil} from "./element.util";

export class DataFlowUtil {

  static createDataFlow(startElement: GenericConnectedElement, endElement: GenericConnectedElement): DataFlowConnectionInfo {
    return {
      startElement: startElement,
      endElement: endElement
    };
  }

  static getDataFlowMetaData(startCoordinates: PointCoordinates,
                             endCoordinates: PointCoordinates,
                             position: DataFlowDrawingPosition): DataFlowVectorMetaData {
    const originalCoordinates: VectorCoordinates = {
      startCoord: startCoordinates,
      endCoord: endCoordinates
    };
    // We want the coordinates of the DataFlows to be offset of the center of the elements
    // Changing the coordinates of the connected elements in the dataflow would be cheating
    const updatedCoordinates: VectorCoordinates = this.getDataFlowCoordsRelativeToTwoElements(startCoordinates, endCoordinates);
    // We need to know at what rotation the elements on the arrows are placed so it always fits
    const rotationOfArrowElements: number = GeometryUtil
      .getAngleOfVector(updatedCoordinates.startCoord, updatedCoordinates.endCoord);
    // We want the length of the arrow to position all elements on it correctly
    const vectorLength: number = GeometryUtil
      .getLengthOfAVector(originalCoordinates.startCoord, updatedCoordinates.endCoord);
    // These coordinates are needed for the startposition of all the other elements on  the arrow
    const drawingStartCoordinates: PointCoordinates =
      GeometryUtil.getCoordsForShownArrowDataDependingOnItsPosition(startCoordinates, endCoordinates);
    return {
      originalVector: originalCoordinates,
      updatedVector: updatedCoordinates,
      rotation: rotationOfArrowElements,
      length: vectorLength,
      start: drawingStartCoordinates,
      position: position
    };
  }

  static dataFlowIsLongEnoughToContainBodyShape(length: number): boolean {
    return length > ShapeConfig.GET_DATA_FLOW_TIP_LENGTH();
  }

  static dataFlowIsLongEnoughToContainDescription(length: number, position: DataFlowDrawingPosition): boolean {
    // This depends on if it's a normal or duplex data flow
    if (position === DataFlowDrawingPosition.NORMAL) {
      return length > ShapeConfig.GET_DFD_SHAPE_RADIUS() * 6.5;
    } else {
      return length > ShapeConfig.GET_DFD_SHAPE_RADIUS() * 4.5;
    }
  }

  static getBodyRectangleMatchingVector(vectorMetaData: DataFlowVectorMetaData) {
    if (vectorMetaData.position === DataFlowDrawingPosition.NORMAL) {
      return KonvaElementsUtil.getNormalDataFlowBaseShape(vectorMetaData);
    }
    if (vectorMetaData.position === DataFlowDrawingPosition.TOP) {
      return KonvaElementsUtil.getTopDataFlowBaseShape(vectorMetaData);
    }
    return KonvaElementsUtil.getBottomDataFlowBaseShape(vectorMetaData);
  }

  static createScaledDataFlowVector(startCoords: PointCoordinates, endCoords: PointCoordinates, stageZoom: StageZoom) {
    const dataFlowVector: VectorCoordinates = {
      startCoord: {
        x: startCoords.x,
        y: startCoords.y,
      },
      endCoord: {
        x: endCoords.x,
        y: endCoords.y
      }
    };
    dataFlowVector.endCoord = ViewUtil.applyOffsetToCoordinatesDependingOnZoom(dataFlowVector.endCoord, stageZoom);
    return dataFlowVector;
  }

  static getDataFlowCoordsRelativeToTwoElements(startCoords: PointCoordinates, endCoords: PointCoordinates): VectorCoordinates {
    // A dataFlow (read: the displayed arrow) needs to move around an element freely and be visible at all times
    // Just using the center hides the arrow tip and its start
    // This function basically creates an imaginary circle around an element, on which an arrow moves - relative to its start- and endpoints

    // First, we need to calculate the offset from the center
    const offset = GeometryUtil.getVectorOffsetToTheCenterOfARectangle(startCoords, endCoords);
    // We add the offset to the center for the starting point
    const newStartX = startCoords.x + offset.offsetX;
    const newStartY = startCoords.y + offset.offsetY;

    // We substract it from the center of the end point
    const newEndX = endCoords.x - offset.offsetX;
    const newEndY = endCoords.y - offset.offsetY;

    return {
      startCoord: {
        x: newStartX,
        y: newStartY
      },
      endCoord: {
        x: newEndX,
        y: newEndY
      }
    };
  }

  static convertDataFlowsToDTOs(dataFlows: DataFlow[]): DataFlowDTO[] {
    return dataFlows.map((dataFlow: DataFlow) => this.convertDataFlowToDTO(dataFlow));
  }

  static convertDataFlowToDTO(dataFlow: DataFlow): DataFlowDTO {
    return {
      id: dataFlow.id,
      name: dataFlow.name,
      startElement: {
        id: dataFlow.connectedElements.startElement.id,
        type: dataFlow.connectedElements.startElement.type
      },
      endElement: {
        id: dataFlow.connectedElements.endElement.id,
        type: dataFlow.connectedElements.endElement.type
      },
      type: dataFlow.type,
      options: dataFlow.options,
      cpe: dataFlow.cpe ? dataFlow.cpe.cpeName : ""
    };
  }

  static findDataFlowBuildingDuplexCommunication(dataFlows: DataFlow[], idOfDataFlowToBeDeleted: string): DataFlow {
    return dataFlows.find((dataFlow: DataFlow) =>
      dataFlow.id === idOfDataFlowToBeDeleted && dataFlow.position !== DataFlowDrawingPosition.NORMAL);
  }

  static newDataFlowWasAdded(newDataFlows: DataFlow[], dataFlows: DataFlow[]) {
    return newDataFlows.length > dataFlows.length;
  }

}
