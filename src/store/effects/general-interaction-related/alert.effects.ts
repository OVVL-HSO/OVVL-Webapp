import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {map} from 'rxjs/operators';
import {AddModalAction, RemoveModalAction} from "../../actions/view-related/modal.action";
import {ModalConfig} from "../../../config/modal.config";
import {CLOSE_ALERT, SHOW_ALERT} from "../../actions/general-interaction-related/alert.action";

@Injectable()
export class AlertEffects {

  @Effect() openElementOptionsAction$ = this.action$.pipe(
    ofType(SHOW_ALERT),
    map(() => new AddModalAction(ModalConfig.ALERT_MODAL))
  );

  @Effect() closeElementOptionsAction$ = this.action$.pipe(
    ofType(CLOSE_ALERT),
    map(() => new RemoveModalAction(ModalConfig.ALERT_MODAL))
  );

  constructor(private action$: Actions) {
  }
}
