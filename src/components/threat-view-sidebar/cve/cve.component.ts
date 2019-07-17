import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CVE, CVSS} from "../../../models/analysis-related/cve.model";
import {GeneralUtil} from "../../../utils/general.util";
import {AnalysisViewUtil} from "../../../utils/analysis/analysis-view.util";
import {CveUtil} from "../../../utils/analysis/cve.util";

@Component({
  selector: 'app-cve',
  templateUrl: './cve.component.html',
  styleUrls: ['./cve.component.scss']
})
export class CveComponent implements OnInit {
  cve: CVE;
  currentCVE: number;
  @Output()
  cveSelected = new EventEmitter();

  constructor() {
  }

  @Input()
  set cveData(cve: CVE) {
    this.cve = cve;
  }

  @Input()
  set index(currentCVE: number) {
    this.currentCVE = currentCVE;
  }

  ngOnInit() {
  }

  convertToDate(date: string) {
    return GeneralUtil.convertUTCToDDMMYYYY(date);
  }

  getCVEDropdownStyle(cve: CVE) {
    return AnalysisViewUtil.getCVEDropdownStyle(cve);
  }

  getCSSSeverityStyle(cvss: CVSS): string {
    return cvss.cvssv3Metric ?
      AnalysisViewUtil.getCVSSSeverityStyle(cvss.cvssv3Metric.baseScore)
      : AnalysisViewUtil.getCVSSSeverityStyle(cvss.cvssv2Metric.baseScore);
  }

  getSeverityScore(cvss: CVSS): string {
    return CveUtil.getCVSSScore(cvss).toString();
  }

  selectVulnerability(cve: CVE) {
    this.cveSelected.emit(cve);
  }

  getSeverityImpactLevel(cvss: CVSS) {
    const severityScore: string = this.getSeverityScore(cvss);
    if (severityScore !== "N/A") {
      const impactLevel: number = parseFloat(severityScore);
      if (impactLevel > 7) {
        return "HIGH";
      }
      if (impactLevel > 4) {
        return "MEDIUM";
      }
      return "LOW";
    }
    return "";
  }

  getReferenceTag(tags: string[]) {
    return tags.find((ref: string) => ref.indexOf("Advisory") > -1);
  }
}
