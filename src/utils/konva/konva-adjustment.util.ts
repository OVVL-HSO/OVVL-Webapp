import * as Konva from 'konva';
import {DataFlowDrawingPosition, DataFlowVectorMetaData} from '../../models/modelling-related/dataflow.model';
import {GeometryUtil} from '../geometry.util';
import {ShapeConfig} from '../../config/shape.config';
import {KonvaColorUtil} from "./konva-color.util";
import {GenericElementType} from "../../models/modelling-related/base.model";
import {DFDElementType} from "../../models/types/types.model";
import {PointCoordinates} from "../../models/view-related/coordinates.model";
import {KonvaAnimationUtil} from "./konva-animation.util";

export class KonvaAdjustmentUtil {

  static toggleElementDropShadow(element: Konva.Circle, showDropShadow: boolean) {
    showDropShadow ? element.shadowOpacity(0.55) : element.shadowOpacity(0);
  }

  static getUpdatedShapePosition(shapeGroup: Konva.Group<Konva.Node>, lastShapeCoordinates: PointCoordinates): PointCoordinates {
    return {
      x: Math.round(lastShapeCoordinates.x + shapeGroup.getPosition().x),
      y: Math.round(lastShapeCoordinates.y + shapeGroup.getPosition().y)
    };
  }

  // UNUSED !!!!
  /*static adjustDataFlowTipSizeAndOffsetIfTwoDataFlowsConnectSameElements(dataFlowTip: Konva.Image,
                                                                         vectorMetaData: DataFlowVectorMetaData,
                                                                         tipSitsOnTopOfRectangle: boolean): Konva.Image {
    if (vectorMetaData.position === DataFlowDrawingPosition.NORMAL) {
      return dataFlowTip;
    } else {
      // If two dataflows connect two elements, we need to adjust the scale and position of the tip
      // (Because the tips are not pointing towards the center anymore)
      // The following width is fine in any case
      dataFlowTip.width(ShapeConfig.GET_DFD_SHAPE_RADIUS() - ShapeConfig.GET_HEIGHT_REDUCTION());
      // We also need to account for the case where the Elements connected by the dataflows sit on the Same X-Point.
      // In the case, that the vector between the two elements is so small that no rectangle (to make the arrow longer) is drawn...
      if (!tipSitsOnTopOfRectangle) {
        // ...we just set the tip of the dataflow to be as long as the vector.
        // This is so gab between the dataflow and the elements can be seen.
        dataFlowTip.height(vectorMetaData.length);
      } else {
        // If the dataflow is drawn the noraml way, we just set the tips length to a predefined variable
        dataFlowTip.height(ShapeConfig.GET_REDUCED_DATA_FLOW_TIP_LENGTH());
      }
      // As a next step, we need to adjust the offset between the (imaginary) vector connecting the elements,
      // and the actual drawing position of the dataflow.
      // Here, the startpoint and endpoint of the dataflow are not the only data relevant.
      // Because elements can be positioned in any way to each other,
      // the actual starting position is not always the starting position of the drawing
      // To display the connection correctly, the position of the elements relative to each other needs to be taken into account.
      let offsetX = this.getXOffsetOfDataFlowTipDependingOnDrawingStart(vectorMetaData);
      // We also need to account for the edge-case of a dataflow being drawn at -90°. This is a workaround and can probably be done better.
      offsetX += this.getOffsetOfDataFlowContentWhenAtMinus90Degrees(vectorMetaData);
      dataFlowTip.offsetX(offsetX);
      return dataFlowTip;
    }
  }*/

  static getElementTypeOffsetDependingOnNameLenght(nameHeight: number) {
    if (nameHeight <= ShapeConfig.GET_ELEMENT_FONTSIZE()) {
      return ShapeConfig.GET_DFD_SHAPE_RADIUS() * 1.65;
    } else if (nameHeight <= ShapeConfig.GET_ELEMENT_FONTSIZE() * 2) {
      return ShapeConfig.GET_DFD_SHAPE_RADIUS() * 2;
    } else {
      return ShapeConfig.GET_DFD_SHAPE_RADIUS() * 2.35;
    }
  }

