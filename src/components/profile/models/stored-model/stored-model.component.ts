import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ModelStorageData} from "../../../../models/user-related/storage.model";
import {GeneralUtil} from "../../../../utils/general.util";
import {State} from "../../../../store";
import {Store} from "@ngrx/store";
import {ShowModelDetailsAction} from "../../../../store/actions/user-related/profile.action";
import {StoreService} from "../../../../services/store.service";
import {untilDestroyed} from "ngx-take-until-destroy";
import {Observable} from "rxjs";

@Component({
  selector: 'app-stored-model',
  templateUrl: './stored-model.component.html',
  styleUrls: ['./stored-model.component.scss']
})
export class StoredModelComponent implements OnInit, OnDestroy {
  storedModel: ModelStorageData;
  selectedModel$: Observable<string>;
  projectTitle$: Observable<string>;

  constructor(private store: Store<State>, private storeSerivce: StoreService) {
  }

  @Input()
  set model(model: ModelStorageData) {
    this.storedModel = model;
  }

  ngOnInit() {
    this.selectCurrentlySelectedModelID();
    this.getProjectLink();
  }

  ngOnDestroy() {
  }

  getCreationDate() {
    return GeneralUtil.convertUTCToDDMMYYYY(this.storedModel.date);
  }

  getEditedDate() {
    return GeneralUtil.convertUTCToDDMMYYYY(this.storedModel.editedDate);
  }

  showModelDetails() {
    this.store.dispatch(new ShowModelDetailsAction(this.storedModel.modelID));
  }

  private selectCurrentlySelectedModelID() {
    this.selectedModel$ = this.storeSerivce.selectModelDetailState().pipe(untilDestroyed(this));
  }

  private getProjectLink() {
    // This is for placing the title of a project on the item, if available
    if (this.storedModel.projectID) {
      this.projectTitle$ = this.storeSerivce.selectProjectTitleByID(this.storedModel.projectID).pipe(untilDestroyed(this));
    }
  }
}
