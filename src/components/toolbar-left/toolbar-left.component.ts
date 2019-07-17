import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import * as Konva from 'konva';
import {State} from '../../store';
import {Store} from '@ngrx/store';
import {PointCoordinates} from '../../models/view-related/coordinates.model';
import {ShapeConfig} from '../../config/shape.config';
import {GenericElementType} from "../../models/modelling-related/base.model";
import {KonvaGeneralUtil} from "../../utils/konva/konva-general.util";
import {KonvaAdjustmentUtil} from "../../utils/konva/konva-adjustment.util";
import {StoreService} from "../../services/store.service";
import {untilDestroyed} from "ngx-take-until-destroy";
import {StageZoom} from "../../models/view-related/view.model";
import {ViewUtil} from "../../utils/view.util";
import {DraggingElementAction, DroppingElementAction, HoveringOnTrashAction} from "../../store/actions/general-interaction-related/trashcan.action";
import {KonvaCheckUtil} from "../../utils/konva/konva-check.util";
import {ToggleTrustBoundaryDrawingAction, ToogleDataFlowDrawingAction} from "../../store/actions/general-interaction-related/toolbar.action";
import {AddDFDElementAction} from "../../store/actions/modelling-related/element-add.action";
import {AddModalAction} from "../../store/actions/view-related/modal.action";
import {ModalConfig} from "../../config/modal.config";

@Component({
  selector: 'app-toolbar-left',
  templateUrl: './toolbar-left.component.html',
  styleUrls: ['./toolbar-left.component.scss']
})
export class ToolbarLeftComponent implements OnInit, OnDestroy {
  @ViewChild('dragDropStageContainer') dragDropStageContainer: ElementRef;
  drawingDataflow: boolean;
  drawingTrustBoundary: boolean;
  moveDrawingStageToTopOfView: boolean;
  private dragDropStage: Konva.Stage;
  private dragDropLayer: Konva.Layer<Konva.Node>;
  private lastElementSelected: GenericElementType;
  private stageZoom: StageZoom;
  private interactorImage: HTMLImageElement;
  private processImage: HTMLImageElement;
  private dataStoreImage: HTMLImageElement;
  private elementIsAlreadyHoveringOnTrashcan: boolean;

  constructor(private store: Store<State>, private storeService: StoreService) {
  }

  ngOnInit() {
    this.subscribeToStageZoom();
    this.loadImages();
  }

  ngOnDestroy() {
  }

  drawDragElement(buttonTypePressed: string) {
    this.createDragDropStageWithListener();
    this.setElementDragDropLayer();
    this.setLastSelectedElement(buttonTypePressed);
    this.disableDataFlowDrawingIfActive();
    this.disableBoundaryDrawingIfACtive();
    this.drawRespectiveElementOnMousePosition();
    this.store.dispatch(new DraggingElementAction());
  }

  toggleDataFlowDrawing() {
    if (this.drawingTrustBoundary) {
      this.toggleBoundaryDrawing();
    }
    this.drawingDataflow = !this.drawingDataflow;
    this.store.dispatch(new ToogleDataFlowDrawingAction());
  }


  toggleBoundaryDrawing() {
    if (this.drawingDataflow) {
      this.toggleDataFlowDrawing();
    }
    this.drawingTrustBoundary = !this.drawingTrustBoundary;
    this.store.dispatch(new ToggleTrustBoundaryDrawingAction());
  }

  openFeedback() {
    this.store.dispatch(new AddModalAction(ModalConfig.FEEDBACK_MODAL));
  }

  private setElementDragDropLayer() {
    this.dragDropLayer = KonvaGeneralUtil.createLayerAndPlaceItOnStage(this.dragDropStage);
  }

  private createDragDropStageWithListener() {
    // This is the Stage where the drag & drop of elements is handled
    // The actual elements are then placed in another stage laying below this one
    this.dragDropStage = KonvaGeneralUtil.createStage(this.dragDropStageContainer, false);
    this.moveDrawingStageToTopOfView = true;
    KonvaGeneralUtil.setGrabbingCursorOnStage(this.dragDropStage);
  }

  private drawRespectiveElementOnMousePosition() {
    const offsetMultiplier: number = KonvaGeneralUtil.getElementsToolbarOffsetMultiplier(this.lastElementSelected);
    const dragDropElementGroup: Konva.Group = KonvaGeneralUtil
      .createDragDropElementGroup(this.lastElementSelected, this.getElementGroupImage(this.lastElementSelected), offsetMultiplier);
    KonvaGeneralUtil.addGroupToLayerAndDraw(this.dragDropLayer, dragDropElementGroup);
    this.addDragDropListener(dragDropElementGroup, offsetMultiplier);
  }

