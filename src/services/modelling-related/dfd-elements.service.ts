import {Injectable} from '@angular/core';
import * as Konva from "konva";
import {GenericElementData, GenericElementType} from "../../models/modelling-related/base.model";
import {DataFlow, DataFlowVectorMetaData} from "../../models/modelling-related/dataflow.model";
import {PointCoordinates} from "../../models/view-related/coordinates.model";
import {Store} from "@ngrx/store";
import {State} from "../../store";
import {DataFlowService} from "./data-flow.service";
import {TrustBoundaryService} from "./trust-boundary.service";
import {CopyUtils} from "../../utils/copy.util";
import {KonvaGeneralUtil} from "../../utils/konva/konva-general.util";
import {GeneralUtil} from "../../utils/general.util";
import {KonvaAdjustmentUtil} from "../../utils/konva/konva-adjustment.util";
import {OptionUtil} from "../../utils/option.util";
import {ToggleStageDraggability} from "../../store/actions/view-related/view.action";
import {SelectElementAction, UnselectAllDFDElementsAction} from "../../store/actions/modelling-related/dfd-element.action";
import {ShowAlertAction} from "../../store/actions/general-interaction-related/alert.action";
import {AlertType} from "../../models/alert.model";
import {DraggingElementAction, DroppingElementAction, HoveringOnTrashAction} from "../../store/actions/general-interaction-related/trashcan.action";
import {ElementUtil} from "../../utils/element.util";
import {StageZoom} from "../../models/view-related/view.model";
import {RedrawAllCompleteAction, RedrawCompleteAction} from "../../store/actions/view-related/redraw.action";
import {RedrawState} from "../../store/reducer/view-related/redraw.reducer";
import {KonvaCheckUtil} from "../../utils/konva/konva-check.util";
import {DFDImages} from "../../models/view-related/image.model";
import {DFDElementType} from "../../models/types/types.model";
import {TrustBoundary} from "../../models/modelling-related/trust-boundary.model";
import {UpdateDFDElementAction, UpdateDFDElementOnDragAction} from "../../store/actions/modelling-related/element-update.action";
import {DataFlowUtil} from "../../utils/data-flow.util";
import {InitOptionsViewAction} from "../../store/actions/modelling-related/element-options.action";

@Injectable({
  providedIn: 'root'
})
export class DfdElementsService {

  dfdElementsLayer: Konva.Layer;
  drawingStage: Konva.Stage;
  private freeDrawingStage: Konva.Stage;
  private dragLayer: Konva.Layer;

  private dataFlowBeingDrawn = false;
  private showDesignView: boolean;

  private dfdElements: (DFDElementType)[] = [];
  private dataFlows: DataFlow[] = [];
  private trustBoundaries: TrustBoundary[];

  private initialPositionOfElementBeforeDrag: PointCoordinates;
  private idOfCurrentlyDraggedElement: string;
  private dataFlowWasAddedDuringLastIteration = false;
  private tempDataFlowStartElement: DFDElementType;

  private interactorImage: HTMLImageElement;
  private processImage: HTMLImageElement;
  private dataStoreImage: HTMLImageElement;

  private ctrlPressed: boolean;
  private selectedElements: string[] = [];
  private elementIsAlreadyHoveringOnTrashcan = false;
  private stageZoom: StageZoom;

  constructor(private store: Store<State>,
              private dataFlowService: DataFlowService,
              private trustBoundaryService: TrustBoundaryService) {
  }

  init(drawingStage: Konva.Stage,
       freeDrawingStage: Konva.Stage,
       drawingLayer: Konva.Layer,
       elementImages: DFDImages) {
    this.drawingStage = drawingStage;
    this.freeDrawingStage = freeDrawingStage;
    this.dfdElementsLayer = drawingLayer;

    this.interactorImage = elementImages.interactorImage;
    this.processImage = elementImages.processImage;
    this.dataStoreImage = elementImages.dataStoreImage;

    this.initializeTrustBoundaryState();
    this.initializeDataFlowState();
  }

  handleDrawingBoardDestruction() {
    this.dfdElementsLayer.destroy();
    this.trustBoundaryService.removeStageListener();
    this.dataFlowService.removeStageListener();
  }

  dfdElementStateUpdated(dfdElements: DFDElementType[]) {
    this.dfdElements = dfdElements;
    // Trust Boundary Service needs these elements to highlight "collected" ones when a new Boundary is drawn
    this.trustBoundaryService.setDFDElements(this.dfdElements);
  }

