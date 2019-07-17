import {ShapeConfig} from '../../config/shape.config';
import {PointCoordinates} from '../../models/view-related/coordinates.model';
import * as Konva from 'konva';
import {GeometryUtil} from "../geometry.util";
import {DataFlowVectorMetaData} from "../../models/modelling-related/dataflow.model";
import {KonvaAdjustmentUtil} from "./konva-adjustment.util";
import {KonvaColorUtil} from "./konva-color.util";
import {GenericElementType} from "../../models/modelling-related/base.model";
import {DFDElementType} from "../../models/types/types.model";
import {BoundaryMetaData, TrustBoundary} from "../../models/modelling-related/trust-boundary.model";
import {BoundaryUtil} from "../boundary.util";

export class KonvaElementsUtil {

  static createElementShape(elementType: GenericElementType,
                            coordinates: PointCoordinates,
                            highlighted: boolean): Konva.Circle {
    return new Konva.Circle({
      x: coordinates.x,
      y: coordinates.y,
      radius: ShapeConfig.GET_DFD_SHAPE_RADIUS(),
      fill: KonvaColorUtil.getElementShapeHEXColor(elementType, highlighted),
      shadowBlur: 10,
      shadowOpacity: 0
    });
  }

  static getNormalDataFlowBaseShape(vectorMetaData: DataFlowVectorMetaData): Konva.Rect {
    return new Konva.Rect({
      x: vectorMetaData.start.x,
      y: vectorMetaData.start.y,
      width: vectorMetaData.length - ShapeConfig.GET_DATA_FLOW_TIP_LENGTH(),
      height: ShapeConfig.GET_DFD_SHAPE_RADIUS() * 2,
      offsetY: ShapeConfig.GET_DFD_SHAPE_RADIUS(),
      offsetX: GeometryUtil.getDataFlowRectangleXAxisOffset(vectorMetaData, ShapeConfig.GET_DATA_FLOW_TIP_LENGTH()),
      rotation: vectorMetaData.rotation,
      fill: KonvaColorUtil.getDataFlowShapeHEXColor(),
      opacity: 0.8,
      scaleX: 1,
      scaleY: 1
    });
  }

  static getTopDataFlowBaseShape(vectorMetaData: DataFlowVectorMetaData): Konva.Rect {
    return new Konva.Rect({
      x: vectorMetaData.start.x,
      y: vectorMetaData.start.y,
      width: vectorMetaData.length - ShapeConfig.GET_REDUCED_DATA_FLOW_TIP_LENGTH(),
      height: ShapeConfig.GET_DFD_SHAPE_RADIUS() - ShapeConfig.GET_HEIGHT_REDUCTION(),
      offsetY: KonvaAdjustmentUtil.setDataFlowYOffsetDependingOnRotation(vectorMetaData.rotation, vectorMetaData.position),
      offsetX: GeometryUtil.getDataFlowRectangleXAxisOffset(vectorMetaData, ShapeConfig.GET_REDUCED_DATA_FLOW_TIP_LENGTH()),
      rotation: vectorMetaData.rotation,
      fill: KonvaColorUtil.getDataFlowShapeHEXColor(),
      opacity: 0.8,
      scaleX: 1,
      scaleY: 1
    });
  }

  static getBottomDataFlowBaseShape(vectorMetaData: DataFlowVectorMetaData): Konva.Rect {
    return new Konva.Rect({
      x: vectorMetaData.start.x,
      y: vectorMetaData.start.y,
      width: vectorMetaData.length - ShapeConfig.GET_REDUCED_DATA_FLOW_TIP_LENGTH(),
      height: ShapeConfig.GET_DFD_SHAPE_RADIUS() - ShapeConfig.GET_HEIGHT_REDUCTION(),
      offsetY: KonvaAdjustmentUtil.setDataFlowYOffsetDependingOnRotation(vectorMetaData.rotation, vectorMetaData.position),
      offsetX: GeometryUtil.getDataFlowRectangleXAxisOffset(vectorMetaData, ShapeConfig.GET_REDUCED_DATA_FLOW_TIP_LENGTH()),
      rotation: vectorMetaData.rotation,
      fill: KonvaColorUtil.getDataFlowShapeHEXColor(),
      opacity: 0.8,
      scaleX: 1,
      scaleY: 1
    });
  }

  static getDataFlowTip(image, height: number): Konva.Image {
    return new Konva.Image({
      image: image,
      width: height / 2,
      height: height,
      offset: {
        x: height / 4,
        y: ShapeConfig.GET_DFD_SHAPE_RADIUS() * 2
      },
      opacity: 0.8
    });
  }

  static createElementText(element: DFDElementType): Konva.Text {
    return new Konva.Text({
      x: element.coordinates.x - ShapeConfig.GET_DFD_SHAPE_RADIUS(),
      y: element.coordinates.y + ShapeConfig.GET_DFD_SHAPE_RADIUS() * 1.3,
      width: ShapeConfig.GET_DFD_SHAPE_RADIUS() * 2,
      fontStyle: 'bold',
      fontSize: ShapeConfig.GET_ELEMENT_FONTSIZE(),
      fontFamily: 'Comfortaa',
      fill: 'white',
      align: 'center',
      text: element.name,
      listening: false
    });
  }

