import {Component, Input, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {Project} from "../../../models/user-related/project.model";
import {Store} from "@ngrx/store";
import {State} from "../../../store";
import {StoreService} from "../../../services/store.service";
import {CloseDetailsAction} from "../../../store/actions/user-related/profile.action";
import {untilDestroyed} from "ngx-take-until-destroy";
import {Observable} from "rxjs";
import {animate, style, transition, trigger} from "@angular/animations";
import {InitProjectCreationAction} from "../../../store/actions/user-related/projects/project-creation.action";

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
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
export class ProjectsComponent implements OnInit, OnDestroy {

  userProjects: Project[] = [];
  creatingProject$: Observable<boolean>;
  selectedProject$: Observable<string>;

  constructor(private store: Store<State>, private storeService: StoreService) {
  }

  @Input()
  set projects(projects: Project[]) {
    this.userProjects = projects;
  }

  ngOnInit() {
    this.subscribeToProjectCreationState();
    this.subscribeToProjectDetailState();
  }

  ngOnDestroy() {
  }

  startProjectCreation() {
    this.store.dispatch(new InitProjectCreationAction());
  }

  closeDetailsView() {
    this.store.dispatch(new CloseDetailsAction());
  }

  private subscribeToProjectDetailState() {
    this.selectedProject$ = this.storeService.selectProjectDetailsState()
      .pipe(untilDestroyed(this));
  }

  private subscribeToProjectCreationState() {
    this.creatingProject$ = this.storeService.selectProjectCreationState().pipe(untilDestroyed(this));
  }
}
