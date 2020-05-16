import {Injectable} from '@angular/core';
import {PointCoordinates} from "../../models/view-related/coordinates.model";
import * as Konva from "konva";
import {KonvaElementsUtil} from "../../utils/konva/konva-elements.util";
import {GeometryUtil} from "../../utils/geometry.util";
import {ElementUtil} from "../../utils/element.util";
import {Store} from "@ngrx/store";
import {State} from "../../store";
import {TrustBoundary} from "../../models/modelling-related/trust-boundary.model";
import {KonvaGeneralUtil} from "../../utils/konva/konva-general.util";
import {CopyUtils} from "../../utils/copy.util";
import {StageZoom} from "../../models/view-related/view.model";
import {OptionUtil} from "../../utils/option.util";
import {ViewUtil} from "../../utils/view.util";
import {BoundaryUtil} from "../../utils/boundary.util";
import {RedrawCompleteAction} from "../../store/actions/view-related/redraw.action";
import {RedrawState} from "../../store/reducer/view-related/redraw.reducer";
import {DraggingElementAction, DroppingElementAction, HoveringOnTrashAction} from "../../store/actions/general-interaction-related/trashcan.action";
import {DFDElementType} from "../../models/types/types.model";
import {KonvaCheckUtil} from "../../utils/konva/konva-check.util";
import {KonvaAdjustmentUtil} from "../../utils/konva/konva-adjustment.util";
import {ShowAlertAction} from "../../store/actions/general-interaction-related/alert.action";
import {AlertType} from "../../models/alert.model";
import {DeleteTrustBoundaryAction} from "../../store/actions/modelling-related/element-delete.action";
import {UpdateTrustBoundaryAction} from "../../store/actions/modelling-related/element-update.action";
import {SelectElementAction} from "../../store/actions/modelling-related/dfd-element.action";
import {AddTrustBoundaryAction} from "../../store/actions/modelling-related/element-add.action";
import {InitOptionsViewAction} from "../../store/actions/modelling-related/element-options.action";
import {DFDElementState} from "../../store/reducer/modelling-related/dfd-element.reducer";

@Injectable({
  providedIn: 'root'
})
export class TrustBoundaryService {

  constructor(private store: Store<State>) {
  }

  private drawingLayer: Konva.Layer;
  private drawingStage: Konva.Stage;
  private freeDrawingStage: Konva.Stage;
  private freeDrawLayer: Konva.Layer<Konva.Node>;

  private showDesignView: boolean;
  private trustBoundaryDrawingEnabled: boolean;
  private IDOfBoundaryWithTransformer: string;

  private stageZoom: StageZoom;

  private dfdElements: (DFDElementType)[];
  private lastElementsCollectedByBoundary: (DFDElementType)[] = [];
  private boundaryIsAlreadyHoveringOnTrashCan: boolean;

  init(drawingStage: Konva.Stage, drawingLayer: Konva.Layer, freeDrawingStage: Konva.Stage) {
    // For the actual boundaries
    this.drawingLayer = drawingLayer;
    this.drawingStage = drawingStage;

    // For drawing boundaries. If the boundary would be drawn on the default stage/layer, a scaled stage would limit the working area.
    this.freeDrawingStage = freeDrawingStage;
    this.freeDrawLayer = KonvaGeneralUtil.createLayerAndPlaceItOnStage(this.freeDrawingStage);

    this.setStageListener();
  }

  setStageListener() {
    let startPos: PointCoordinates;
    let currentPos: PointCoordinates;
    let endPos: PointCoordinates;
    let clicked = false;
    let rect: Konva.Rect;

    this.drawingStage.on("click", (evt) => {
      if (!evt.target.hasName("boundary")) {
        this.resetBoundaryView();
      }
    });

    this.drawingStage.on("mousedown", () => {
      if (this.trustBoundaryDrawingEnabled) {
        startPos = this.drawingStage.getPointerPosition();
        clicked = true;
      }
    });

    this.drawingStage.on("mousemove", () => {
      if (clicked && this.trustBoundaryDrawingEnabled) {
        currentPos = this.drawingStage.getPointerPosition();
        if (rect) {
          rect.remove();
        }
        rect = KonvaElementsUtil.createTemporaryTrustBoundaryShape(startPos, currentPos);
        this.highlightElementsContainedInTrustBoundary(startPos, currentPos);
        this.freeDrawLayer.add(rect);
        this.freeDrawLayer.batchDraw();
      }
    });

    this.drawingStage.on("mouseup", () => {
      if (this.trustBoundaryDrawingEnabled) {
        clicked = false;
        this.freeDrawLayer.destroyChildren();
        this.freeDrawLayer.batchDraw();
        if (GeometryUtil.twoPointsAreNotTheSame(startPos, this.drawingStage.getPointerPosition())
          && BoundaryUtil.boundaryIsBigEnough(startPos, this.drawingStage.getPointerPosition(), this.stageZoom.scale)) {
          endPos = this.drawingStage.getPointerPosition();
          this.addTrustBoundary(startPos, currentPos);
        }
      }
    });
  }

