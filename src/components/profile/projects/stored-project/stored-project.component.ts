import {Component, Input, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {Project} from "../../../../models/user-related/project.model";
import {GeneralUtil} from "../../../../utils/general.util";
import {ShowProjectDetailsAction} from "../../../../store/actions/user-related/profile.action";
import {Store} from "@ngrx/store";
import {State} from "../../../../store";
import {StoreService} from "../../../../services/store.service";
import {Observable} from "rxjs";
import {untilDestroyed} from "ngx-take-until-destroy";

@Component({
  selector: 'app-stored-project',
  templateUrl: './stored-project.component.html',
  styleUrls: ['./stored-project.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class StoredProjectComponent implements OnInit, OnDestroy {
  storedProject: Project;
  selectedProject$: Observable<string>;
  displayedOwnerName = "";

  constructor(private store: Store<State>, private storeService: StoreService) {
  }

  @Input()
  set project(project: Project) {
    this.storedProject = project;
  }

  ngOnInit() {
    this.selectProjectDetailState();
    this.setDisplayedOwnerName();
  }

  ngOnDestroy() {

  }

  getCreationDate() {
    return GeneralUtil.convertUTCToDDMMYYYY(this.storedProject.creationDate);
  }

  showModelDetails() {
    this.store.dispatch(new ShowProjectDetailsAction(this.storedProject.projectID));
  }

  selectProjectDetailState() {
    this.selectedProject$ = this.storeService.selectProjectDetailsState().pipe(untilDestroyed(this));
  }

  private setDisplayedOwnerName() {
    this.storeService.selectUsername()
      .pipe(untilDestroyed(this))
      .subscribe((username: string) => {
        if (this.storedProject.owner === username) {
          this.displayedOwnerName = "you";
        } else {
          this.displayedOwnerName = this.storedProject.owner;
        }
      });
  }
}
