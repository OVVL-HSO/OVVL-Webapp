import {Injectable} from "@angular/core";
import {Actions, Effect, ofType} from "@ngrx/effects";
import {map} from "rxjs/operators";
import {SetZoomEnabledAction} from "../../actions/view-related/view.action";
import {ADD_MODAL, REMOVE_MODAL} from "../../actions/view-related/modal.action";

@Injectable()
export class ViewEffects {

  @Effect() openModalAction$ = this.action$.pipe(
    ofType(ADD_MODAL),
    map(() => new SetZoomEnabledAction(false))
  );

  // TODO: ONLY WHEN LAST MODAL REMOVED
  @Effect() closeModalAction$ = this.action$.pipe(
    ofType(REMOVE_MODAL),
    map(() => new SetZoomEnabledAction(true))
  );

  constructor(private action$: Actions) {
  }
}
