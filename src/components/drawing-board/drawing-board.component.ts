import {Component, HostListener, Input, OnDestroy, OnInit} from '@angular/core';
import * as Konva from 'konva';
import {State} from '../../store';
import {untilDestroyed} from "ngx-take-until-destroy";
import {StoreService} from "../../services/store.service";
import {StageZoom, View} from "../../models/view-related/view.model";
import {Store} from "@ngrx/store";
import {ResetZoomAction, ResetZoomCompleteAction, SetZoomLevelAction} from "../../store/actions/view-related/view.action";
import {ViewUtil} from "../../utils/view.util";
import {ZoomConfig} from "../../config/zoom.config";
import {UnselectAllDFDElementsAction} from "../../store/actions/modelling-related/dfd-element.action";
import {KonvaGeneralUtil} from "../../utils/konva/konva-general.util";
import {DfdElementsService} from "../../services/modelling-related/dfd-elements.service";
import {DataFlow, DataFlowVectorMetaData} from "../../models/modelling-related/dataflow.model";
import {TrashcanState} from "../../store/reducer/general-interaction-related/trashcan.reducer";
import {RedrawState} from "../../store/reducer/view-related/redraw.reducer";
import {KonvaAnimationUtil} from "../../utils/konva/konva-animation.util";
import {Images} from "../../models/view-related/image.model";
import {DFDElementType} from "../../models/types/types.model";
import {TrustBoundary} from "../../models/modelling-related/trust-boundary.model";

@Component({
  selector: 'app-drawing-board',
  templateUrl: './drawing-board.component.html',
  styleUrls: ['./drawing-board.component.scss']
})
export class DrawingBoardComponent implements OnInit, OnDestroy {
  stageZoomFactor: number;
  showingDesignView = true;
  private drawingStage: Konva.Stage;
  private freeDrawingStage: Konva.Stage;
  private trashCanLayer: Konva.Layer;
  private enableZooming: boolean;
  private allImages: Images;
  private draggingElement: boolean;

  constructor(private storeService: StoreService,
              private store: Store<State>,
              private drawingService: DfdElementsService) {
  }

  @Input()
  set stage(drawingStage: Konva.Stage) {
    this.drawingStage = drawingStage;
  }

  @Input()
  set freeDrawStage(freeDrawStage: Konva.Stage) {
    this.freeDrawingStage = freeDrawStage;
  }

  @Input()
  set images(images: Images) {
    this.allImages = images;
  }

  @HostListener('window:keydown', ['$event'])
  onKeyPress(event: KeyboardEvent) {
    if (event.key === "Escape") {
      this.resetZoom();
    } else if (event.key === "Control") {
      this.drawingService.updateCtrlPressed(true);
    } else if (event.key === "Delete" && this.showingDesignView) {
      // Deleting should only be available in the design view
      this.drawingService.deleteSelectedElementsOnDeleteKeyPress();
    }
  }

  @HostListener('window:keyup', ['$event'])
  onKeyRelease(event: KeyboardEvent) {
    if (event.key === "Control") {
      this.drawingService.updateCtrlPressed(false);
    }
  }

  ngOnInit() {
    this.initDrawingService();
    this.setDrawingStageListener();
    this.addTrashCanLayer();
    this.subscribeToZoomingEnabledState();
    this.subscribeToZoomReset();
    this.subscribeToZoomState();
    this.subscribeToStageDraggableState();
    this.subscribeToTrashCanState();
  }

  initDrawingService() {
    const drawingLayer: Konva.Layer = KonvaGeneralUtil.createLayerAndPlaceItOnStage(this.drawingStage);
    this.drawingService.init(this.drawingStage, this.freeDrawingStage, drawingLayer, this.allImages.elementImages);
    // Some subscriptions can only be started after all elements got set in the services.
    // E.g. redraw subscriptions can only be initialized when the drawing services know about the drawing layer.
    this.initializeSubscriptionsDependentOnDrawingServiceBeingInitialized();
  }

