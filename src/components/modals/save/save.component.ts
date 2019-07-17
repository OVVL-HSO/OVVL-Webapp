import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {StoreService} from "../../../services/store.service";
import {Store} from "@ngrx/store";
import {State} from "../../../store";
import {untilDestroyed} from "ngx-take-until-destroy";
import {Observable} from "rxjs";
import {BaseModelStorageData} from "../../../models/user-related/storage.model";
import {Project} from "../../../models/user-related/project.model";
import {StorageUtil} from "../../../utils/storage.util";
import {RemoveModalAction} from "../../../store/actions/view-related/modal.action";
import {ModalConfig} from "../../../config/modal.config";
import {SaveDFDAction} from "../../../store/actions/modelling-related/dfd-model.action";

@Component({
  selector: 'app-save',
  templateUrl: './save.component.html',
  styleUrls: ['./save.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SaveComponent implements OnInit, OnDestroy {
  modelStorageData: BaseModelStorageData;
  existingProjects$: Observable<Project[]>;
  screenshot: string;
  saving$: Observable<boolean>;

  constructor(private storeService: StoreService, private store: Store<State>) {
  }

  ngOnInit() {
    this.subscribeToWorkingAreaScreenShotAndInitEmptyStoragteData();
    this.subscribeToStorageLoadingState();
    this.selectExistingProjects();
  }

  ngOnDestroy() {
  }

  saveDFDModel() {
    this.store.dispatch(new SaveDFDAction(this.modelStorageData));
  }

  cancel() {
    this.store.dispatch(new RemoveModalAction(ModalConfig.STORAGE_MODAL));
  }

  storageDataContainsAllRequiredInfo(): boolean {
    return !StorageUtil.storageDataContainsAllRequiredInfo(this.modelStorageData);
  }

  private subscribeToWorkingAreaScreenShotAndInitEmptyStoragteData() {
    this.storeService.selectWorkAreaScreenshot()
      .pipe(untilDestroyed(this))
      .subscribe((screenshotBase64: string) => {
        this.screenshot = screenshotBase64;
        this.initEmptyStorageData();
      });
  }

  private selectExistingProjects() {
    this.existingProjects$ = this.storeService.selectProjects().pipe(untilDestroyed(this));
  }

  private initEmptyStorageData() {
    this.modelStorageData = StorageUtil.getEmptyBaseModelStorageData(this.screenshot);
  }

  private subscribeToStorageLoadingState() {
    this.saving$ = this.storeService.selectSavingState().pipe(untilDestroyed(this));
  }
}
