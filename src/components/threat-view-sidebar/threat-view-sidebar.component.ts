import {Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Threat, ThreatSpecificationUpdate, ThreatViewHighlightData} from '../../models/analysis-related/threat.model';
import {Store} from '@ngrx/store';
import {State} from '../../store';
import {DataFlow} from '../../models/modelling-related/dataflow.model';
import {ThreatUtil} from '../../utils/analysis/threat.util';
import * as Konva from 'konva';
import {PointCoordinates} from '../../models/view-related/coordinates.model';
import {GeneralUtil} from '../../utils/general.util';
import {CVE} from '../../models/analysis-related/cve.model';
import {CveUtil} from '../../utils/analysis/cve.util';
import {AnalysisViewUtil} from "../../utils/analysis/analysis-view.util";
import {UnselectAllDFDElementsAction} from "../../store/actions/modelling-related/dfd-element.action";
import {ElementUtil} from "../../utils/element.util";
import {KonvaGeneralUtil} from "../../utils/konva/konva-general.util";
import {StoreService} from "../../services/store.service";
import {untilDestroyed} from "ngx-take-until-destroy";
import {DFDElementType} from "../../models/types/types.model";
import {DFDElementState} from "../../store/reducer/modelling-related/dfd-element.reducer";
import {SetZoomEnabledAction} from "../../store/actions/view-related/view.action";
import {AnalysisState} from "../../models/analysis-related/analysis.model";
import {CopyUtils} from "../../utils/copy.util";
import {ResetAnalysisDataAction, UpdateThreatDataAction} from "../../store/actions/analysis-related/analysis.action";
import {CweThreat} from "../../models/analysis-related/cwe-threat.model";

@Component({
  selector: 'app-threat-view-sidebar',
  templateUrl: './threat-view-sidebar.component.html',
  styleUrls: ['./threat-view-sidebar.component.scss']
})
export class ThreatViewSidebarComponent implements OnInit, OnDestroy {
  @ViewChild('highlightStageContainer') highlightStageContainer: ElementRef;

  foundStrideThreats: Threat[];
  foundCweThreats: Threat[];
  activeTab: string;
  foundCVEs: CVE[] = [];
  moveHighlightStageToTop: boolean;
  displayedStrideThreats: Threat[];
  displayedCweThreats: Threat[];
  displayedVulnerabilities: CVE[];

  private dfdElements: (DFDElementType | DataFlow)[];
  private elementDrawingStage: Konva.Stage;
  private highlightLayer: Konva.Layer<Konva.Node>;
  private highlightStage: Konva.Stage;
  private selectedElement: DFDElementType | DataFlow;

  constructor(private store: Store<State>,
              private storeService: StoreService) {
  }

  @Input()
  set stage(stage: Konva.Stage) {
    this.elementDrawingStage = stage;
  }

  ngOnInit() {
    this.setHighlighStage();
    this.addHighlightLayer();
    this.setHighlighStageListener();
    this.subscribeToDfdElements();
    this.subscribeToThreatsAndVulnerabilities();
    this.activeTab = "securityThreats";
  }

  ngOnDestroy() {
    this.highlightLayer.destroy();
    this.highlightStage.destroy();
    this.store.dispatch(new ResetAnalysisDataAction());
  }

  toggleThreatElementView(selectedTab: string) {
    this.removeHighlightingAndUnselectThreatsAndVulnerabilities();
    this.activeTab = selectedTab;
  }

  selectSecurityThreat(threat: Threat) {
    this.clearView();
    if (!threat.selected) {
      this.moveHighlightStageToTop = true;
      AnalysisViewUtil.dropDownSelectedDanger(this.foundStrideThreats, threat);
      const affectedElements: (DFDElementType | DataFlow)[] =
        ThreatUtil.findAffectedElements(this.dfdElements, threat.affectedElements);
      this.highlightElements(affectedElements);
    } else {
      this.removeHighlightingAndUnselectThreatsAndVulnerabilities();
    }
  }