  ngOnDestroy() {
    this.drawingStage.off("click");
    this.drawingStage.off("wheel");
    this.drawingStage.off("dragstart");
    this.drawingStage.off("dragend");
    this.drawingService.handleDrawingBoardDestruction();
  }

  zoomIn() {
    this.handleZoom(true, ZoomConfig.SCALE_FACTOR * 2);
  }

  zoomOut() {
    this.handleZoom(false, ZoomConfig.SCALE_FACTOR * 2);
  }

  getZoomLevelWithouthSymbol() {
    return this.stageZoomFactor > 0 ? this.stageZoomFactor : -this.stageZoomFactor;
  }

  resetZoomLevel() {
    this.store.dispatch(new ResetZoomAction());
  }

  private initializeSubscriptionsDependentOnDrawingServiceBeingInitialized() {
    this.subscribeToViewState();
    this.subscribeDFDElements();
    this.subscribeToDataFlows();
    this.subscribeToTrustBoundaries();
    this.subscribeToDataFlowDrawingEnabledState();
    this.subscribeToTrustBoundaryDrawingEnabledState();
    this.subscribeToAndDrawTempDataFlows();
    this.subscribeToRedrawState();
  }


  private handleZoom(zoomIn: boolean, scaleFactor: number) {
    if (this.enableZooming) {
      const zoomData: StageZoom = ViewUtil
        .getZoomData(zoomIn, scaleFactor, this.drawingStage.position(), this.drawingStage.scaleX());
      if (ViewUtil.scaleIsWithinScaleLimits(zoomData.scale)) {
        ViewUtil.applyZoomToDrawingStage(this.drawingStage, zoomData);
        this.store.dispatch(new SetZoomLevelAction(zoomData));
      }
    }
  }

  private resetZoom() {
    ViewUtil.resetZoomOnDrawingStage(this.drawingStage);
    this.store.dispatch(new ResetZoomCompleteAction());
  }

  private setStageZoom(stageZoom: StageZoom) {
    this.stageZoomFactor = ViewUtil.convertScaleIntoPercentage(stageZoom.scale);
    this.drawingService.stageZoomUpdated(stageZoom);
  }

  private setView(shownView: View) {
    if (shownView === View.DESIGN) {
      this.setDesignView();
    } else if (shownView === View.ANALYSIS) {
      this.setAnalysisView();
    }
  }

  private setDesignView() {
    this.showingDesignView = true;
  }

  private setAnalysisView() {
    this.showingDesignView = false;
  }

  private setDrawingStageListener() {

    this.drawingStage.on("wheel", (evt) => this.handleZoom(evt.evt.deltaY < 0, ZoomConfig.SCALE_FACTOR));

    this.drawingStage.on("click", (evt) => {
      if (KonvaGeneralUtil.mouseTargetIsNotAnElement(evt)) {
        this.store.dispatch(new UnselectAllDFDElementsAction());
      }
    });
    this.drawingStage.on("dragstart", () => {
      if (!this.draggingElement) {
        this.drawingStage.container().style.cursor = "move";
      }
    });
    this.drawingStage.on("dragend", () => {
      this.drawingStage.container().style.cursor = "default";
      this.store.dispatch(new SetZoomLevelAction(ViewUtil.getStageZoom(this.drawingStage.scale().x, this.drawingStage.position())));
    });
  }

  private subscribeToZoomingEnabledState() {
    this.storeService.selectZoomingActiveState()
      .pipe(untilDestroyed(this))
      .subscribe((zoomEnabled: boolean) => this.enableZooming = zoomEnabled);
  }

  private subscribeToZoomReset() {
    this.storeService.selectZoomResetState()
      .pipe(untilDestroyed(this))
      .subscribe((needsReset: boolean) => {
        if (needsReset) {
          this.resetZoom();
        }
      });
  }

  private subscribeToZoomState() {
    this.storeService.selectStageZoom()
      .pipe(untilDestroyed(this))
      .subscribe((zoom: StageZoom) => this.setStageZoom(zoom));
  }

