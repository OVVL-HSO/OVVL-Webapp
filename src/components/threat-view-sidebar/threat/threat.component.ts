import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Threat} from "../../../models/analysis-related/threat.model";
import {ThreatUtil} from "../../../utils/analysis/threat.util";

@Component({
  selector: 'app-threat',
  templateUrl: './threat.component.html',
  styleUrls: ['./threat.component.scss']
})
export class ThreatComponent implements OnInit {
  threat: Threat;
  currentThreat: number;
  @Output()
  threatSelected = new EventEmitter();
  @Output()
  priorityUpdated = new EventEmitter();
  @Output()
  applicableStateUpdated = new EventEmitter();

  constructor() {
  }

  @Input()
  set threatData(threat: Threat) {
    this.threat = threat;
  }

  @Input()
  set index(currentThreat: number) {
    this.currentThreat = currentThreat;
  }

  ngOnInit() {
  }

  selectThreat(threat: Threat) {
    this.threatSelected.emit(threat);
  }

  setThreatPriority(priority: string, threat: Threat) {
    this.priorityUpdated.emit(ThreatUtil.createSpecificationUpdate(priority, threat));
  }


  setThreatApplicableState(notSelected: string, threat: Threat) {
    this.applicableStateUpdated.emit(ThreatUtil.createSpecificationUpdate(notSelected, threat));
  }
}
