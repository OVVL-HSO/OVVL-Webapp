import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {CPEITem} from "../../../../models/analysis-related/cpe.model";
import {Store} from "@ngrx/store";
import {State} from "../../../../store";
import {untilDestroyed} from "ngx-take-until-destroy";
import {Observable, Subject} from "rxjs";
import {ResetCPEsAction} from "../../../../store/actions/analysis-related/cpe.action";
import {StoreService} from "../../../../services/store.service";
import {GeneralUtil} from "../../../../utils/general.util";
import {debounceTime, distinctUntilChanged} from "rxjs/operators";
import {CpeUtil} from "../../../../utils/cpe.util";

@Component({
  selector: 'app-cpe-list',
  templateUrl: './cpe-list.component.html',
  styleUrls: ['./cpe-list.component.scss']
})
export class CpeListComponent implements OnInit, OnDestroy {
  foundCPEs: CPEITem[] = [];
  displayedCPEs: CPEITem[] = [];
  currentlyLoading$: Observable<boolean>;
  currentCPE: CPEITem;
  @Output()
  cpeSelection = new EventEmitter();
  @Output()
  reset = new EventEmitter();
  keywordFilter: string;
  filterTerm: Subject<string> = new Subject<string>();
  cpeWasPassed: boolean;

  constructor(private store: Store<State>,
              private storeService: StoreService) {
  }

  @Input()
  set cpeOfCurrentElement(cpe: CPEITem) {
    this.currentCPE = cpe;
    this.setFoundCPEsIfAvailable(this.currentCPE);
  }

  ngOnInit() {
    this.subscribeToFoundCPEs();
    this.subscribeToCPELoadingState();
    this.setFilterObservable();
  }

  ngOnDestroy() {
    this.store.dispatch(new ResetCPEsAction());
  }

  selectCPE(cpeRef: CPEITem) {
    this.displayedCPEs = [cpeRef];
    this.cpeSelection.emit(cpeRef);
  }

  unselectCPE() {
    this.reset.emit();
  }

  toggleCPE(cpe: CPEITem) {
    cpe.selected = !cpe.selected;
  }

  getCPEType(cpe: CPEITem): string {
    return CpeUtil.extractCPEType(cpe);
  }

  setSearchFilter(searchTerm: any) {
    this.filterTerm.next(searchTerm);
  }

  getCPETitle(cpe: CPEITem) {
    return CpeUtil.extractCPEHoverTitle(cpe);
  }

  trackCPEsByFn(index, item: CPEITem) {
    return (item.id);
  }

  private subscribeToFoundCPEs() {
    this.storeService.selectAvailableCPEs()
      .pipe(untilDestroyed(this))
      .subscribe((foundCPEs: CPEITem[]) => this.applyCPEData(foundCPEs));
  }

  private subscribeToCPELoadingState() {
    this.currentlyLoading$ = this.storeService.selectCurrentlyLoadingCPEState().pipe(untilDestroyed(this));
  }

  private setFoundCPEsIfAvailable(cpe: CPEITem) {
    if (cpe) {
      this.cpeWasPassed = true;
      this.foundCPEs = [cpe];
      this.displayedCPEs = this.foundCPEs;
    }
  }

  private applyCPEData(foundCPEs: CPEITem[]) {
    if (foundCPEs.length) {
      this.cpeWasPassed = false;
      this.foundCPEs = foundCPEs;
      this.displayedCPEs = foundCPEs;
    } else if (!this.currentCPE) {
      this.displayedCPEs = [];
    }
  }

  private setFilterObservable() {
    this.filterTerm.pipe(
      debounceTime(300),
      distinctUntilChanged()).subscribe((searchTerm: string) => this.applyFilter(searchTerm));
  }

  private applyFilter(searchTerm: string) {
    const keywordsToFilter = GeneralUtil.splitStringIntoWords(searchTerm.toLowerCase());
    if (!keywordsToFilter[0]) {
      this.displayedCPEs = this.foundCPEs;
    } else {
      this.displayedCPEs = this.foundCPEs.filter((cpe: CPEITem) =>
        !keywordsToFilter.some((keyword: string) => keyword && cpe.title.toLowerCase().indexOf(keyword) > -1));
    }
  }
}
