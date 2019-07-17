import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {map} from 'rxjs/operators';
import {HIGHLIGHT_ELEMENT, UNSELECT_ALL_ELEMENTS} from "../../actions/modelling-related/dfd-element.action";
import {RedrawAction, RedrawAllAction} from "../../actions/view-related/redraw.action";
import {SET_VIEW} from "../../actions/view-related/view.action";
import {ADD_DATAFLOW} from "../../actions/modelling-related/element-add.action";
import {CHANGE_DATAFLOW_POSITION, UPDATE_BOUNDARY, UPDATE_DATAFLOW, UPDATE_ELEMENT} from "../../actions/modelling-related/element-update.action";
import {DELETE_BOUNDARY, DELETE_DATAFLOW, DELETE_ELEMENT} from "../../actions/modelling-related/element-delete.action";

@Injectable()
export class RedrawEffects {

  @Effect() redrawAction$ = this.action$.pipe(
    ofType(UPDATE_ELEMENT, HIGHLIGHT_ELEMENT),
    map((action: any) => new RedrawAction(action.payload.id)));

  @Effect() redrawAllAction$ = this.action$.pipe(
    ofType(
      DELETE_ELEMENT,
      DELETE_DATAFLOW,
      // TODO: Remove Redraw all for data flow updates, find elements instead and update accordingly
      UPDATE_DATAFLOW,
      CHANGE_DATAFLOW_POSITION,
      DELETE_BOUNDARY,
      SET_VIEW,
      UNSELECT_ALL_ELEMENTS,
      ADD_DATAFLOW,
      UPDATE_BOUNDARY),
    map(() => new RedrawAllAction()));

  constructor(private action$: Actions) {
  }
}
