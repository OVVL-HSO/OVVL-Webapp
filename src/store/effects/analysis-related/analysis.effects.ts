import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {catchError, map, mergeMap, switchMap, take} from 'rxjs/operators';
import {
  ANALYZE_THREAT_MODEL,
  AnalyzeThreatModelCompleteAction,
  ErrorAnalyzingThreatModelAction,
  UPDATE_THREAT_DATA,
  UpdateThreatDataCompleteAction
} from '../../actions/analysis-related/analysis.action';
import {EMPTY, Observable, of} from 'rxjs';
import {Action} from '@ngrx/store';
import {ThreatModelService} from '../../../services/analysis-related/threat-model.service';
import {AnalysisUtils} from '../../../utils/analysis/analysis.util';
import {SetViewAction} from "../../actions/view-related/view.action";
import {View} from "../../../models/view-related/view.model";
import {DFDModelDTO} from "../../../models/modelling-related/dfd.model";
import {SetModelIDAction, UnselectAllDFDElementsAction} from "../../actions/modelling-related/dfd-element.action";
import {StoreService} from "../../../services/store.service";
import {CpeCveService} from "../../../services/analysis-related/cpe-cve.service";
import {DFDElementState} from "../../reducer/modelling-related/dfd-element.reducer";
import {AnalysisResult} from "../../../models/analysis-related/analysis.model";
import {Threat} from "../../../models/analysis-related/threat.model";

@Injectable()
export class AnalysisEffects {

  @Effect() analyzeThreatModelAction$ = this.action$.pipe(
    ofType(ANALYZE_THREAT_MODEL),
    switchMap(() => this.storeService.selectElementState()
      .pipe(
        take(1),
        switchMap((threatModel: DFDElementState) => {
          const threatModelDTO: DFDModelDTO = AnalysisUtils.convertDFDStateToDFDDTO(threatModel);
          return this.threatModelService.analyzeDFDModelForThreats(threatModelDTO)
            .pipe(
              mergeMap((analysisResult: AnalysisResult) => {
                return [
                  new AnalyzeThreatModelCompleteAction(analysisResult),
                  new SetModelIDAction(analysisResult.modelID),
                  new UnselectAllDFDElementsAction(),
                  new SetViewAction(View.ANALYSIS)
                ];
              })
            );
        }),
        catchError((error: Error) => AnalysisEffects.createErrorObservableAndLog(error))
      ))
  );

  @Effect() updateThreatDataAction$ = this.action$.pipe(
    ofType(UPDATE_THREAT_DATA),
    map((action: any) => action.payload),
    mergeMap((threat: Threat) => {
      return this.threatModelService.updateThreatData(threat).pipe(
        map(() => new UpdateThreatDataCompleteAction()),
        catchError((error: Error) => {
          console.error(error);
          return EMPTY;
        })
      );
    })
  );

  constructor(private action$: Actions,
              private threatModelService: ThreatModelService,
              private cpeCveService: CpeCveService,
              private storeService: StoreService) {
  }

  private static createErrorObservableAndLog(error): Observable<Action> {
    console.error(error);
    return of(new ErrorAnalyzingThreatModelAction(error));
  }
}