  private addDragDropListener(dragDropElementGroup: Konva.Group, offsetMultiplier: number) {
    dragDropElementGroup.on("mouseenter", () => dragDropElementGroup.startDrag());
    dragDropElementGroup.on("dragmove", () => this.handleDragDropElementTrashCanHover(dragDropElementGroup, offsetMultiplier));
    dragDropElementGroup.on('mouseup', () => this.dropElement());
  }

  private handleDragDropElementTrashCanHover(group: Konva.Group, offsetMultiplier: number) {
    // TODO: This is also used in dfd-elements.service. Thing about extracting.
    const elementIsHoveringCloseToTrashcan: boolean = KonvaCheckUtil
      .draggedDFDElementIsHoveringCloseToTrashcan(group.position(), this.stageZoom, false, offsetMultiplier);
    if (elementIsHoveringCloseToTrashcan && !this.elementIsAlreadyHoveringOnTrashcan) {
      this.elementIsAlreadyHoveringOnTrashcan = true;
      this.store.dispatch(new HoveringOnTrashAction(true));
      KonvaAdjustmentUtil
        .handleTrashcanHoverDragDropelementHighlight(group, this.lastElementSelected, this.elementIsAlreadyHoveringOnTrashcan);
    } else if (!elementIsHoveringCloseToTrashcan && this.elementIsAlreadyHoveringOnTrashcan) {
      this.elementIsAlreadyHoveringOnTrashcan = false;
      this.store.dispatch(new HoveringOnTrashAction(false));
      KonvaAdjustmentUtil
        .handleTrashcanHoverDragDropelementHighlight(group, this.lastElementSelected, this.elementIsAlreadyHoveringOnTrashcan);
    }
  }

  private createNewShape(currentPosition: PointCoordinates) {
    const scaledPosition: PointCoordinates = ViewUtil.applyOffsetToCoordinatesDependingOnZoom(currentPosition, this.stageZoom);
    this.store.dispatch(new AddDFDElementAction({coordinates: scaledPosition, type: this.lastElementSelected}));
  }

  private disableDataFlowDrawingIfActive() {
    if (this.drawingDataflow) {
      this.toggleDataFlowDrawing();
    }
  }

  private disableBoundaryDrawingIfACtive() {
    if (this.drawingTrustBoundary) {
      this.toggleBoundaryDrawing();
    }
  }

  private getCoordinatesOfCurrentPositionAdjustingForToolbarWidth(): PointCoordinates {
    return {
      x: this.dragDropStage.getPointerPosition().x - ShapeConfig.GET_LEFT_TOOLBAR_WIDTH(),
      y: this.dragDropStage.getPointerPosition().y
    };
  }

  private subscribeToStageZoom() {
    // We need this so when elements are dropped, they are placed at the "correct" position
    this.storeService.selectStageZoom()
      .pipe(untilDestroyed(this))
      .subscribe((stageZoom: StageZoom) => this.stageZoom = stageZoom);
  }

  private dropElement() {
    this.dragDropStage.container().style.cursor = "default";
    if (!KonvaAdjustmentUtil.cursorIsStillInToolbar(this.dragDropStage.getPointerPosition().x)
      && !this.elementIsAlreadyHoveringOnTrashcan) {
      const currentPosition: PointCoordinates = this.getCoordinatesOfCurrentPositionAdjustingForToolbarWidth();
      this.createNewShape(currentPosition);
    }
    this.dragDropStage.destroy();
    this.moveDrawingStageToTopOfView = false;
    this.store.dispatch(new DroppingElementAction());
  }

  private loadImages() {
    // TODO: Load all element images in the landing page and pass them.
    this.interactorImage = new Image();
    this.processImage = new Image();
    this.dataStoreImage = new Image();
    this.interactorImage.src = '../assets/interactor-normal.png';
    this.processImage.src = '../assets/process-normal.png';
    this.dataStoreImage.src = '../assets/datastore-normal.png';
  }

  private getElementGroupImage(genericType: GenericElementType) {
    return {
      [GenericElementType.INTERACTOR]: this.interactorImage,
      [GenericElementType.PROCESS]: this.processImage,
      [GenericElementType.DATASTORE]: this.dataStoreImage,
    } [genericType];
  }

  private setLastSelectedElement(elementToBeDrawn: string) {
    if (elementToBeDrawn === "interactor") {
      this.lastElementSelected = GenericElementType.INTERACTOR;
    } else if (elementToBeDrawn === "process") {
      this.lastElementSelected = GenericElementType.PROCESS;
    } else if (elementToBeDrawn === "datastore") {
      this.lastElementSelected = GenericElementType.DATASTORE;
    }
  }
}