  trustBoundaryDrawingStateUpdated(drawingTrustBoundary: boolean) {
    this.trustBoundaryService.trustBoundaryDrawingStateWasUpdated(drawingTrustBoundary);
  }

  trustBoundariesUpdated(trustBoundaries: TrustBoundary[]) {
    this.trustBoundaries = trustBoundaries;
  }

  shownViewUpdated(showDesignView: boolean) {
    this.showDesignView = showDesignView;
    this.trustBoundaryService.setShownDesignView(this.showDesignView);
    this.dataFlowService.setShownDesignView(this.showDesignView);
  }

  dataFlowDrawingStateUpdated(dataFlowBeingDrawn: boolean) {
    this.dataFlowBeingDrawn = dataFlowBeingDrawn;
  }

  dataFlowsUpdated(newDataFlows: DataFlow[]) {
    // This is so elements set as selected by drawing a dataflow are reset after the dataflow was added
    this.dataFlowWasAddedDuringLastIteration = DataFlowUtil.newDataFlowWasAdded(newDataFlows, this.dataFlows);
    this.dataFlows = newDataFlows;
  }

  temporaryDataFlowUpdated(dataFlowVectorMetaData: DataFlowVectorMetaData) {
    this.dataFlowService.drawTemporaryDataFlow(dataFlowVectorMetaData);
    this.createTemporaryElementOverlayingTempDataFlow();
  }

  updateCtrlPressed(ctrlPressed: boolean) {
    this.ctrlPressed = ctrlPressed;
  }

  stageZoomUpdated(stageZoom: StageZoom) {
    this.stageZoom = stageZoom;
    this.dataFlowService.setStageZoom(stageZoom);
    this.trustBoundaryService.setStageZoom(stageZoom);
  }

  deleteSelectedElementsOnDeleteKeyPress() {
    this.handleDFDElementsDeletion();
    this.handleTrustBoundaryDeletion();
  }

  redraw(redrawState: RedrawState) {
    this.clearDrawingLayerDependingOnElementsWhichNeedToBeRedrawn(redrawState);
    this.drawTrustBoundaries(redrawState);
    this.drawDataFlows(redrawState);
    this.drawDFDElements(redrawState);
    if (redrawState.redrawAll) {
      this.store.dispatch(new RedrawAllCompleteAction());
    }
  }

  private initializeTrustBoundaryState() {
    this.trustBoundaryService.init(this.drawingStage, this.dfdElementsLayer, this.freeDrawingStage);
  }

  private initializeDataFlowState() {
    this.dataFlowService.init(this.drawingStage, this.dfdElementsLayer);
  }

  private drawDFDElements(redrawState: RedrawState) {
    this.dfdElements.forEach((dfdElement: DFDElementType) => {
      if (dfdElement.id !== this.idOfCurrentlyDraggedElement && redrawState.redrawAll) {
        this.createElementGroup(CopyUtils.copyDFDElement(dfdElement));
      } else if ((dfdElement.id !== this.idOfCurrentlyDraggedElement && KonvaGeneralUtil
        .elementNeedsToBeRedrawn(dfdElement.id, redrawState.elementsToBeRedrawn))) {
        this.createElementGroup(CopyUtils.copyDFDElement(dfdElement));
        this.store.dispatch(new RedrawCompleteAction(dfdElement.id));
      }
    });
  }

  private drawDataFlows(redrawState: RedrawState) {
    this.dataFlowService.drawDataFlows(this.dataFlows, redrawState);
  }

  private drawTrustBoundaries(redrawState: RedrawState) {
    this.trustBoundaryService.drawTrustBoundaries(this.trustBoundaries, redrawState);
  }

  private createElementGroup(dfdElement: DFDElementType) {
    const elementGroup = KonvaGeneralUtil.createElementGroup(
      dfdElement,
      this.getElementGroupImage(dfdElement.genericType),
      this.showDesignView
    );
    this.setElementListener(elementGroup, dfdElement);
    KonvaGeneralUtil.addGroupToLayerAndDraw(this.dfdElementsLayer, elementGroup);
  }

