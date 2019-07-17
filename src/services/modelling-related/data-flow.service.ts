import {Injectable} from '@angular/core';
import {State} from '../../store';
import {Store} from '@ngrx/store';
import {AddTempDataFlowAction, ResetTempDataFlowAction} from '../../store/actions/modelling-related/data-flow.action';
import {DataFlowUtil} from '../../utils/data-flow.util';
import {DataFlowConnectionInfo, GenericConnectedElement} from '../../models/modelling-related/base.model';
import * as Konva from 'konva';
import {KonvaGeneralUtil} from "../../utils/konva/konva-general.util";
import {Subject} from "rxjs";
import {DataFlow, DataFlowDrawingPosition, DataFlowVectorMetaData, VectorCoordinates} from "../../models/modelling-related/dataflow.model";
import {KonvaAdjustmentUtil} from "../../utils/konva/konva-adjustment.util";
import {StageZoom} from "../../models/view-related/view.model";
import {CopyUtils} from "../../utils/copy.util";
import {OptionUtil} from "../../utils/option.util";
import {ElementUtil} from "../../utils/element.util";
import {RedrawCompleteAction} from "../../store/actions/view-related/redraw.action";
import {RedrawState} from "../../store/reducer/view-related/redraw.reducer";
import {DFDElementType} from "../../models/types/types.model";
import {AddDataFlowAction} from "../../store/actions/modelling-related/element-add.action";
import {InitOptionsViewAction, OpenOptionsViewAction} from "../../store/actions/modelling-related/element-options.action";

@Injectable()
export class DataFlowService {

  private startElement: DFDElementType;
  private endElement: DFDElementType;
  private genericStartElement: GenericConnectedElement;
  private genericEndElement: GenericConnectedElement;

  private creatingDataFlow: boolean;
  private currentlyDrawing: boolean;
  private showDesignView: boolean;
  private stageZoom: StageZoom;

  private drawingStage: Konva.Stage;
  private drawingLayer: Konva.Layer<Konva.Node>;

  private destroyed$: Subject<void>;
  private dataFlowTip;

  constructor(private store: Store<State>) {
  }


  init(drawingStage: Konva.Stage, drawingLayer: Konva.Layer) {
    // For the actual dataflows
    this.drawingLayer = drawingLayer;
    this.drawingStage = drawingStage;

    this.destroyed$ = new Subject<void>();
    this.loadDataFlowTipImage();
    this.setDrawingStageListener();
  }

  setShownDesignView(shownDesignView: boolean) {
    this.showDesignView = shownDesignView;
  }

  setStageZoom(stageZoom: StageZoom) {
    this.stageZoom = stageZoom;
    // If we are currently drawing, we want to adjust the drawn line
    if (this.currentlyDrawing) {
      this.updateTemporaryDataFlow();
    }
  }

  drawDataFlows(dataFlows: DataFlow[], redrawState: RedrawState) {
    dataFlows.forEach((dataFlow: DataFlow) => {
      if (redrawState.redrawAll) {
        this.createDataFlowGroup(CopyUtils.copyDataFlow(dataFlow));
      } else if (KonvaGeneralUtil.elementNeedsToBeRedrawn(dataFlow.id, redrawState.elementsToBeRedrawn)) {
        this.createDataFlowGroup(CopyUtils.copyDataFlow(dataFlow));
        this.store.dispatch(new RedrawCompleteAction(dataFlow.id));
      }
    });
  }

  addElementToDataFlowSelectionProcess(element: DFDElementType) {
    if (!this.creatingDataFlow) {
      this.creatingDataFlow = true;
      this.startElement = element;
      this.genericStartElement = ElementUtil.createGenericConnectedElement(element);
    } else {
      this.endElement = element;
      this.genericEndElement = ElementUtil.createGenericConnectedElement(element);
      this.addNewDataFlowToState();
      this.stopFreeDrawing();
    }
  }

  drawTemporaryDataFlow(dataFlowVectorMetaData: DataFlowVectorMetaData) {
    KonvaGeneralUtil
      .destroyExistingAndDrawNewTemporaryDataFlow(dataFlowVectorMetaData, this.drawingLayer, this.drawingStage, this.dataFlowTip);
  }

  removeStageListener() {
    this.drawingStage.off("mousemove");
    this.drawingStage.off("click");
  }

