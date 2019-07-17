import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DataStore} from "../../../../models/modelling-related/datastore.model";
import {GeneralUtil} from "../../../../utils/general.util";
import {ElementRelationInfo, GenericSelection, ScaleSelection} from "../../../../models/modelling-related/base.model";
import {OptionState} from "../../../../store/reducer/modelling-related/element-options.reducer";

@Component({
  selector: 'app-datastore-options',
  templateUrl: './data-store-options.component.html',
  styleUrls: ['./data-store-options.component.scss']
})
export class DataStoreOptionsComponent implements OnInit {

  @Output()
  optionsUpdated = new EventEmitter();
  dataStore: DataStore;
  scaleSelectionOptions: string[];
  genericSelectionOptions: string[];
  connectedElements: ElementRelationInfo;

  constructor() {
  }

  @Input()
  set selectedElementData(elementData: OptionState) {
    this.dataStore = elementData.elementToBeChanged as DataStore;
    this.connectedElements = elementData.connectedElements;
  }

  ngOnInit() {
    this.genericSelectionOptions = GeneralUtil.getStringEnumAsArrayOfStrings(GenericSelection);
    this.scaleSelectionOptions = GeneralUtil.getStringEnumAsArrayOfStrings(ScaleSelection);
  }

  optionChanged() {
    this.optionsUpdated.emit(this.dataStore.options);
  }
}