  private setElementListener(elementGroup: Konva.Group<Konva.Node>,
                             dfdElement: DFDElementType) {
    elementGroup.on("dragstart", () => this.handleDFDElementDragStart(elementGroup, dfdElement));

    elementGroup.on("dragmove", GeneralUtil.throttle(() => this.handleDFDElementDragMove(dfdElement, elementGroup), 10));

    elementGroup.on("dragend", () => this.handleDFDElementDragEnd(dfdElement, elementGroup));

    elementGroup.on("mouseenter", () => this.handleDFDElementMouseEnterAndLeaveHighlighting(dfdElement, elementGroup, true));

    elementGroup.on("mouseleave", () => this.handleDFDElementMouseEnterAndLeaveHighlighting(dfdElement, elementGroup, false));

    elementGroup.on("click", (e) => e.evt.button === 0 ?
      this.handleNormalDFDElementClick(dfdElement) : this.handleDFDElementContextMenu(dfdElement));
  }

  private handleDFDElementMouseEnterAndLeaveHighlighting(dfdElement: DFDElementType,
                                                         elementGroup: Konva.Group,
                                                         enter: boolean) {
    if (enter) {
      elementGroup.moveToTop();
      KonvaGeneralUtil.setPointerCursorOnStage(this.drawingStage);
    } else {
      KonvaGeneralUtil.setDefaultCursorOnStage(this.drawingStage);
    }
    if (!dfdElement.selected) {
      this.updateElementHighlighting(dfdElement.genericType, elementGroup, enter);
    }
  }

  private handleDFDElementContextMenu(dfdElement: DFDElementType) {
    if (!this.dataFlowBeingDrawn && this.showDesignView) {
      this.openElementOptions(dfdElement);
    }
  }

  private updateElementHighlighting(elementType: GenericElementType,
                                    elementGroup: Konva.Group,
                                    highlight: boolean) {
    KonvaAdjustmentUtil.adjustElementHighlighting(elementGroup, elementType, highlight);
    this.dfdElementsLayer.batchDraw();
  }

  private openElementOptions(elementToBeEdited: DFDElementType | DataFlow) {
    this.store.dispatch(new InitOptionsViewAction(elementToBeEdited));
  }

  private handleDFDElementDragStart(elementGroup: Konva.Group, dfdElement: DFDElementType) {
    this.addDragLayer();
    KonvaGeneralUtil.addGroupToLayerAndMoveLayerToTop(this.dragLayer, elementGroup);
    KonvaGeneralUtil.setGrabbingCursorOnStage(this.drawingStage);
    this.setElementDraggingMetaData(dfdElement.coordinates, dfdElement.id);
    KonvaGeneralUtil.deleteElementFromLayer(this.dfdElementsLayer, dfdElement.id);
    this.store.dispatch(new DraggingElementAction());
    this.store.dispatch(new ToggleStageDraggability());
  }

  private handleDFDElementDragMove(dfdElement: DFDElementType, elementGroup: Konva.Group<Konva.Node>) {
    dfdElement.coordinates = KonvaAdjustmentUtil.getUpdatedShapePosition(elementGroup, this.initialPositionOfElementBeforeDrag);
    this.handleDFDElementUpdateWhenConnectedToDataFlow(dfdElement);
    this.handleDFDElementTrashcanHover(dfdElement);
  }

  private handleDFDElementUpdateWhenConnectedToDataFlow(dfdElement: DFDElementType) {
    // To reduce the amount of actions called, we only update the element on dragmove when it's connected to a dataflow
    // Otherwise it's enough to update once it gets dropped
    if (dfdElement.connectedToDataFlow) {
      this.store.dispatch(new UpdateDFDElementOnDragAction(dfdElement));
    }
  }

  private handleDFDElementTrashcanHover(dfdElement: DFDElementType) {
    const elementIsHoveringCloseToTrashcan: boolean = KonvaCheckUtil
      .draggedDFDElementIsHoveringCloseToTrashcan(dfdElement.coordinates, this.stageZoom, true, 0);
    if (elementIsHoveringCloseToTrashcan && !this.elementIsAlreadyHoveringOnTrashcan) {
      this.elementIsAlreadyHoveringOnTrashcan = true;
      this.store.dispatch(new HoveringOnTrashAction(true));
      KonvaAdjustmentUtil.handleTrashcanHoverElementHighlight(dfdElement, this.dragLayer, this.elementIsAlreadyHoveringOnTrashcan);
    } else if (!elementIsHoveringCloseToTrashcan && this.elementIsAlreadyHoveringOnTrashcan) {
      this.elementIsAlreadyHoveringOnTrashcan = false;
      this.store.dispatch(new HoveringOnTrashAction(false));
      KonvaAdjustmentUtil.handleTrashcanHoverElementHighlight(dfdElement, this.dragLayer, this.elementIsAlreadyHoveringOnTrashcan);
    }
  }

