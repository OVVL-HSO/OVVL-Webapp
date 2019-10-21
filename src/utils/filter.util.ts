import {ApplicableFilterState, CVEFilter, NumberRange, StrideFilter, ThreatFilter, ThreatFilterPriority} from "../models/view-related/filter.model";
import {ApplicableState, Threat, ThreatPrority} from "../models/analysis-related/threat.model";
import {CVE} from "../models/analysis-related/cve.model";
import {CveUtil} from "./analysis/cve.util";
import {SecurityThreat, StrideCategory} from "../models/analysis-related/security-threat.model";
import {filterToMembersWithDecorator} from "@angular/compiler-cli/src/ngtsc/metadata";
import {forEach} from "@angular/router/src/utils/collection";

export class FilterUtil {
  static setDefaultThreatFilter(): ThreatFilter {
    return {
      stride: {
        spoofing: true,
        tampering: true,
        repudiation: true,
        dos: true,
        infoDiscl: true,
        elevationOfP: true
      },
      priority: ThreatFilterPriority.ALL,
      applicable: {
        notSelected: true,
        applicable: true,
        notApplicable: true
      }
    };
  }

  static setDefaultCVEFilter(yearRange: NumberRange): CVEFilter {
    return {
      searchTerm: "",
      yearRange: {
        min: yearRange.min,
        max: yearRange.max
      },
      severityRange: {
        min: 0,
        max: 10
      }
    };
  }

  static getYearRange(unfilteredCVEs: CVE[]): NumberRange {
    let minYear = new Date().getFullYear();
    let maxYear = 0;
    unfilteredCVEs.forEach((cve: CVE) => {
      const cveYear = parseInt(cve.cveID.substring(4, 8));
      if (minYear > cveYear) {
        minYear = cveYear;
      }
      if (maxYear < cveYear) {
        maxYear = cveYear;
      }
    });
    return {
      min: minYear,
      max: maxYear
    };
  }

  static getThreatFilterAppliedStatus(filter: ThreatFilter): boolean {
    return !this.strideUnfiltered(filter.stride)
      || filter.priority !== ThreatFilterPriority.ALL
      || !this.applicableStatusUnfiltered(filter.applicable);
  }

  static getCVEFilterAppliedStatus(filter: CVEFilter, yearRange: NumberRange): boolean {
    return !!filter.searchTerm
      || !this.yearUnfiltered(filter.yearRange, yearRange)
      || !this.impactUnfiltered(filter.severityRange);
  }

  static applyCVEFilter(unfilteredCVEs: CVE[], filter: CVEFilter): CVE[] {
    let filteredCVEs = unfilteredCVEs;
    filteredCVEs = this.applyCVESearchFilter(filteredCVEs, filter.searchTerm);
    filteredCVEs = this.applyCVEYearFilter(filteredCVEs, filter.yearRange);
    filteredCVEs = this.applyCVESeverityFilter(filteredCVEs, filter.severityRange);
    return filteredCVEs;
  }

  static applyThreatFilter(unfilteredThreats: Threat[] , filter: ThreatFilter): Threat[] {
    let filteredThreats = unfilteredThreats;

    if (filteredThreats.filter(threat => 'strideCategory' in threat).length === filteredThreats.length){
      filteredThreats = this.applyStrideFilter(filteredThreats, filter.stride);
    }

    filteredThreats = this.applyPriorityFilter(filteredThreats, filter.priority);
    filteredThreats = this.applyApplicableFilter(filteredThreats, filter.applicable);
    return filteredThreats;
  }

  private static strideUnfiltered(stride: StrideFilter): boolean {
    return stride.spoofing && stride.tampering && stride.repudiation && stride.dos && stride.infoDiscl && stride.elevationOfP;
  }

  private static applicableStatusUnfiltered(applicable: ApplicableFilterState): boolean {
    return applicable.notSelected && applicable.applicable && applicable.notApplicable;
  }

  private static yearUnfiltered(setRange: NumberRange, defaultRange: NumberRange): boolean {
    return setRange.min === defaultRange.min && setRange.max === defaultRange.max;
  }

  private static impactUnfiltered(impactRange: NumberRange): boolean {
    return impactRange.min === 0 && impactRange.max === 10;
  }

  private static applyStrideFilter(threats: SecurityThreat[], strideFilter: StrideFilter): SecurityThreat[] {
    if (this.strideUnfiltered(strideFilter)) {
      return threats;
    }
    return threats.filter((threat) => {
      switch (threat.threatCategory) {
        case StrideCategory.SPOOFING:
          return strideFilter.spoofing;
        case StrideCategory.TAMPERING:
          return strideFilter.tampering;
        case StrideCategory.REPUDIATION:
          return strideFilter.repudiation;
        case StrideCategory.INFORMATION_DISCLOSURE:
          return strideFilter.infoDiscl;
        case StrideCategory.DENIAL_OF_SERVICE:
          return strideFilter.dos;
        case StrideCategory.ELEVATION_OF_PRIVILEGE:
          return strideFilter.elevationOfP;
        default:
          return false;
      }
    });
  }

  private static applyPriorityFilter(threats: Threat[], priority: ThreatFilterPriority): Threat[] {
    switch (priority) {
      case ThreatFilterPriority.LOW:
        return threats.filter((threat: Threat) => threat.priority === ThreatPrority.LOW);
      case ThreatFilterPriority.MEDIUM:
        return threats.filter((threat: Threat) => threat.priority === ThreatPrority.MEDIUM);
      case ThreatFilterPriority.HIGH:
        return threats.filter((threat: Threat) => threat.priority === ThreatPrority.HIGH);
      case ThreatFilterPriority.ALL:
      default:
        return threats;
    }
  }

  private static applyApplicableFilter(threats: Threat[], applicableFilter: ApplicableFilterState): Threat[] {
    if (this.applicableStatusUnfiltered(applicableFilter)) {
      return threats;
    }
    return threats.filter((threat) => {
      switch (threat.applicable) {
        case ApplicableState.NOT_SELECTED:
          return applicableFilter.notSelected;
        case ApplicableState.APPLICABLE:
          return applicableFilter.applicable;
        case ApplicableState.NOT_APPLICABLE:
          return applicableFilter.notApplicable;
        default:
          return false;
      }
    });
  }

  private static applyCVESearchFilter(cves: CVE[], searchTerm: string): CVE[] {
    return cves.filter((cve: CVE) => JSON.stringify(cve).indexOf(searchTerm) > -1);
  }

  private static applyCVEYearFilter(cves: CVE[], yearRange: NumberRange): CVE[] {
    return cves.filter((cve: CVE) => {
      const cveYear: number = parseInt(cve.cveID.substring(4, 8));
      return cveYear >= yearRange.min && cveYear <= yearRange.max;
    });
  }

  private static applyCVESeverityFilter(filteredCVEs: CVE[], impactRange: NumberRange): CVE[] {
    return filteredCVEs.filter((cve: CVE) => {
      const severityScore: number = CveUtil.getCVSSScore(cve.cvss);
      return severityScore >= impactRange.min && severityScore <= impactRange.max;
    });
  }
}
