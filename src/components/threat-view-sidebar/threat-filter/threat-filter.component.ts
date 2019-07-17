import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FilterUtil} from "../../../utils/filter.util";
import {ThreatFilter, ThreatFilterPriority} from "../../../models/view-related/filter.model";
import {Threat} from "../../../models/analysis-related/threat.model";

@Component({
  selector: 'app-threat-filter',
  templateUrl: './threat-filter.component.html',
  styleUrls: ['./threat-filter.component.scss']
})
export class ThreatFilterComponent implements OnInit {
  @Output()
  updatedThreats = new EventEmitter();
  filterActive: boolean;
  filter: ThreatFilter;
  priorityRangeValue: string;
  filterApplied: boolean;
  private unfilteredThreats: Threat[];

  constructor() {
  }

  @Input()
  set threats(threats: Threat[]) {
    this.unfilteredThreats = threats;
  }

  ngOnInit() {
    this.resetFilter();
  }

  toggleFilter() {
    this.filterActive = !this.filterActive;
  }

  resetFilter() {
    this.filter = FilterUtil.setDefaultThreatFilter();
    this.filterApplied = false;
    this.priorityRangeValue = "2";
    this.applyFilter();
  }

  applyFilter() {
    this.filterApplied = FilterUtil.getThreatFilterAppliedStatus(this.filter);
    this.updatedThreats.emit(FilterUtil.applyThreatFilter(this.unfilteredThreats, this.filter));
  }

  updateRange(updatedPriority: string) {
    this.priorityRangeValue = updatedPriority;
    this.setPriorityFilter(updatedPriority);
  }

  setStrideFilter(strideButton: string) {
    switch (strideButton) {
      case "spoofing":
        this.filter.stride.spoofing = !this.filter.stride.spoofing;
        break;
      case "tampering":
        this.filter.stride.tampering = !this.filter.stride.tampering;
        break;
      case "repudiation":
        this.filter.stride.repudiation = !this.filter.stride.repudiation;
        break;
      case "dos":
        this.filter.stride.dos = !this.filter.stride.dos;
        break;
      case "infoDiscl":
        this.filter.stride.infoDiscl = !this.filter.stride.infoDiscl;
        break;
      case "elevationOfP":
        this.filter.stride.elevationOfP = !this.filter.stride.elevationOfP;
        break;
      default:
        break;
    }
    this.applyFilter();
  }

  setPriorityFilter(value: string) {
    this.filterApplied = true;
    switch (value) {
      case "1":
        this.filter.priority = ThreatFilterPriority.LOW;
        break;
      case "2":
        this.filter.priority = ThreatFilterPriority.MEDIUM;
        break;
      case "3":
        this.filter.priority = ThreatFilterPriority.HIGH;
        break;
      default:
        break;
    }
    this.applyFilter();
  }

  setApplicableFilter(applicable: string) {
    switch (applicable) {
      case "Not Selected":
        this.filter.applicable.notSelected = !this.filter.applicable.notSelected;
        break;
      case "Applicable":
        this.filter.applicable.applicable = !this.filter.applicable.applicable;
        break;
      case "Not Applicable":
        this.filter.applicable.notApplicable = !this.filter.applicable.notApplicable;
        break;
      default:
        break;
    }
    this.applyFilter();
  }
}