  private handleDFDElementDragEnd(dfdElement: DFDElementType, elementGroup: Konva.Group) {
    this.resetElementDrag();
    this.updateElementPosition(dfdElement, elementGroup);
    this.handleDropOnTrashcan(dfdElement);
  }

  private setElementDraggingMetaData(elementCoordinates: PointCoordinates, elementID: string) {
    this.initialPositionOfElementBeforeDrag = elementCoordinates;
    this.idOfCurrentlyDraggedElement = elementID;
  }


  private handleNormalDFDElementClick(dfdElement: DFDElementType) {
    this.selectElementsDependingOnCTRLPress(dfdElement);
    this.handleDataFlowDrawing(dfdElement);
  }

  private selectElementsDependingOnCTRLPress(dfdElement: DFDElementType) {
    if ((this.selectedElements.length && !this.ctrlPressed) || !this.showDesignView) {
      this.selectedElements = [];
      this.store.dispatch(new UnselectAllDFDElementsAction());
    }
    this.selectedElements.push(dfdElement.id);
    this.store.dispatch(new SelectElementAction({...dfdElement, selected: !dfdElement.selected}));
  }

  private handleDataFlowDrawing(dfdElement: DFDElementType) {
    if (this.dataFlowBeingDrawn) {
      this.dataFlowService.addElementToDataFlowSelectionProcess(dfdElement);
      this.tempDataFlowStartElement = dfdElement;
      if (this.dataFlowWasAddedDuringLastIteration) {
        this.store.dispatch(new UnselectAllDFDElementsAction());
      }
    }
  }

  private handleTrustBoundaryDeletion() {
    if (this.trustBoundaries.length) {
      this.trustBoundaryService.deleteSelectedBoundaries();
    }
  }

  private createTemporaryElementOverlayingTempDataFlow() {
    this.tempDataFlowStartElement.selected = true;
    KonvaGeneralUtil.deleteElementFromLayer(this.dfdElementsLayer, this.tempDataFlowStartElement.id);
    this.createElementGroup(this.tempDataFlowStartElement);
  }

  private addDragLayer() {
    this.dragLayer = KonvaGeneralUtil.createLayerAndPlaceItOnStage(this.drawingStage);
    this.dragLayer.moveToBottom();
  }

  private getElementGroupImage(genericType: GenericElementType) {
    return {
      [GenericElementType.INTERACTOR]: this.interactorImage,
      [GenericElementType.PROCESS]: this.processImage,
      [GenericElementType.DATASTORE]: this.dataStoreImage,
    } [genericType];
  }

  private resetElementDrag() {
    this.idOfCurrentlyDraggedElement = "";
    this.dragLayer.destroy();
    KonvaGeneralUtil.setDefaultCursorOnStage(this.drawingStage);
    this.store.dispatch(new DroppingElementAction());
    this.store.dispatch(new ToggleStageDraggability());
  }

  private updateElementPosition(dfdElement: DFDElementType, elementGroup: Konva.Group) {
    dfdElement.coordinates = KonvaAdjustmentUtil.getUpdatedShapePosition(elementGroup, this.initialPositionOfElementBeforeDrag);
    this.store.dispatch(new UpdateDFDElementAction(dfdElement));
  }

  private handleDropOnTrashcan(dfdElement: DFDElementType) {
    if (this.elementIsAlreadyHoveringOnTrashcan) {
      this.elementIsAlreadyHoveringOnTrashcan = false;
      this.store.dispatch(new ShowAlertAction({
          alertType: AlertType.DELETE_ELEMENT,
          elements: [ElementUtil.createGenericElement(dfdElement)]
        }
      ));
    }
  }

  private handleDFDElementsDeletion() {
    const genericElements: GenericElementData[] = [];
    this.dfdElements.forEach((element: DFDElementType) => {
      if (element.selected) {
        genericElements.push({id: element.id, type: element.genericType});
      }
    });
    if (genericElements.length) {
      this.store.dispatch(new ShowAlertAction({alertType: AlertType.DELETE_ELEMENT, elements: genericElements}));
    }
  }

  private clearDrawingLayerDependingOnElementsWhichNeedToBeRedrawn(redrawState: RedrawState) {
    if (redrawState.redrawAll) {
      // If all elements need to be redrawn, we can clear the layer completely
      KonvaGeneralUtil.clearLayer(this.dfdElementsLayer);
    } else {
      // If not, we only remove the elements which are being redrawn
      KonvaGeneralUtil.destroySpecificElementsOnlayer(redrawState.elementsToBeRedrawn, this.dfdElementsLayer);
    }
  }
}
