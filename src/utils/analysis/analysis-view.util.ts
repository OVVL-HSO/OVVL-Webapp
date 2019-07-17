import {Threat, ThreatViewHighlightData} from "../../models/analysis-related/threat.model";
import {CVE} from "../../models/analysis-related/cve.model";
import {PointCoordinates} from "../../models/view-related/coordinates.model";
import {ShapeConfig} from "../../config/shape.config";
import * as Konva from "konva";
import {DataFlow} from "../../models/modelling-related/dataflow.model";
import {ThreatUtil} from "./threat.util";
import {GeneralUtil} from "../general.util";
import {ElementUtil} from "../element.util";
import {DFDElementType} from "../../models/types/types.model";

export class AnalysisViewUtil {

  static resetDangerDropdowns<T extends Threat | CVE>(dangers: T[]) {
    dangers.forEach((threatOrVuln: T) => threatOrVuln.selected = false);
  }

  static dropDownSelectedDanger<T extends Threat | CVE>(dangers: T[], clickedDanger: T) {
    dangers.forEach((danger: T) => danger.selected = clickedDanger === danger);
  }

  static getCVEDropdownStyle(cve: CVE): string {
    let vulnerabilityDropdownCSS;
    if (cve.cvss.cvssv3Metric) {
      vulnerabilityDropdownCSS = this.getCVSSSeverityStyle(cve.cvss.cvssv3Metric.baseScore);
    } else if (cve.cvss.cvssv2Metric) {
      vulnerabilityDropdownCSS = this.getCVSSSeverityStyle(cve.cvss.cvssv2Metric.baseScore);
    }
    if (cve.selected) {
      vulnerabilityDropdownCSS += " dropdown-toggled";
    }
    return vulnerabilityDropdownCSS;
  }

  static getCVSSSeverityStyle(cvssScore: number): string {
    let vulnerabilitySeverityCSS = "";
    if (cvssScore > 7) {
      vulnerabilitySeverityCSS += "high-severity";
    } else if (cvssScore > 4) {
      vulnerabilitySeverityCSS += "medium-severity";
    } else {
      vulnerabilitySeverityCSS += "low-severity";
    }
    return vulnerabilitySeverityCSS;
  }

  static drawCutoutShapeIntoOverlay(elementDrawingStage: Konva.Stage, context: any, coordinates: PointCoordinates, shape: Konva.Shape) {
    context.save();
    context.globalCompositeOperation = 'destination-out';
    context.beginPath();
    // Scaling and positioning after zooming the stage has to be kept in mind
    // For this, the updated drawingStage position is the initial value (0,0 when not zoomed)
    // To this value, we add the respective element coordinates (+ y-offset for the text)
    // Because the main drawing stage changes its scaling factor when zoomed, we need to multiply the coordinates by it
    context.arc(
      elementDrawingStage.x()
      + coordinates.x
      * elementDrawingStage.scaleX(),
      elementDrawingStage.y()
      + (coordinates.y - ShapeConfig.GET_DFD_SHAPE_RADIUS() + ((3 * ShapeConfig.GET_DFD_SHAPE_RADIUS() + 7) / 2))
      * elementDrawingStage.scaleY(),
      2 * ShapeConfig.GET_DFD_SHAPE_RADIUS() * elementDrawingStage.scaleX(),
      0,
      Math.PI * 2,
      false);
    context.fill();
    context.restore();
    context.fillStrokeShape(shape);
  }

  static combineDataRequiredForThreatAnalysisHighlighting(threats: Threat[],
                                                          selectedElementID: string,
                                                          dfdElements: (DFDElementType | DataFlow)[])
    : ThreatViewHighlightData {
    const threatViewHighlightData: ThreatViewHighlightData = {updatedThreats: [], affectedElements: []};
    let affectedElements: (DFDElementType | DataFlow)[] = [];


    // 1: Filter out all threats which affect the selected Element
    const threatsThatAffectTheElement: Threat[] = ThreatUtil.findThreatsThatAffectAnElement(threats, selectedElementID);

    // 2. Set each of these filtered threats to selected, and find all elements affected by these threats
    threatsThatAffectTheElement.forEach((threat: Threat) => {
      threat.selected = true;
      affectedElements = affectedElements.concat(ThreatUtil
        .findAffectedElements(dfdElements, threat.affectedElements));
    });

    // 3. Find all threats that don't affect the element
    const threatsThatDontAffectTheElement: Threat[] = ThreatUtil
      .findThreatsNotIncludedInAnotherThreatList(threats, threatsThatAffectTheElement);

    // 4. Combine both arrays to a new one, so the affecting threats are in the front of the array
    threatViewHighlightData.updatedThreats = GeneralUtil
      .combineTwoArrays<Threat>(threatsThatAffectTheElement, threatsThatDontAffectTheElement);

    // 5. Remove duplicates of all elements affected by the same threats as the selected Elements
    threatViewHighlightData.affectedElements = GeneralUtil.removeDuplicatesOfAnArray<(DFDElementType | DataFlow)>(affectedElements);

    // 6. Don't include dataFlows, because they currently don't get highlighted
    threatViewHighlightData.affectedElements = ElementUtil.filterOutDataStoresFromAnElementList(affectedElements);

    return threatViewHighlightData;
  }
}