  // UNUSED !!!!
  /*static adjustDataFlowTipPositionToPointLeft(dataFlowTip: Konva.Image, vectorMetaData: DataFlowVectorMetaData) {
    // Here the drawing start of the dataFlowTip is defined
    dataFlowTip.position(GeometryUtil.applyARotatedVectorOffsetToAPoint(
      vectorMetaData,
      // Since in this case the image is drawn from the actual endpoint, so the offset length is less the vector length
      ShapeConfig.GET_DATA_FLOW_TIP_LENGTH() + ShapeConfig.GET_DFD_SHAPE_RADIUS()));
    dataFlowTip.rotation(vectorMetaData.rotation - 90);
  }

  static adjustDataFlowTipPositionToPointRight(dataFlowTip: Konva.Image, vectorMetaData: DataFlowVectorMetaData) {
    // Here the drawing start of the dataFlowTip is defined
    dataFlowTip.position(GeometryUtil.applyARotatedVectorOffsetToAPoint(
      vectorMetaData,
      // Since in this case the image is drawn beginning from the start element, we need to offset it be the vector length
      vectorMetaData.length));
    dataFlowTip.rotation(vectorMetaData.rotation + 90);
  }*/

  static adjustDataFlowNamePosition(dataFlowText: Konva.Text, dataFlowVectorMetaData: DataFlowVectorMetaData): Konva.Text {
    dataFlowText.position({
      x: dataFlowVectorMetaData.start.x,
      y: dataFlowVectorMetaData.start.y
    });
    let offsetY = 0;
    // single data flows
    if (dataFlowVectorMetaData.position === DataFlowDrawingPosition.NORMAL) {
      dataFlowText.fontSize(ShapeConfig.GET_ELEMENT_FONTSIZE() * 2);
      offsetY = ShapeConfig.GET_ELEMENT_FONTSIZE();
    // double data flows
    } else {
      dataFlowText.fontSize(ShapeConfig.GET_ELEMENT_FONTSIZE());
      // We need to account for the edge case of a data flow being drawn at -90°. This is a workaround and can probably be done better.
      offsetY = KonvaAdjustmentUtil.getOffsetOfDataFlowContentWhenAtMinus90Degrees(dataFlowVectorMetaData);
      // The base vector connects the center of the elements.
      // To place the text in the center of the vector, we offset it by half the fontsize...
      if (dataFlowVectorMetaData.position === DataFlowDrawingPosition.BOTTOM) {
        // ...then add half the height of the arrow to the offset
        offsetY += (ShapeConfig.GET_ELEMENT_FONTSIZE() - ShapeConfig.GET_DFD_SHAPE_RADIUS()) / 2;
      } else {
        // ...then substract half the height of the arrow to the offset
        offsetY += (ShapeConfig.GET_ELEMENT_FONTSIZE() + ShapeConfig.GET_DFD_SHAPE_RADIUS()) / 2;
      }
    }
    dataFlowText.offsetY(offsetY);
    return dataFlowText;
  }

  static changeTextColorAndRerenderLayer(layer: Konva.Layer, text: Konva.Text, color: string) {
    text.fill(color);
    layer.batchDraw();
  }

  static cursorIsStillInToolbar(xCoord: number): boolean {
    return xCoord < ShapeConfig.GET_LEFT_TOOLBAR_WIDTH();
  }

  static moveTrustBoundaryTextRelativeToRezising(oldBox: Konva.SizeConfig,
                                                 newBox: Konva.SizeConfig,
                                                 trustBoundaryGroup: Konva.Group,
                                                 drawingLayer: Konva.Layer) {
    const trustBoundaryText = trustBoundaryGroup.find("Text")[0];
    // No idea why the padding needs to be added, but w/e
    trustBoundaryText.y(trustBoundaryText.getPosition().y + newBox.y - oldBox.y + ShapeConfig.GET_TRANSFORM_BOUNDARY_PADDING());
    trustBoundaryText.x(trustBoundaryText.getPosition().x + newBox.x - oldBox.x + ShapeConfig.GET_TRANSFORM_BOUNDARY_PADDING());
    drawingLayer.batchDraw();
    return newBox;
  }

  static adjustElementHighlighting(elementGroup: Konva.Group,
                                   elementType: GenericElementType,
                                   highlight: boolean) {
    const elementImage: any = elementGroup.findOne("Image");
    const elementCicle: any = elementGroup.findOne("Circle");
    if (highlight) {
      this.offsetElementByHalfTheDefaultScaleFactor(elementImage);
      this.scaleElementByDefaultScaleFactor(elementImage);
      this.scaleElementByDefaultScaleFactor(elementCicle);
    } else {
      this.resetElementOffset(elementImage);
      this.resetElementScale(elementImage);
      this.resetElementScale(elementCicle);
    }
    this.toggleElementDropShadow(elementCicle, highlight);
    elementCicle.fill(KonvaColorUtil.getElementShapeHEXColor(elementType, highlight));
  }