  selectCweThreat(cwe: CweThreat) {
    this.clearView();
    if (!cwe.selected) {
      this.moveHighlightStageToTop = true;
      AnalysisViewUtil.dropDownSelectedDanger(this.foundCweThreats, cwe);
      const affectedElements: (DFDElementType | DataFlow)[] =
        ThreatUtil.findAffectedElements(this.dfdElements, cwe.affectedElements);
      this.highlightElements(affectedElements);
    } else {
      this.removeHighlightingAndUnselectThreatsAndVulnerabilities();
    }
  }


  selectVulnerability(cve: CVE) {
    this.clearView();
    if (!cve.selected) {
      this.moveHighlightStageToTop = true;
      AnalysisViewUtil.dropDownSelectedDanger(this.foundCVEs, cve);
      const affectedElements: (DFDElementType | DataFlow)[] =
        CveUtil.findAffectedElements(this.dfdElements, cve.affects);
      this.highlightElements(affectedElements);
    } else {
      this.removeHighlightingAndUnselectThreatsAndVulnerabilities();
    }
  }

  trackThreatsByFn(index, item: Threat) {
    return (item.threatID);
  }

  trackCweByFn(index, item: CweThreat) {
    return (item.cwe.id);
  }

  trackCVEsByFn(index, item: CVE) {
    return (item.cveID);
  }

  setThreatApplicableState(applicableUpdate: ThreatSpecificationUpdate) {
    if (applicableUpdate.threat.applicable !== applicableUpdate.value) {
      this.store.dispatch(new UpdateThreatDataAction(ThreatUtil.applyApplicableUpdateToThreat(applicableUpdate)));
    }
  }

  updatedDisplayedThreats(updatedThreats: Threat[]) {
    this.displayedStrideThreats = updatedThreats;
  }

  updatedDisplayedCVEs(updatedCVEs: CVE[]) {
    this.displayedVulnerabilities = updatedCVEs;
  }

  setThreatPriority(priorityUpdate: ThreatSpecificationUpdate) {
    this.store.dispatch(new UpdateThreatDataAction(ThreatUtil.applyPriorityUdpdateToThreat(priorityUpdate)));
  }

  private subscribeToDfdElements() {
    this.storeService.selectElementState()
      .pipe(untilDestroyed(this))
      .subscribe((state: DFDElementState) => {
        this.dfdElements = GeneralUtil.combineTwoArrays<(DFDElementType | DataFlow)>(
          state.dfdElements, state.dataFlows);
        this.highlightRelevantThreatsDependingOnSelectedElements();
      });
  }

  private subscribeToThreatsAndVulnerabilities() {
    this.storeService.selectAnalysisState()
      .pipe(untilDestroyed(this))
      .subscribe((analysisState: AnalysisState) => {
        this.foundStrideThreats = CopyUtils.copyThreats(analysisState.strideThreats);
        this.foundCweThreats = CopyUtils.copyThreats(analysisState.cweThreats);
        this.foundCVEs = CopyUtils.copyVulnerabilities(analysisState.vulnerabilities);
        this.foundCVEs = CveUtil.sortCVEsByTheirImpact(this.foundCVEs);
        this.displayedStrideThreats = this.foundStrideThreats;
        this.displayedCweThreats = this.foundCweThreats;
        this.displayedVulnerabilities = this.foundCVEs;
      });
  }

  private highlightRelevantThreatsDependingOnSelectedElements() {
    this.selectedElement = ElementUtil.findTheFirstSelectedDFDElementInAnArray(this.dfdElements);
    if (this.selectedElement) {
      if (this.activeTab === "securityThreats") {
        this.highlightElementsAndTheirCorrespondingSecurityThreats();
      } else if (this.activeTab === "privacyThreats") {
        this.highlightElementsAndTheirCorrespondingPrivacyThreats();
      } else {
        this.highlightElementsAndTheirCorrespondingVulnerabilities();
      }
    } else {
      this.resetHighlightStage();
    }
  }

