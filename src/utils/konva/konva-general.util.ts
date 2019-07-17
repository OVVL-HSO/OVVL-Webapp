import {ElementRef} from "@angular/core";
import * as Konva from "konva";
import {GenericElementType} from "../../models/modelling-related/base.model";
import {KonvaElementsUtil} from "./konva-elements.util";
import {ShapeConfig} from "../../config/shape.config";
import {DataFlowVectorMetaData} from "../../models/modelling-related/dataflow.model";
import {GeometryUtil} from "../geometry.util";
import {KonvaAdjustmentUtil} from "./konva-adjustment.util";
import {PointCoordinates} from "../../models/view-related/coordinates.model";
import {DataFlowUtil} from "../data-flow.util";
import {DFDElementType} from "../../models/types/types.model";
import {v4 as uuid} from 'uuid';

export class KonvaGeneralUtil {

  static createElementGroup(dfdElement: DFDElementType,
                            image: HTMLImageElement,
                            draggable: boolean): Konva.Group {
    const elementShape: Konva.Circle = KonvaElementsUtil
      .createElementShape(dfdElement.genericType, dfdElement.coordinates, dfdElement.selected);
    const elementImage: Konva.Image = KonvaElementsUtil.createElementImage(image, dfdElement.coordinates);
    const elementText: Konva.Text = KonvaElementsUtil.createElementText(dfdElement);
    const elementTypeText: Konva.Text = KonvaElementsUtil.createElementTypeText(dfdElement, elementText.getHeight());
    const elementGroup = new Konva.Group({draggable: draggable}).add(elementShape, elementImage, elementText, elementTypeText);
    elementGroup.name(dfdElement.id);
    KonvaAdjustmentUtil.adjustElementHighlighting(elementGroup, dfdElement.genericType, dfdElement.selected);
    return elementGroup;
  }

  static createDragDropElementGroup(elementType: GenericElementType,
                                    image: HTMLImageElement,
                                    offsetMultiplier: number) {
    const elementShape: Konva.Circle = KonvaElementsUtil.createElementShape(elementType,
      KonvaGeneralUtil.getDragDropShapeCoordinates(offsetMultiplier), true);
    KonvaAdjustmentUtil.toggleElementDropShadow(elementShape, true);
    const elementCoordinates = KonvaGeneralUtil.getDragDropShapeCoordinates(offsetMultiplier);
    const elementImage: Konva.Image = KonvaElementsUtil.createElementImage(image, elementCoordinates);
    return new Konva.Group().add(elementShape, elementImage);
  }

  static createBaseDataFlowGroup(dataFlowVectorMetaData: DataFlowVectorMetaData, dataFlowTipImage: Konva.Image): Konva.Group {
    let dataFlowTipSitsOnRectangle: boolean;
    const dataFlowGroup: Konva.Group = new Konva.Group();
    if (DataFlowUtil.dataFlowIsLongEnoughToContainBodyShape(dataFlowVectorMetaData.length)) {
      const dataFlowRectangle: Konva.Rect = DataFlowUtil.getBodyRectangleMatchingVector(dataFlowVectorMetaData);
      dataFlowGroup.add(dataFlowRectangle);
      dataFlowTipSitsOnRectangle = true;
    } else {
      dataFlowTipSitsOnRectangle = false;
    }

    const dataFlowTip: Konva.Image = KonvaGeneralUtil
      .configureDataFlowTip(dataFlowTipImage, dataFlowVectorMetaData, dataFlowTipSitsOnRectangle);
    dataFlowGroup.add(dataFlowTip);
    return dataFlowGroup;
  }

  static createTrashCanGroup(deleteImage: any): Konva.Group {
    const trashCanImage: Konva.Image = KonvaElementsUtil.createTrashCanImage(deleteImage);
    return new Konva.Group().add(trashCanImage);
  }

  static destroyExistingAndDrawNewTemporaryDataFlow(dataFlowVectorMetaData: DataFlowVectorMetaData,
                                                    drawingLayer: Konva.Layer,
                                                    drawingStage: Konva.Stage,
                                                    dataFlowTip: Konva.Image) {
    drawingStage.find('.TempDataFlow').each(tempDataFlow => tempDataFlow.destroy());
    const dataFlowGroup: Konva.Group = KonvaGeneralUtil.createBaseDataFlowGroup(dataFlowVectorMetaData, dataFlowTip);
    dataFlowGroup.name("TempDataFlow");
    let dataFlowName: Konva.Text;
    if (DataFlowUtil.dataFlowIsLongEnoughToContainDescription(dataFlowVectorMetaData.length, dataFlowVectorMetaData.position)) {
      dataFlowName = KonvaGeneralUtil.getDataFlowText(dataFlowVectorMetaData, "Data Flow");
      dataFlowGroup.add(dataFlowName);
    }
    KonvaGeneralUtil.addGroupToLayerAndDraw(drawingLayer, dataFlowGroup);
  }