  static handleTrashcanHoverElementHighlight(dfdElement: DFDElementType, layer: Konva.Layer, hovering: boolean) {
    const currentGroup: Konva.Group = layer.find<Konva.Group>("." + dfdElement.id)[0];
    const circle: Konva.Circle = currentGroup.findOne("Circle");
    circle.stroke(hovering ? KonvaColorUtil.getElementStrokeColor(dfdElement.genericType) : "");
    circle.strokeWidth(hovering ? 3 : 0);
    KonvaAnimationUtil.playElementTrashcanHoverTween(circle, hovering);
  }

  static handleTrashcanHoverTrustBoundaryHighlight(trustBoundaryGroup: Konva.Group, hovering: boolean) {
    const rect: Konva.Rect = trustBoundaryGroup.findOne("Rect");
    rect.stroke(hovering ? KonvaColorUtil.getElementStrokeColor(GenericElementType.TRUST_BOUNDARY) : "");
    rect.strokeWidth(hovering ? 3 : 0);
    KonvaAnimationUtil.playElementTrashcanHoverTween(rect, hovering);
  }

  static handleTrashcanHoverDragDropelementHighlight(elementGroup: Konva.Group,
                                                     elementType: GenericElementType,
                                                     hovering: boolean) {
    const circle: Konva.Circle = elementGroup.findOne("Circle");
    circle.stroke(hovering ? KonvaColorUtil.getElementStrokeColor(elementType) : "");
    circle.strokeWidth(hovering ? 3 : 0);
    KonvaAnimationUtil.playElementTrashcanHoverTween(circle, hovering);
  }

  static applyOffsetToDragDropElement(coordinates: PointCoordinates, offsetMultiplier: number): PointCoordinates {
    return {
      x: coordinates.x,
      y: coordinates.y + ShapeConfig.GET_DFD_SHAPE_OFFSET() * offsetMultiplier
    };
  }

  // UNUSED !!!! (callers are unused too)
  /*static setDataFlowYOffsetDependingOnRotation(rotation: number, position: DataFlowDrawingPosition) {
    let offsetY = 0;
    if (position === DataFlowDrawingPosition.TOP) {
      if (rotation !== -90) {
        offsetY = ShapeConfig.GET_DFD_SHAPE_RADIUS();
      }
    } else {
      offsetY = -ShapeConfig.GET_HEIGHT_REDUCTION();
      if (rotation === -90) {
        offsetY = ShapeConfig.GET_DFD_SHAPE_RADIUS();
      }
    }
    return offsetY;
  }*/

  static getOffsetOfDataFlowContentWhenAtMinus90Degrees(vectorMetaData: DataFlowVectorMetaData): number {
    let offsetX = 0;
    if (vectorMetaData.rotation === -90) {
      vectorMetaData.position === DataFlowDrawingPosition.TOP ?
        offsetX = -ShapeConfig.GET_DFD_SHAPE_RADIUS() :
        offsetX = ShapeConfig.GET_DFD_SHAPE_RADIUS() + ShapeConfig.GET_HEIGHT_REDUCTION();
    }
    return offsetX;
  }

  // UNUSED !!!!
  /*static getXOffsetOfDataFlowTipDependingOnDrawingStart(vectorMetaData: DataFlowVectorMetaData): number {
    if (!GeometryUtil.drawingStartDoesNotEqualVectorStart(vectorMetaData)) {
      return vectorMetaData.position === DataFlowDrawingPosition.TOP ? ShapeConfig.GET_DFD_SHAPE_RADIUS() : -ShapeConfig.GET_HEIGHT_REDUCTION();
    } else {
      return vectorMetaData.position === DataFlowDrawingPosition.TOP ? -ShapeConfig.GET_HEIGHT_REDUCTION() : ShapeConfig.GET_DFD_SHAPE_RADIUS();
    }
  }*/

  private static scaleElementByDefaultScaleFactor(element: Konva.Node) {
    element.scale({x: 1 + ShapeConfig.DFD_SHAPE_SCALE_FACTOR, y: 1 + ShapeConfig.DFD_SHAPE_SCALE_FACTOR});
  }

  private static resetElementScale(element: Konva.Node) {
    element.scale({x: 1, y: 1});
  }

  private static offsetElementByHalfTheDefaultScaleFactor(element: Konva.Node) {
    // We only divide by half the scale factor, because the scaling happens in every direction
    element.offsetX(ShapeConfig.GET_IMAGE_SIZE() * ShapeConfig.DFD_SHAPE_SCALE_FACTOR / 2);
    element.offsetY(ShapeConfig.GET_IMAGE_SIZE() * ShapeConfig.DFD_SHAPE_SCALE_FACTOR / 2);
  }

  private static resetElementOffset(element: Konva.Node) {
    element.offsetX(0);
    element.offsetY(0);
  }
}