  private highlightElements(affectedElements: (DFDElementType | DataFlow)[]) {
    if (affectedElements.length) {
      this.store.dispatch(new SetZoomEnabledAction(false));
      this.moveHighlightStageToTop = true;
      KonvaGeneralUtil.clearLayer(this.highlightLayer);
      const highlightGroup: Konva.Group = new Konva.Group({
        draggable: false,
        opacity: 0.7
      });
      const overlay = new Konva.Shape({
        sceneFunc: (context, shape) => {
          this.drawOverlayWithClippedAreas(context, affectedElements, shape);
        }
      });
      highlightGroup.add(overlay);
      KonvaGeneralUtil.addGroupToLayerAndDraw(this.highlightLayer, highlightGroup);
    }
  }

  private addHighlightLayer() {
    this.highlightLayer = KonvaGeneralUtil.createLayerAndPlaceItOnStage(this.highlightStage);
  }

  private clearView() {
    this.highlightLayer.destroyChildren();
    this.highlightLayer.batchDraw();
  }

  private drawOverlayWithClippedAreas(context,
                                      affectedElements: (DFDElementType | DataFlow)[],
                                      shape: Konva.Shape) {
    context.fillStyle = 'black';
    context.fillRect(0, 0, this.elementDrawingStage.getWidth(), this.elementDrawingStage.getHeight());
    affectedElements.forEach((affectedElement: DFDElementType | DataFlow) => {
      if (ThreatUtil.elementIsNotADataflow(affectedElement)) {
        const coordinates: PointCoordinates = GeneralUtil.getCoordinatesOfElementWithUnknownType(affectedElement);
        AnalysisViewUtil.drawCutoutShapeIntoOverlay(this.elementDrawingStage, context, coordinates, shape);
      }
    });
  }

  private setHighlighStage() {
    this.highlightStage = KonvaGeneralUtil.createStage(this.highlightStageContainer, false);
  }

  private setHighlighStageListener() {
    this.highlightStage.on("click", () => {
      this.removeHighlightingAndUnselectThreatsAndVulnerabilities();
    });
  }

  private removeHighlightingAndUnselectThreatsAndVulnerabilities() {
    this.store.dispatch(new SetZoomEnabledAction(true));
    AnalysisViewUtil.resetDangerDropdowns(this.foundStrideThreats);
    AnalysisViewUtil.resetDangerDropdowns(this.foundCVEs);
    AnalysisViewUtil.resetDangerDropdowns(this.foundCweThreats);
    if (this.selectedElement) {
      this.store.dispatch(new UnselectAllDFDElementsAction());
    }
    this.resetHighlightStage();
  }

  private resetHighlightStage() {
    this.moveHighlightStageToTop = false;
    this.clearView();
  }

  private highlightElementsAndTheirCorrespondingSecurityThreats() {
    const highlightMetaData: ThreatViewHighlightData = AnalysisViewUtil
      .combineDataRequiredForThreatAnalysisHighlighting(this.foundStrideThreats, this.selectedElement.id, this.dfdElements);
    this.foundStrideThreats = highlightMetaData.updatedThreats;
    this.highlightElements(highlightMetaData.affectedElements);
  }

  private highlightElementsAndTheirCorrespondingPrivacyThreats() {
    const highlightMetaData: ThreatViewHighlightData = AnalysisViewUtil
      .combineDataRequiredForThreatAnalysisHighlighting(this.foundCweThreats, this.selectedElement.id, this.dfdElements);
    this.foundCweThreats = highlightMetaData.updatedThreats;
    this.highlightElements(highlightMetaData.affectedElements);
  }

  private highlightElementsAndTheirCorrespondingVulnerabilities() {
    if (this.selectedElement.cpe) {
      this.foundCVEs = CveUtil.updateCVEsSelectStatus(this.foundCVEs, this.selectedElement.cpe.cpe23Name);
      this.highlightElements([this.selectedElement]);
    }
  }
}

