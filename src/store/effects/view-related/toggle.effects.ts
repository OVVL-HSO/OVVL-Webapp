import {Actions, Effect, ofType} from "@ngrx/effects";
import {map} from "rxjs/operators";
import {Injectable} from "@angular/core";
import {ToggleStageDraggability} from "../../actions/view-related/view.action";
import {TOGGLE_BOUNDARY_DRAWING, TOGGLE_DATAFLOW_DRAWING} from "../../actions/general-interaction-related/toolbar.action";

@Injectable()
export class ToggleEffects {
  @Effect() addElementAndToggleAction$ = this.action$.pipe(
    ofType(TOGGLE_BOUNDARY_DRAWING, TOGGLE_DATAFLOW_DRAWING),
    map(() => new ToggleStageDraggability())
  );

  constructor(private action$: Actions) {
  }
}
