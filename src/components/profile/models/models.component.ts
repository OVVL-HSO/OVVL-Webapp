import {Component, Input, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {ModelStorageData} from "../../../models/user-related/storage.model";
import {Observable} from "rxjs";
import {StoreService} from "../../../services/store.service";
import {untilDestroyed} from "ngx-take-until-destroy";
import {Store} from "@ngrx/store";
import {State} from "../../../store";
import {CloseDetailsAction} from "../../../store/actions/user-related/profile.action";
import {animate, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-models',
  templateUrl: './models.component.html',
  styleUrls: ['./models.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger(
      'sidebar-transition',
      [
        transition(
          ':enter', [
            style({transform: 'translateX(100%)', opacity: 0}),
            animate('10ms', style({transform: 'translateX(0)', 'opacity': 1}))
          ]
        ),
        transition(
          ':leave', [
            style({transform: 'translateX(0)', opacity: 1}),
            animate('10ms', style({transform: 'translateX(100%)', 'opacity': 0})),
          ]
        )]
    )
  ]
})
export class ModelsComponent implements OnInit, OnDestroy {

  userModels: ModelStorageData[] = [];
  selectedModel$: Observable<string>;

  constructor(private storeService: StoreService, private store: Store<State>) {
  }

  @Input()
  set models(models: ModelStorageData[]) {
    this.userModels = models;
  }

  ngOnInit() {
    this.subscribeToModelDetailState();
  }

  ngOnDestroy() {

  }

  closeDetailsView() {
    this.store.dispatch(new CloseDetailsAction());
  }

  private subscribeToModelDetailState() {
    this.selectedModel$ = this.storeService.selectModelDetailState()
      .pipe(untilDestroyed(this));
  }
}