  static createElementTypeText(element: DFDElementType, nameHeight: number): Konva.Text {
    return new Konva.Text({
      x: element.coordinates.x - ShapeConfig.GET_DFD_SHAPE_RADIUS() * 2,
      y: element.coordinates.y + KonvaAdjustmentUtil.getElementTypeOffsetDependingOnNameLenght(nameHeight),
      height: ShapeConfig.GET_DFD_SHAPE_RADIUS(),
      width: ShapeConfig.GET_DFD_SHAPE_RADIUS() * 4,
      fontStyle: 'italic',
      fontSize: ShapeConfig.GET_ELEMENT_FONTSIZE() * 0.8,
      fontFamily: 'Comfortaa',
      fill: 'white',
      align: 'center',
      text: element.type,
      listening: false
    });
  }

  static createDataFlowText(dataFlowVectorMetaData: DataFlowVectorMetaData, name: string): Konva.Text {
    return new Konva.Text({
      // If we just always draw it in the center, it looks weird when the data flow is too short and drawn "the other way around".
      // It is then drawn in the tip.
      // To solve this, when the drawing start is not the actual vector start, we just add half the tip length to make up for it
      width: GeometryUtil.drawingStartDoesNotEqualVectorStart(dataFlowVectorMetaData) ?
        dataFlowVectorMetaData.length + ShapeConfig.GET_DATA_FLOW_TIP_LENGTH() / 2 : dataFlowVectorMetaData.length,
      fontFamily: 'Comfortaa',
      rotation: dataFlowVectorMetaData.rotation,
      align: 'center',
      fill: '#464646',
      text: name,
      listening: false
    });
  }

  static createTrustBoundaryText(trustBoundary: TrustBoundary) {
    return new Konva.Text({
      x: trustBoundary.coordinates.x,
      y: trustBoundary.coordinates.y - ShapeConfig.GET_DFD_SHAPE_RADIUS() / 1.3,
      height: ShapeConfig.GET_DFD_SHAPE_RADIUS(),
      width: trustBoundary.width,
      padding: ShapeConfig.GET_DFD_SHAPE_RADIUS() / 3,
      fontFamily: 'Comfortaa',
      align: 'left',
      fill: 'white',
      text: trustBoundary.name,
      listening: false,
      ellipsis: true
    });
  }

  static createElementImage(image: HTMLImageElement, elementCoordinates: PointCoordinates): Konva.Image {
    return new Konva.Image({
      x: elementCoordinates.x - ShapeConfig.GET_DFD_SHAPE_RADIUS() + ShapeConfig.GET_DFD_SHAPE_RADIUS() * 0.3,
      y: elementCoordinates.y - ShapeConfig.GET_DFD_SHAPE_RADIUS() + ShapeConfig.GET_DFD_SHAPE_RADIUS() * 0.3,
      image: image,
      width: ShapeConfig.GET_IMAGE_SIZE(),
      height: ShapeConfig.GET_IMAGE_SIZE()
    });
  }

  static createTrashCanImage(image: HTMLImageElement): Konva.Image {
    return new Konva.Image({
      x: ShapeConfig.GET_TRASHCAN_POSITION().x,
      y: ShapeConfig.GET_TRASHCAN_POSITION().y,
      image: image,
      height: ShapeConfig.GET_TRASHCAN_HEIGHT(),
      width: ShapeConfig.GET_TRASHCAN_WIDTH()
    });
  }

  static createTemporaryTrustBoundaryShape(startingPosition: PointCoordinates, currentPosition: PointCoordinates): Konva.Rect {
    const boundaryMetaData: BoundaryMetaData = BoundaryUtil.getBoundaryMetaDataFromTwoPositions(startingPosition, currentPosition);
    return this.getBasicTrustBoundaryShape(boundaryMetaData);
  }

  static createTrustBoundaryShape(trustBoundary: TrustBoundary): Konva.Rect {
    const boundaryMetaData: BoundaryMetaData = BoundaryUtil.getBoundaryMetaDataFromTrustBoundary(trustBoundary);
    return this.getBasicTrustBoundaryShape(boundaryMetaData);
  }

  static getTransformer(trustBoundaryGroup: Konva.Group, drawingLayer: Konva.Layer): Konva.Transformer {
    return new Konva.Transformer({
      rotateEnabled: false,
      borderStroke: "#CDCDCD",
      borderDash: [3, 3],
      // There seems to be an error with the Konva Transformer Konfig. Works, but shows an error. Let's just ignore it...
      // @ts-ignore
      anchorCornerRadius: 14,
      padding: ShapeConfig.GET_TRANSFORM_BOUNDARY_PADDING(),
      anchorStroke: "#5A5A5A",
      anchorFill: "#5A5A5A",
      boundBoxFunc: (oldBox, newBox) => KonvaAdjustmentUtil
        .moveTrustBoundaryTextRelativeToRezising(oldBox, newBox, trustBoundaryGroup, drawingLayer)
    });
  }

  private static getBasicTrustBoundaryShape(boundaryMetaData: BoundaryMetaData): Konva.Rect {
    return new Konva.Rect({
      x: boundaryMetaData.boundaryPosition.x,
      y: boundaryMetaData.boundaryPosition.y,
      width: boundaryMetaData.width,
      height: boundaryMetaData.height,
      name: 'boundary',
      draggable: false,
      cornerRadius: 14,
      dash: [10, 5],
      stroke: "#CDCDCD"
    });
  }
}
