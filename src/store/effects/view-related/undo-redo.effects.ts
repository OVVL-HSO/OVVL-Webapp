import {Injectable} from "@angular/core";
import {Actions, Effect, ofType} from "@ngrx/effects";
import {map} from "rxjs/operators";
import {RedrawAllAction} from "../../actions/view-related/redraw.action";
import {ActionTypes} from "redux-undo";

@Injectable()
export class UndoRedoEffects {
  @Effect() undoRedoAction$ = this.action$.pipe(
    ofType(ActionTypes.UNDO, ActionTypes.REDO),
    map(() => new RedrawAllAction())
  );

  constructor(private action$: Actions) {
  }
}