  removeStageListener() {
    this.drawingStage.off("click");
    this.drawingStage.off("mousedown");
    this.drawingStage.off("mousemove");
    this.drawingStage.off("mouseup");
  }

  drawTrustBoundaries(trustBoundaries: TrustBoundary[], redrawState: RedrawState) {
    trustBoundaries.forEach((trustBoundary: TrustBoundary) => {
      if (redrawState.redrawAll) {
        this.createTrustBoundaryGroup(CopyUtils.copyTrustBoundary(trustBoundary));
      } else if (KonvaGeneralUtil.elementNeedsToBeRedrawn(trustBoundary.id, redrawState.elementsToBeRedrawn)) {
        this.createTrustBoundaryGroup(CopyUtils.copyTrustBoundary(trustBoundary));
        this.store.dispatch(new RedrawCompleteAction(trustBoundary.id));
      }
    });
  }

  deleteSelectedBoundaries() {
    if (this.IDOfBoundaryWithTransformer) {
      this.store.dispatch(new DeleteTrustBoundaryAction(this.IDOfBoundaryWithTransformer));
    }
  }

  setDFDElements(dfdElements: (DFDElementType)[]) {
    this.dfdElements = dfdElements;
  }

  setShownDesignView(shownDesignView: boolean) {
    this.showDesignView = shownDesignView;
    if (!this.showDesignView) {
      this.resetBoundaryView();
    }
  }

  setStageZoom(stageZoom: StageZoom) {
    this.stageZoom = stageZoom;
  }

  trustBoundaryDrawingStateWasUpdated(trustBoundaryDrawingEnabled: boolean) {
    this.trustBoundaryDrawingEnabled = trustBoundaryDrawingEnabled;
    if (trustBoundaryDrawingEnabled && this.IDOfBoundaryWithTransformer) {
      this.resetBoundaryView();
    }
  }

  private setTrustBoundaryListener(trustBoundaryGroup: Konva.Group,
                                   trustBoundary: TrustBoundary,
                                   trustBoundaryShape: Konva.Rect) {

    let transformer: Konva.Transformer;
    let startPos;

    //  This needs to be here, because we need the reference
    if (this.IDOfBoundaryWithTransformer === trustBoundary.id && !this.trustBoundaryDrawingEnabled) {
      transformer = this.addTransformerToBoundary(trustBoundaryGroup, trustBoundaryShape);
    }

    trustBoundaryShape.on('transformend', () => {
      trustBoundary = this.updateBoundaryAfterTransform(trustBoundary, trustBoundaryShape);
      this.store.dispatch(new UpdateTrustBoundaryAction(trustBoundary));
    });

    trustBoundaryGroup.on('click', (e) => {
      if (e.evt.button === 0 && this.showDesignView) {
        // If an element already is being transformed, create a new one
        if (this.IDOfBoundaryWithTransformer !== trustBoundary.id && !this.trustBoundaryDrawingEnabled) {
          // 0. Destroy all existing Transformers
          this.destroyExistingTransformers();
          // 1. Create transformer and attach it to the Shape
          transformer = this.addTransformerToBoundary(trustBoundaryGroup, trustBoundaryShape);
          // 2. Remember which transformer is currently being transformed
          this.IDOfBoundaryWithTransformer = trustBoundary.id;
        }
      } else if (!this.trustBoundaryDrawingEnabled && this.showDesignView) {
        this.openTrustBoundaryOptions(trustBoundary);
      }
    });

    trustBoundaryGroup.on('dragstart', () => {
      startPos = this.drawingStage.getPointerPosition();
      this.store.dispatch(new DraggingElementAction());
      this.drawingStage.container().style.cursor = "grabbing";
      // If the shape currently has a transformer set, remove it
      if (this.IDOfBoundaryWithTransformer === trustBoundary.id) {
        transformer.detach();
      }
    });

    trustBoundaryGroup.on('dragmove', () => this.handleTrustBoundaryTrashCanHover(trustBoundaryGroup));

    trustBoundaryGroup.on('dragend', () => {
      this.store.dispatch(new DroppingElementAction());
      // If currently a transformer is applied to the shape, we can destroy it
      // Because after the update, the group is going to be rebuilt
      if (this.IDOfBoundaryWithTransformer === trustBoundary.id) {
        this.destroyExistingTransformers();
      }
      this.handleDropOnTrashcan(trustBoundary);
      trustBoundary = this.updateBoundaryPositionAfterDrag(startPos, trustBoundary);
      this.drawingStage.container().style.cursor = "default";
      this.store.dispatch(new UpdateTrustBoundaryAction(trustBoundary));
    });
  }

