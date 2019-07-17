import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DataHandling, InputOrigin, Process} from "../../../../models/modelling-related/process.model";
import {GeneralUtil} from "../../../../utils/general.util";
import {ElementRelationInfo, GenericSelection, ScaleSelection} from "../../../../models/modelling-related/base.model";
import {OptionState} from "../../../../store/reducer/modelling-related/element-options.reducer";
import {Interactor} from "../../../../models/modelling-related/interactor.model";

@Component({
  selector: 'app-process-options',
  templateUrl: './process-options.component.html',
  styleUrls: ['./process-options.component.scss']
})
export class ProcessOptionsComponent implements OnInit {

  @Output()
  optionsUpdated = new EventEmitter();
  process: Process;
  scaleSelectionOptions: string[];
  genericSelectionOptions: string[];
  dataHandlingOptions: string[];
  inputOriginOptions: string[];
  connectedElements: ElementRelationInfo;

  constructor() {
  }

  @Input()
  set selectedElementData(elementData: OptionState) {
    this.process = elementData.elementToBeChanged as Process;
    this.connectedElements = elementData.connectedElements;
  }

  ngOnInit() {
    this.genericSelectionOptions = GeneralUtil.getStringEnumAsArrayOfStrings(GenericSelection);
    this.scaleSelectionOptions = GeneralUtil.getStringEnumAsArrayOfStrings(ScaleSelection);
    this.dataHandlingOptions = GeneralUtil.getStringEnumAsArrayOfStrings(DataHandling);
    this.inputOriginOptions = GeneralUtil.getStringEnumAsArrayOfStrings(InputOrigin);
  }

  selectOptions() {
    this.optionsUpdated.emit(this.process.options);
  }
}
