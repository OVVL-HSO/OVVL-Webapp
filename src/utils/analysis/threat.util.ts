import {DataFlow} from '../../models/modelling-related/dataflow.model';
import {GenericElementType} from '../../models/modelling-related/base.model';
import {DFDElementType} from "../../models/types/types.model";
import {ApplicableState, Threat, ThreatPrority, ThreatSpecificationUpdate} from "../../models/analysis-related/threat.model";
import {ElementUtil} from "../element.util";

export class ThreatUtil {
  static findAffectedElements(dfdElements: (DFDElementType | DataFlow)[],
                              affectedElementIDs: string[]) {
    return affectedElementIDs.map((elementID: string) => ElementUtil.findDFDElementOrDataFlowByID(dfdElements, elementID));
  }

  static elementIsNotADataflow(affectedElement: DFDElementType | DataFlow): boolean {
    return (affectedElement.genericType !== GenericElementType.DATAFLOW);
  }

  static findThreatsThatAffectAnElement(threats: Threat[], selectedElementID: string) {
    return threats.filter((threat: Threat) => threat.affectedElements.includes(selectedElementID));
  }

  static findThreatsNotIncludedInAnotherThreatList(threats: Threat[], threatsThatAffectTheElement: Threat[]) {
    return threats.filter((threat: Threat) => !threatsThatAffectTheElement.includes(threat));
  }

  static createSpecificationUpdate(value: string, threat: Threat): ThreatSpecificationUpdate {
    return {
      value: value,
      threat: threat
    };
  }

  static applyPriorityUdpdateToThreat(priorityUpdate: ThreatSpecificationUpdate): Threat {
    switch (priorityUpdate.value) {
      case "1":
        priorityUpdate.threat.priority = ThreatPrority.LOW;
        break;
      case "2":
        priorityUpdate.threat.priority = ThreatPrority.MEDIUM;
        break;
      case "3":
        priorityUpdate.threat.priority = ThreatPrority.HIGH;
        break;
      default:
        priorityUpdate.threat.priority = ThreatPrority.UNSPECIFIED;
        break;
    }
    return priorityUpdate.threat;
  }

  static applyApplicableUpdateToThreat(applicableUpdate: ThreatSpecificationUpdate) {
    if (applicableUpdate.value === "Not Selected") {
      applicableUpdate.threat.applicable = ApplicableState.NOT_SELECTED;
    } else if (applicableUpdate.value === "Applicable") {
      applicableUpdate.threat.applicable = ApplicableState.APPLICABLE;
    } else {
      applicableUpdate.threat.applicable = ApplicableState.NOT_APPLICABLE;
    }
    return applicableUpdate.threat;
  }
}
