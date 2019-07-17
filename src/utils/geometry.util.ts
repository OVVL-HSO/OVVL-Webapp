import {PointCoordinates} from '../models/view-related/coordinates.model';
import {ShapeConfig} from '../config/shape.config';
import {DataFlowVectorMetaData} from '../models/modelling-related/dataflow.model';
import {BoundaryMetaData} from "../models/modelling-related/trust-boundary.model";

export class GeometryUtil {

  static getAngleOfVector(startCoords: PointCoordinates, endCoords: PointCoordinates): number {
    return (Math.atan((endCoords.y - startCoords.y) / (endCoords.x - startCoords.x)) * 180 / Math.PI);
  }

  static getLengthOfAVector(startCoords: PointCoordinates, endCoords: PointCoordinates): number {
    const vectorBetweenTwoPoints = this.getVectorBetweenTwoPoints(startCoords, endCoords);
    return Math.sqrt(vectorBetweenTwoPoints.x * vectorBetweenTwoPoints.x + vectorBetweenTwoPoints.y * vectorBetweenTwoPoints.y);
  }

  static getCoordsForShownArrowDataDependingOnItsPosition(startpoint: PointCoordinates,
                                                          endpoint: PointCoordinates): PointCoordinates {
    return {
      x: startpoint.x <= endpoint.x ? startpoint.x : endpoint.x,
      y: startpoint.x <= endpoint.x ? startpoint.y : endpoint.y,
    };
  }

  static getVectorOffsetToTheCenterOfARectangle(startpoint: PointCoordinates, endpoint: PointCoordinates) {
    // First, get the length of the arrow
    const vectorBetweenTwoPoints = this.getVectorBetweenTwoPoints(startpoint, endpoint);
    const lengthOfArrow = this.getLengthOfAVector(startpoint, endpoint);
    // Get factor by which the arrow needs to be offset
    // The divsion equals the distance from the center of the element to the start of the arrow
    const offsetFactor = lengthOfArrow / ShapeConfig.GET_DFD_SHAPE_RADIUS();
    return {
      offsetX: Math.round(vectorBetweenTwoPoints.x / offsetFactor),
      offsetY: Math.round(vectorBetweenTwoPoints.y / offsetFactor)
    };
  }

  static getDataFlowRectangleXAxisOffset(arrowElementMetadata: DataFlowVectorMetaData, offsetFactor) {
    if (this.drawingStartDoesNotEqualVectorStart(arrowElementMetadata)) {
      // Even though the rectangle is drawn starting at the end position of the vector,
      // we want it to seem like it is drawn from the start
      // For this, we want to offset the rectangle from the center of the drawn element +
      // offset it by the length of the tip added later.
      return -ShapeConfig.GET_DFD_SHAPE_RADIUS() - offsetFactor;
    }
    return 0;
  }

  static drawingStartDoesNotEqualVectorStart(arrowElementMetadata: DataFlowVectorMetaData) {
    return (arrowElementMetadata.originalVector.startCoord.x !== arrowElementMetadata.start.x)
      || (arrowElementMetadata.originalVector.startCoord.y !== arrowElementMetadata.start.y);
  }

  static applyARotatedVectorOffsetToAPoint(vectorMetaData: DataFlowVectorMetaData, vectorLength: number): PointCoordinates {
    return {
      x: GeometryUtil.getXPointOfAVectorOfCertainLength(vectorMetaData.start.x, vectorMetaData.rotation, vectorLength),
      y: GeometryUtil.getYPointOfAVectorOfCertainLength(vectorMetaData.start.y, vectorMetaData.rotation, vectorLength)
    };
  }

  static getXPointOfAVectorOfCertainLength(xCoord: number, rotation: number, vectorLength: number) {
    return (
      // Startpoint of a vector
      xCoord
      // Vector Length
      + (vectorLength - ShapeConfig.GET_DATA_FLOW_TIP_LENGTH() / 2)
      // Cos of the vector angle in radians
      * Math.cos(rotation * Math.PI / 180));
  }

  static getYPointOfAVectorOfCertainLength(yCoord: number, rotation: number, vectorLength: number) {
    return (
      // Startpoint of a vector
      yCoord
      // Vector Length minus half the tip
      + (vectorLength - ShapeConfig.GET_DATA_FLOW_TIP_LENGTH() / 2)
      // Sin of the vector angle in radians
      * Math.sin(rotation * Math.PI / 180));
  }

  static getVectorBetweenTwoPoints(startpoint: PointCoordinates, endpoint: PointCoordinates) {
    const differenceX = endpoint.x - startpoint.x;
    const differenceY = endpoint.y - startpoint.y;
    return {
      x: differenceX,
      y: differenceY
    };
  }

  static getSmallerPoint(firstCoordPoint: number, secondCoordPoint: number): number {
    if (firstCoordPoint < secondCoordPoint) {
      return firstCoordPoint;
    }
    return secondCoordPoint;
  }

  static getDistanceBetweenToCoordinatePoints(firstCoordPoint: number, secondCoordPoint: number): number {
    const smallerPoint = this.getSmallerPoint(firstCoordPoint, secondCoordPoint);
    if (smallerPoint === firstCoordPoint) {
      return secondCoordPoint - firstCoordPoint;
    }
    return firstCoordPoint - secondCoordPoint;
  }

  static createRectangleCoordinateFromTwoPoints(startPos: PointCoordinates,
                                                currentPos: PointCoordinates): PointCoordinates {
    return {
      x: this.getSmallerPoint(startPos.x, currentPos.x),
      y: this.getSmallerPoint(startPos.y, currentPos.y)
    };
  }

  static twoPointsAreNotTheSame(pos1: PointCoordinates, pos2: PointCoordinates): boolean {
    return pos1.x !== pos2.x && pos1.y !== pos2.y;
  }

  static movePointInDirectionOfVector(point: PointCoordinates, vector: PointCoordinates): PointCoordinates {
    return {
      x: point.x + vector.x,
      y: point.y + vector.y,
    };
  }

  static coordinatesLayWithinABoundaryRectangle(coordinates: PointCoordinates, boundaryMetaData: BoundaryMetaData) {
    return (coordinates.x >= boundaryMetaData.boundaryPosition.x
      && coordinates.x < boundaryMetaData.boundaryPosition.x + boundaryMetaData.width)
      && (coordinates.y >= boundaryMetaData.boundaryPosition.y
        && coordinates.y <= boundaryMetaData.boundaryPosition.y + boundaryMetaData.height);
  }
}