  private handleTrustBoundaryTrashCanHover(trustBoundaryGroup: Konva.Group) {
    // TODO: Similar to the implementation in the DFDElements Service, Refactor
    const boundaryIsHoveringCloseToTrashcan: boolean = KonvaCheckUtil
      .draggedDFDElementIsHoveringCloseToTrashcan(this.drawingStage.getPointerPosition(), this.stageZoom, true, 0);
    if (boundaryIsHoveringCloseToTrashcan && !this.boundaryIsAlreadyHoveringOnTrashCan) {
      this.boundaryIsAlreadyHoveringOnTrashCan = true;
      this.store.dispatch(new HoveringOnTrashAction(true));
      KonvaAdjustmentUtil.handleTrashcanHoverTrustBoundaryHighlight(trustBoundaryGroup, this.boundaryIsAlreadyHoveringOnTrashCan);
    } else if (!boundaryIsHoveringCloseToTrashcan && this.boundaryIsAlreadyHoveringOnTrashCan) {
      this.boundaryIsAlreadyHoveringOnTrashCan = false;
      this.store.dispatch(new HoveringOnTrashAction(false));
      KonvaAdjustmentUtil.handleTrashcanHoverTrustBoundaryHighlight(trustBoundaryGroup, this.boundaryIsAlreadyHoveringOnTrashCan);
    }
  }

  private handleDropOnTrashcan(trustBoundary: TrustBoundary) {
    // TODO: Similar to the implementation in the DFDElements Service, Refactor
    if (this.boundaryIsAlreadyHoveringOnTrashCan) {
      this.boundaryIsAlreadyHoveringOnTrashCan = false;
      this.store.dispatch(new ShowAlertAction({
          alertType: AlertType.DELETE_ELEMENT,
          elements: [ElementUtil.createGenericElement(trustBoundary)]
        }
      ));
    }
  }

  private updateBoundaryAfterTransform(trustBoundary: TrustBoundary, trustBoundaryShape: Konva.Rect): TrustBoundary {
    trustBoundary.width = trustBoundary.width * trustBoundaryShape.scaleX();
    trustBoundary.height = trustBoundary.height * trustBoundaryShape.scaleY();
    trustBoundary.coordinates.x = trustBoundaryShape.x();
    trustBoundary.coordinates.y = trustBoundaryShape.y();
    return trustBoundary;
  }

  private updateBoundaryPositionAfterDrag(startPos: PointCoordinates, trustBoundary: TrustBoundary): TrustBoundary {
    const endPos = this.drawingStage.getPointerPosition();
    const vectorBetweenStartAndEnd: PointCoordinates = GeometryUtil.getVectorBetweenTwoPoints(startPos, endPos);
    // The stage scale must be taken into account
    const scaledVector: PointCoordinates = ViewUtil.applyScalingToPoint(vectorBetweenStartAndEnd, this.stageZoom.scale);
    trustBoundary.coordinates = GeometryUtil.movePointInDirectionOfVector(trustBoundary.coordinates, scaledVector);
    return trustBoundary;
  }

  private addTransformerToBoundary(trustBoundaryGroup: Konva.Group, trustBoundaryShape: Konva.Rect): Konva.Transformer {
    const transformer = KonvaElementsUtil.getTransformer(trustBoundaryGroup, this.drawingLayer);
    this.drawingLayer.add(transformer);
    transformer.attachTo(trustBoundaryShape);
    this.drawingLayer.batchDraw();
    return transformer;
  }

