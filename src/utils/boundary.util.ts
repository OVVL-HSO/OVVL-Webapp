import {PointCoordinates} from "../models/view-related/coordinates.model";
import {BoundaryMetaData, TrustBoundary} from "../models/modelling-related/trust-boundary.model";
import {GeometryUtil} from "./geometry.util";
import {DFDElementType} from "../models/types/types.model";
import {DFDElementState} from "../store/reducer/modelling-related/dfd-element.reducer";

export class BoundaryUtil {

  static findElementsWithinABoundary(dfdElements: (DFDElementType)[],
                                     startPos: PointCoordinates,
                                     endPos: PointCoordinates) {
    const boundaryMetaData: BoundaryMetaData = this.getBoundaryMetaDataFromTwoPositions(startPos, endPos);
    return dfdElements.filter((dfdElement: DFDElementType) =>
      GeometryUtil.coordinatesLayWithinABoundaryRectangle(dfdElement.coordinates, boundaryMetaData));
  }

  static findElementsWithinABoundaryBySingleCoordinates(dfdElements: (DFDElementType)[],
                                     boundary: TrustBoundary) {
    const boundaryMetaData: BoundaryMetaData = this.getBoundaryMetaDataFromTrustBoundary(boundary);
    return dfdElements.filter((dfdElement: DFDElementType) =>
      GeometryUtil.coordinatesLayWithinABoundaryRectangle(dfdElement.coordinates, boundaryMetaData));
  }

  static getBoundaryMetaDataFromTwoPositions(startingPosition: PointCoordinates, currentPosition: PointCoordinates): BoundaryMetaData {
    return {
      boundaryPosition: GeometryUtil.createRectangleCoordinateFromTwoPoints(startingPosition, currentPosition),
      width: GeometryUtil.getDistanceBetweenToCoordinatePoints(startingPosition.x, currentPosition.x),
      height: GeometryUtil.getDistanceBetweenToCoordinatePoints(startingPosition.y, currentPosition.y)
    };
  }

  static getBoundaryMetaDataFromTrustBoundary(boundary: TrustBoundary): BoundaryMetaData {
    return {
      boundaryPosition: boundary.coordinates,
      width: boundary.width,
      height: boundary.height
    };
  }

  static boundaryIsBigEnough(startPos: PointCoordinates, endPos: PointCoordinates, scale: number) {
    const width = GeometryUtil.getDistanceBetweenToCoordinatePoints(startPos.x, endPos.x) / scale;
    const height = GeometryUtil.getDistanceBetweenToCoordinatePoints(startPos.y, endPos.y) / scale;
    return width > 10 && height > 10;
  }

  static addElementsInTrustBoundaries(elementState: DFDElementState) {
    elementState.trustBoundaries.map(function (trustBoundary: TrustBoundary) {
      const dfdElementsWithinARectangle: (DFDElementType)[] = BoundaryUtil
        .findElementsWithinABoundaryBySingleCoordinates(elementState.dfdElements, trustBoundary);
      trustBoundary.elements = dfdElementsWithinARectangle.map(element => element.id);
    });
    return elementState.trustBoundaries;
  }

}
