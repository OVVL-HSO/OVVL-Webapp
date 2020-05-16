import {Interactor} from '../models/modelling-related/interactor.model';
import {Process} from '../models/modelling-related/process.model';
import {DataStore} from '../models/modelling-related/datastore.model';
import {DataFlow} from '../models/modelling-related/dataflow.model';
import {TrustBoundary} from "../models/modelling-related/trust-boundary.model";
import {Threat} from "../models/analysis-related/threat.model";
import {CVE} from "../models/analysis-related/cve.model";

export class CopyUtils {

  static copyDFDElement<T extends Interactor | Process | DataStore>(element: T): T {
    return {
      ...element,
      coordinates: {...element.coordinates},
      options: {...element.options}
    };
  }

  static copyDataFlow(dataFlow: DataFlow): DataFlow {
    return {
      ...dataFlow,
      connectedElements: {
        startElement: {...dataFlow.connectedElements.startElement},
        endElement: {...dataFlow.connectedElements.endElement}
      },
      options: {...dataFlow.options}
    };
  }

  static copyTrustBoundary(trustBoundary: TrustBoundary): TrustBoundary {
    return {
      ...trustBoundary,
      coordinates: trustBoundary.coordinates
    };
  }

  static copyThreats(threats: Threat[]): Threat[] {
    if (threats != null) {
      return threats.map((threat: Threat) => this.copyThreat(threat));
    }
  }

  static copyVulnerabilities(cves: CVE[]): CVE[] {
    return cves.map((cve: CVE) => this.copyCVE(cve));
  }

  private static copyThreat(threat: Threat): Threat {
    return {
      ...threat,
      affectedElements: [...threat.affectedElements],
    };
  }

  private static copyCVE(cve: CVE): CVE {
    return {
      ...cve,
      affects: cve.affects ? [...cve.affects] : [],
      problemTypes: cve.problemTypes ? [...cve.problemTypes] : [],
      references: cve.references ? [...cve.references] : [],
      descriptions: cve.descriptions ? [...cve.descriptions] : [],
      vulnerableConfig: {...cve.vulnerableConfig},
      cvss: {...cve.cvss}
    };
  }
}