  private subscribeToStageDraggableState() {
    this.storeService.selectStageDraggableState()
      .pipe(untilDestroyed(this))
      .subscribe((draggable: boolean) => this.drawingStage.draggable(draggable));
  }

  private subscribeToViewState() {
    this.storeService.selectCurrentViewState()
      .pipe(untilDestroyed(this))
      .subscribe((shownView: View) => {
        this.setView(shownView);
        this.drawingService.shownViewUpdated(shownView === View.DESIGN);
      });
  }

  private subscribeDFDElements() {
    this.storeService.selectDFDElements()
      .pipe(untilDestroyed(this))
      .subscribe((dfdElementState: DFDElementType[]) => this.drawingService.dfdElementStateUpdated(dfdElementState));
  }

  private subscribeToDataFlows() {
    this.storeService.selectDataFlows()
      .pipe(untilDestroyed(this))
      .subscribe((dataFlows: DataFlow[]) => this.drawingService.dataFlowsUpdated(dataFlows));
  }

  private subscribeToTrustBoundaries() {
    this.storeService.selectTrustBoundaryState()
      .pipe(untilDestroyed(this))
      .subscribe((trustBoundaries: TrustBoundary[]) => this.drawingService.trustBoundariesUpdated(trustBoundaries));
  }

  private subscribeToTrustBoundaryDrawingEnabledState() {
    this.storeService.selectTrustBoundaryDrawingEnabledState()
      .pipe(untilDestroyed(this))
      .subscribe((trustBoundaryDrawingState: boolean) => this.drawingService.trustBoundaryDrawingStateUpdated(trustBoundaryDrawingState));
  }

  private subscribeToDataFlowDrawingEnabledState() {
    this.storeService.selectDataFlowDrawingEnabledState()
      .pipe(untilDestroyed(this))
      .subscribe((dataFlowBeingDrawn: boolean) => this.drawingService.dataFlowDrawingStateUpdated(dataFlowBeingDrawn));
  }

  private subscribeToRedrawState() {
    this.storeService.selectRedrawState()
      .pipe(untilDestroyed(this))
      .subscribe((redrawState: RedrawState) => this.drawingService.redraw(redrawState));
  }

  private subscribeToAndDrawTempDataFlows() {
    this.storeService.selectTempDataFlow()
      .pipe(untilDestroyed(this))
      .subscribe((dataFlowVectorMetaData: DataFlowVectorMetaData) => {
        if (dataFlowVectorMetaData) {
          this.drawingService.temporaryDataFlowUpdated(dataFlowVectorMetaData);
        }
      });
  }

  private subscribeToTrashCanState() {
    this.storeService.selectTrashCanState()
      .pipe(untilDestroyed(this))
      .subscribe((trashcanState: TrashcanState) => {
        this.draggingElement = trashcanState.draggingElement;
        this.displayTrashCanWhenElementIsBeingDragged(trashcanState);
      });
  }

  private addTrashCanLayer() {
    this.trashCanLayer = KonvaGeneralUtil.createLayerAndPlaceItOnStage(this.freeDrawingStage);
  }

  private displayTrashCanWhenElementIsBeingDragged(trashcanState: TrashcanState) {
    KonvaGeneralUtil.clearLayer(this.trashCanLayer);
    if (trashcanState.draggingElement) {
      let trashcanGroup: Konva.Group = new Konva.Group();
      if (!trashcanState.hoveringOnTrash) {
        trashcanGroup = KonvaGeneralUtil.createTrashCanGroup(this.allImages.deleteImages.deleteImage);
      } else {
        trashcanGroup = KonvaGeneralUtil.createTrashCanGroup(this.allImages.deleteImages.deleteHoverImage);
      }
      KonvaGeneralUtil.addGroupToLayerAndDraw(this.trashCanLayer, trashcanGroup);
      KonvaAnimationUtil.playTrashCanTween(trashcanGroup, trashcanState.hoveringOnTrash);
    }
  }
}
