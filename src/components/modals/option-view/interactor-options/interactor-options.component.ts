import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {AppType, Interactor} from "../../../../models/modelling-related/interactor.model";
import {GeneralUtil} from "../../../../utils/general.util";
import {ElementRelationInfo, GenericSelection, ScaleSelection} from "../../../../models/modelling-related/base.model";
import {OptionUtil} from "../../../../utils/option.util";
import {OptionState} from "../../../../store/reducer/modelling-related/element-options.reducer";
import {Process} from "../../../../models/modelling-related/process.model";

@Component({
  selector: 'app-interactor-options',
  templateUrl: './interactor-options.component.html',
  styleUrls: ['./interactor-options.component.scss']
})
export class InteractorOptionsComponent implements OnInit {

  @Output()
  optionsUpdated = new EventEmitter();
  genericSelectionOptions: string[];
  appTypeOptions: string[];
  scaleSelectionOptions: string[];
  authenticationHint: string;
  interactor: Interactor;
  connectedElements: ElementRelationInfo;

  constructor() {
  }

  @Input()
  set selectedElementData(elementData: OptionState) {
    this.interactor = elementData.elementToBeChanged as Interactor;
    this.connectedElements = elementData.connectedElements;
  }

  ngOnInit() {
    this.genericSelectionOptions = GeneralUtil.getStringEnumAsArrayOfStrings(GenericSelection);
    this.scaleSelectionOptions = GeneralUtil.getStringEnumAsArrayOfStrings(ScaleSelection);
    this.appTypeOptions = GeneralUtil.getStringEnumAsArrayOfStrings(AppType);
    this.checkForHintsDependantOnConnectedElements();
  }

  optionChanged() {
    this.optionsUpdated.emit(this.interactor.options);
  }

  private checkForHintsDependantOnConnectedElements() {
    const processesRequiringAuthentication = OptionUtil
      .getProcessesWhichRequireAuthenticationFromElementArray(this.connectedElements.elementsReceivingData);
    if (processesRequiringAuthentication.length) {
      this.buildAuthenticationHint(processesRequiringAuthentication);
    }
  }

  private buildAuthenticationHint(processesRequiringAuthentication: Process[]) {
    if (processesRequiringAuthentication.length > 1) {
      this.authenticationHint = processesRequiringAuthentication.length.toString() + " connected Processes require authentication.";
    } else {
      this.authenticationHint = "Connected process " + processesRequiringAuthentication[0].name + " requires authentication.";
    }
  }
}