  private updateTemporaryDataFlow() {
    const initialScaledVector: VectorCoordinates = DataFlowUtil
      .createScaledDataFlowVector(this.startElement.coordinates, this.drawingStage.getPointerPosition(), this.stageZoom);
    const dataFlowVectorMetaData: DataFlowVectorMetaData = DataFlowUtil.getDataFlowMetaData(
      initialScaledVector.startCoord,
      initialScaledVector.endCoord,
      DataFlowDrawingPosition.NORMAL);
    this.store.dispatch(new AddTempDataFlowAction(dataFlowVectorMetaData));
  }

  private createDataFlowGroup(dataFlow: DataFlow) {
    const dataFlowVectorMetaData: DataFlowVectorMetaData = DataFlowUtil.getDataFlowMetaData(
      dataFlow.connectedElements.startElement.coordinates,
      dataFlow.connectedElements.endElement.coordinates,
      dataFlow.position);
    const dataFlowGroup: Konva.Group = KonvaGeneralUtil.createBaseDataFlowGroup(dataFlowVectorMetaData, this.dataFlowTip);
    dataFlowGroup.name(dataFlow.id);
    this.addTextToDataFlowGroup(dataFlowVectorMetaData, dataFlow.name, dataFlowGroup);
    this.setDataFlowListener(dataFlowGroup, dataFlow);
    KonvaGeneralUtil.addGroupToLayerAndDraw(this.drawingLayer, dataFlowGroup);
  }

  private addTextToDataFlowGroup(dataFlowVectorMetaData: DataFlowVectorMetaData, dataFlowName: string, dataFlowGroup: Konva.Group) {
    if (DataFlowUtil.dataFlowIsLongEnoughToContainDescription(dataFlowVectorMetaData.length, dataFlowVectorMetaData.position)) {
      const dataFlowText: Konva.Text = KonvaGeneralUtil.getDataFlowText(dataFlowVectorMetaData, dataFlowName);
      dataFlowGroup.add(dataFlowText);
      this.setDataFlowNameHighlightListener(dataFlowGroup, dataFlowText);
    }
  }

  private openDataFlowOptions(dataFlowToBeEdited: DataFlow) {
    this.store.dispatch(new InitOptionsViewAction(dataFlowToBeEdited));
  }

  private setDataFlowNameHighlightListener(dataFlowGroup: Konva.Group, dataFlowText: Konva.Text) {
    dataFlowGroup.on("mouseenter", () => {
      if (dataFlowText && !this.currentlyDrawing) {
        KonvaAdjustmentUtil.changeTextColorAndRerenderLayer(this.drawingLayer, dataFlowText, "#A0A0A0");
      }
    });
    dataFlowGroup.on("mouseleave", () => {
      if (dataFlowText && !this.currentlyDrawing) {
        KonvaAdjustmentUtil.changeTextColorAndRerenderLayer(this.drawingLayer, dataFlowText, "#464646");
      }
    });
  }

  private setDataFlowListener(dataFlowGroup: Konva.Group, dataFlow: DataFlow) {
    dataFlowGroup.on('click', (e) => {
      if (e.evt.button === 2 && !this.currentlyDrawing && this.showDesignView) {
        this.openDataFlowOptions(dataFlow);
      }
    });
    dataFlowGroup.on("mouseenter", () => KonvaGeneralUtil.setPointerCursorOnStage(this.drawingStage));

    dataFlowGroup.on("mouseleave", () => KonvaGeneralUtil.setDefaultCursorOnStage(this.drawingStage));
  }

  private setDrawingStageListener() {
    this.drawingStage.on('mousemove', () => {
      if (this.creatingDataFlow) {
        this.updateTemporaryDataFlow();
        this.currentlyDrawing = true;
      }
    });

    this.drawingStage.on('click', () => {
      if (this.currentlyDrawing) {
        this.stopFreeDrawing();
      }
    });
  }

  private stopFreeDrawing() {
    this.creatingDataFlow = false;
    this.currentlyDrawing = false;
    this.store.dispatch(new ResetTempDataFlowAction());
  }

  private addNewDataFlowToState() {
    if (this.genericStartElement.id !== this.genericEndElement.id) {
      const newDataFlow: DataFlowConnectionInfo = DataFlowUtil.createDataFlow(this.genericStartElement, this.genericEndElement);
      this.store.dispatch(new AddDataFlowAction(newDataFlow));
    }
  }

  private loadDataFlowTipImage() {
    this.dataFlowTip = new Image();
    this.dataFlowTip.src = '../assets/dftip.png';
  }
}
