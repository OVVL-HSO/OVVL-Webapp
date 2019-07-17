import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GeneralUtil} from "../../../../utils/general.util";
import {GenericSelection} from "../../../../models/modelling-related/base.model";
import {PhysicalAccess, TrustBoundary, TrustBoundaryType} from "../../../../models/modelling-related/trust-boundary.model";

@Component({
  selector: 'app-trust-boundary-options',
  templateUrl: './trust-boundary-options.component.html',
  styleUrls: ['./trust-boundary-options.component.scss']
})
export class TrustBoundaryOptionsComponent implements OnInit {

  @Output()
  optionsUpdated = new EventEmitter();
  trustBoundary: TrustBoundary;

  physicalAccessOptions: string[];
  genericSelectionOptions: string[];

  constructor() {
  }

  @Input()
  set selectedElementData(trustBoundary: TrustBoundary) {
    this.trustBoundary = trustBoundary;
  }

  ngOnInit() {
    this.genericSelectionOptions = GeneralUtil.getStringEnumAsArrayOfStrings(GenericSelection);
    this.physicalAccessOptions = GeneralUtil.getStringEnumAsArrayOfStrings(PhysicalAccess);
  }

  optionChanged() {
    this.optionsUpdated.emit(this.trustBoundary.options);
  }
}