  static destroySpecificElementsOnlayer(elementsToBeDestroyed: string[], drawingLayer: Konva.Layer) {
    elementsToBeDestroyed.forEach((elementID: string) =>
      drawingLayer.find('.' + elementID).each((foundElement) => foundElement.destroy()));
    drawingLayer.batchDraw();
  }

  static getDragDropShapeCoordinates(offsetMultiplier: number): PointCoordinates {
    return {
      x: ShapeConfig.GET_DFD_DRAG_SHAPE_COORDINATES().x,
      y: ShapeConfig.GET_DFD_DRAG_SHAPE_COORDINATES().y + ShapeConfig.GET_DFD_SHAPE_OFFSET() * offsetMultiplier
    };
  }

  static createStage(stageContainer: ElementRef, draggable: boolean): Konva.Stage {
    return new Konva.Stage({
      name: uuid(),
      container: stageContainer.nativeElement,
      width: stageContainer.nativeElement.clientWidth,
      height: stageContainer.nativeElement.clientHeight,
      draggable: draggable
    });
  }

  static changeWidthAndHeightOfDrawingStage(stage: Konva.Stage) {
    stage.width(window.innerWidth);
    stage.height(window.innerHeight);
  }

  static createLayerAndPlaceItOnStage(stage: Konva.Stage): Konva.Layer {
    const newLayer: Konva.Layer = new Konva.Layer();
    stage.add(newLayer);
    return newLayer;
  }

  static addGroupToLayerAndDraw(layer: Konva.Layer, group: Konva.Group) {
    layer.add(group);
    layer.batchDraw();
  }

  static addGroupToLayerAndMoveLayerToTop(layer: Konva.Layer, group: Konva.Group) {
    layer.add(group);
    layer.moveToTop();
  }

  static configureDataFlowTip(image, vectorMetaData: DataFlowVectorMetaData, tipSitsOnTopOfRectangle: boolean): Konva.Image {
    let dataFlowTip: Konva.Image;
    if (tipSitsOnTopOfRectangle) {
      dataFlowTip = KonvaElementsUtil.getDataFlowTip(image, ShapeConfig.GET_DFD_SHAPE_RADIUS() * 4);
    } else {
      dataFlowTip = KonvaElementsUtil.getDataFlowTip(image, vectorMetaData.length);
    }
    if (GeometryUtil.drawingStartDoesNotEqualVectorStart(vectorMetaData)) {
      KonvaAdjustmentUtil.adjustDataFlowTipPositionToPointLeft(dataFlowTip, vectorMetaData);
    } else {
      KonvaAdjustmentUtil.adjustDataFlowTipPositionToPointRight(dataFlowTip, vectorMetaData);
    }
    dataFlowTip = KonvaAdjustmentUtil
      .adjustDataFlowTipSizeAndOffsetIfTwoDataFlowsConnectSameElements(dataFlowTip, vectorMetaData, tipSitsOnTopOfRectangle);
    return dataFlowTip;
  }

  static getDataFlowText(dataFlowVectorMetaData: DataFlowVectorMetaData, name: string): Konva.Text {
    let dataFlowText: Konva.Text = KonvaElementsUtil.createDataFlowText(dataFlowVectorMetaData, name);
    dataFlowText = KonvaAdjustmentUtil.adjustDataFlowNamePosition(dataFlowText, dataFlowVectorMetaData);
    return dataFlowText;
  }

  static setGrabbingCursorOnStage(stage: Konva.Stage) {
    stage.container().style.cursor = "grabbing";
  }

  static setPointerCursorOnStage(stage: Konva.Stage) {
    stage.container().style.cursor = "pointer";
  }

  static setDefaultCursorOnStage(stage: Konva.Stage) {
    stage.container().style.cursor = "default";
  }

  static clearLayer(layer: Konva.Layer<Konva.Node>) {
    layer.destroyChildren();
    layer.batchDraw();
  }

  static deleteElementFromLayer(layer: Konva.Layer, elementID: string) {
    layer.find("." + elementID).each(element => element.destroy());
    layer.draw();
  }

  static getElementsToolbarOffsetMultiplier(elementType: GenericElementType) {
    // This is used so the drag & drop elements are rendered at the right position above the buttons
    return {
      [GenericElementType.INTERACTOR]: 0,
      [GenericElementType.PROCESS]: 1,
      [GenericElementType.DATASTORE]: 2,
    }[elementType];
  }

  static elementNeedsToBeRedrawn(id: string, elementsToBeRedrawn: string[]): boolean {
    return elementsToBeRedrawn.some((elementID: string) => elementID === id);
  }

  static mouseTargetIsNotAnElement(evt) {
    return evt.target.getClassName() !== "Rect" && evt.target.getClassName() !== "Circle" && evt.target.getClassName() !== "Image";
  }
}