  private createTrustBoundaryGroup(trustBoundary: TrustBoundary) {
    const trustBoundaryGroup: Konva.Group = new Konva.Group({draggable: !this.trustBoundaryDrawingEnabled && this.showDesignView});
    const trustBoundaryRect: Konva.Rect = KonvaElementsUtil.createTrustBoundaryShape(trustBoundary);
    const trustBoundaryText: Konva.Text = KonvaElementsUtil.createTrustBoundaryText(trustBoundary);
    trustBoundaryGroup.add(trustBoundaryRect);
    trustBoundaryGroup.add(trustBoundaryText);
    trustBoundaryGroup.name(trustBoundary.id);
    this.setTrustBoundaryListener(trustBoundaryGroup, trustBoundary, trustBoundaryRect);
    KonvaGeneralUtil.addGroupToLayerAndDraw(this.drawingLayer, trustBoundaryGroup);
  }

  private openTrustBoundaryOptions(trusBoundaryToBeEdited: TrustBoundary) {
    this.store.dispatch(new InitOptionsViewAction(trusBoundaryToBeEdited));
  }

  private addTrustBoundary(startPos: PointCoordinates, currentPos: PointCoordinates) {
    // 1. Get the right coordinates. These are a mixture of the respective smallest point of the start- and end position.
    // We can't just take either one, because the actual boundary is always drawn from the top left.
    // -> A user can draw from the right to the left. When only taking the mouse placement into account, the boundary will be offset
    const boundaryCoordinates: PointCoordinates = GeometryUtil
      .createRectangleCoordinateFromTwoPoints(startPos, currentPos);
    // 2. Scale these coordinates. If a zoom is applied, the coordinates must be offset correctly.
    const scaledCoordinates: PointCoordinates = ViewUtil.applyOffsetToCoordinatesDependingOnZoom(boundaryCoordinates, this.stageZoom);
    // 3. Get the width and the height, and again apply the scaling.
    const width: number = GeometryUtil.getDistanceBetweenToCoordinatePoints(startPos.x, currentPos.x) / this.stageZoom.scale;
    const height: number = GeometryUtil.getDistanceBetweenToCoordinatePoints(startPos.y, currentPos.y) / this.stageZoom.scale;
    // 4. Add the actual boundary.
    this.store.dispatch(new AddTrustBoundaryAction({boundaryPosition: scaledCoordinates, width: width, height: height}));
    // 5. Reset the "collected" elements
    this.lastElementsCollectedByBoundary = [];
  }

  private destroyExistingTransformers() {
    this.drawingLayer.find('Transformer').each(transformer => transformer.destroy());
    this.drawingStage.batchDraw();
  }

  private highlightElementsContainedInTrustBoundary(startPos: PointCoordinates, endPos: PointCoordinates) {
    // Find and store elements within a boundary
    const dfdElementsWithinARectangle: (DFDElementType)[] = BoundaryUtil
      .findElementsWithinABoundary(this.dfdElements, startPos, endPos);
    let dfdElementsThatNeedSelectionUpdating: (DFDElementType)[] = [];
    // If nothing new was added, just do nothing
    if (!ElementUtil.twoArraysOfElementsContainTheSameElements(dfdElementsWithinARectangle, this.lastElementsCollectedByBoundary)) {
      // If the boundary now contains more elements, select the additional elements
      if (dfdElementsWithinARectangle.length > this.lastElementsCollectedByBoundary.length) {
        dfdElementsThatNeedSelectionUpdating = ElementUtil
          .findElementsInAnArrayWhichDontExistInAnotherArray(dfdElementsWithinARectangle, this.lastElementsCollectedByBoundary);
        this.handleElementSelection(dfdElementsThatNeedSelectionUpdating, true);
      } else {
        // If the boundary now contains less elements, deselect the elements not contained anymore
        dfdElementsThatNeedSelectionUpdating = ElementUtil
          .findElementsInAnArrayWhichDontExistInAnotherArray(this.lastElementsCollectedByBoundary, dfdElementsWithinARectangle);
        this.handleElementSelection(dfdElementsThatNeedSelectionUpdating, false);
      }
      this.lastElementsCollectedByBoundary = dfdElementsWithinARectangle;
    }
  }

  private handleElementSelection(dfdElementsToBeUpdated: (DFDElementType)[], select: boolean) {
    dfdElementsToBeUpdated.forEach((dfdElement: DFDElementType) =>
      this.store.dispatch(new SelectElementAction({...dfdElement, selected: select})));
  }

  private resetBoundaryView() {
    this.lastElementsCollectedByBoundary = [];
    this.IDOfBoundaryWithTransformer = "";
    this.destroyExistingTransformers();
  }


}
