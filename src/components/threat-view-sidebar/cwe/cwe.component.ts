import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Threat} from "../../../models/analysis-related/threat.model";
import {ThreatUtil} from "../../../utils/analysis/threat.util";
import {CweThreat} from "../../../models/analysis-related/cwe-threat.model";

@Component({
  selector: 'app-cwe',
  templateUrl: './cwe.component.html',
  styleUrls: ['./cwe.component.scss']
})
export class CweComponent implements OnInit {
  cweThreat: CweThreat;
  currentThreat: number;
  @Output()
  threatSelected = new EventEmitter();

  constructor() {
  }

  @Input()
  set cweData(cwe: CweThreat) {
    this.cweThreat = cwe;
  }

  @Input()
  set index(currentThreat: number) {
    this.currentThreat = currentThreat;
  }

  ngOnInit() {
  }

  selectCweThreat(cwe: CweThreat) {
    this.threatSelected.emit(cwe);
  }

  getSTIRDEThreatAffectsCWE(proportion: number) {
    if (proportion > 0.4) {
      return true;
    }
    return false;
  }

  getCvssScoreToString(score: number) {
    if (score <= 3.5) {
      return "low";
    } else if (score >= 6.5) {
      return "high";
    } else {
      return "medium";
    }
  }

  getCvssScoreCorrespondingColor(score: number) {
    if (score <= 3.5) {
      return "#FFCC00";
    } else if (score >= 6.5) {
      return "#FF0000";
    } else {
      return "#FF8000";
    }
  }

}
