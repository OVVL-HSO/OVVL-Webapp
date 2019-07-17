import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DataFlow, NetworkType, PayloadType} from "../../../../models/modelling-related/dataflow.model";
import {GeneralUtil} from "../../../../utils/general.util";
import {ElementRelationInfo, GenericSelection} from "../../../../models/modelling-related/base.model";
import {Process} from "../../../../models/modelling-related/process.model";
import {OptionState} from "../../../../store/reducer/modelling-related/element-options.reducer";

@Component({
  selector: 'app-dataflow-options',
  templateUrl: './data-flow-options.component.html',
  styleUrls: ['./data-flow-options.component.scss']
})
export class DataFlowOptionsComponent implements OnInit{

  @Output()
  optionsUpdated = new EventEmitter();
  dataFlow: DataFlow;
  genericSelectionOptions: string[];
  networkTypeOptions: string[];
  payloadTypeOptions: string[];
  connectedElements: ElementRelationInfo;

  constructor() {
  }

  @Input()
  set selectedElementData(elementData: OptionState) {
    this.dataFlow = elementData.elementToBeChanged as DataFlow;
    this.connectedElements = elementData.connectedElements;
  }

  ngOnInit() {
    this.genericSelectionOptions = GeneralUtil.getStringEnumAsArrayOfStrings(GenericSelection);
    this.networkTypeOptions = GeneralUtil.getStringEnumAsArrayOfStrings(NetworkType);
    this.payloadTypeOptions = GeneralUtil.getStringEnumAsArrayOfStrings(PayloadType);
  }

  selectOptions() {
    this.optionsUpdated.emit(this.dataFlow.options);
  }
}
