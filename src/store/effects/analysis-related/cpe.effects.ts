import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {catchError, map, switchMap, take} from 'rxjs/operators';
import {Observable, of} from 'rxjs';
import {Action} from '@ngrx/store';
import {ErrorSearchingCPEAction, SEARCH_CPE, SearchCPECompleteAction} from "../../actions/analysis-related/cpe.action";
import {CpeCveService} from "../../../services/analysis-related/cpe-cve.service";
import {CPEITem} from "../../../models/analysis-related/cpe.model";

@Injectable()
export class CPEEffects {
  @Effect() searchCPEAction$ = this.action$.pipe(
    ofType(SEARCH_CPE),
    map((action: any) => action.payload),
    switchMap((searchTerm: string) => this.cpeService.searchForCPE(searchTerm)
      .pipe(
        take(1),
        map((cpes: CPEITem[]) => new SearchCPECompleteAction(cpes)),
        catchError((error: Error) => this.createErrorObservableAndLog(error))
      ))
  );

  constructor(private action$: Actions,
              private cpeService: CpeCveService) {
  }

  private createErrorObservableAndLog(error): Observable<Action> {
    console.error(error);
    return of(new ErrorSearchingCPEAction());
  }
}
