import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {map, switchMap, take} from 'rxjs/operators';
import {StoreService} from "../../../services/store.service";
import {DataFlow} from "../../../models/modelling-related/dataflow.model";
import {CLOSE_OPTIONS_VIEW, CloseOptionsViewAction, OPEN_OPTIONS_VIEW} from "../../actions/modelling-related/element-options.action";
import {EMPTY, from, of} from "rxjs";
import {UnselectAllDFDElementsAction} from "../../actions/modelling-related/dfd-element.action";
import {TOGGLE_BOUNDARY_DRAWING, TOGGLE_DATAFLOW_DRAWING} from "../../actions/general-interaction-related/toolbar.action";
import {ChangeDataFlowPositionsAction, UPDATE_DRAG_ELEMENT, UpdateDFDElementAction} from "../../actions/modelling-related/element-update.action";
import {ADD_BOUNDARY, ADD_ELEMENT} from "../../actions/modelling-related/element-add.action";
import {DELETE_BOUNDARY, DELETE_DATAFLOW, DELETE_ELEMENT, DeleteDataFlowAction} from "../../actions/modelling-related/element-delete.action";
import {AddModalAction, RemoveModalAction} from "../../actions/view-related/modal.action";
import {ModalConfig} from "../../../config/modal.config";

@Injectable()
export class DfdElementEffects {
  @Effect() updateDFDElementPositionAction$ = this.action$.pipe(
    ofType(UPDATE_DRAG_ELEMENT),
    switchMap((action: UpdateDFDElementAction) => {
      if (action.payload.connectedToDataFlow) {
        return this.createChangeDataFlowPositionAction(action);
      } else {
        return EMPTY;
      }
    })
  );

  @Effect() openElementOptionsAction$ = this.action$.pipe(
    ofType(OPEN_OPTIONS_VIEW),
    map(() => new AddModalAction(ModalConfig.OPTION_MODAL))
  );

  @Effect() closeElementOptionsAction$ = this.action$.pipe(
    ofType(CLOSE_OPTIONS_VIEW),
    map(() => new RemoveModalAction(ModalConfig.OPTION_MODAL))
  );

  @Effect() addElementAndToggleAction$ = this.action$.pipe(
    ofType(ADD_ELEMENT, ADD_BOUNDARY, TOGGLE_BOUNDARY_DRAWING, TOGGLE_DATAFLOW_DRAWING),
    map(() => new UnselectAllDFDElementsAction())
  );

  @Effect() deleteElementAction$ = this.action$.pipe(
    ofType(DELETE_ELEMENT),
    map((action: any) => action.payload),
    switchMap((elementID: string) => this.storeService.selectDataFlowsConnectedToAnElement(elementID).pipe(
      take(1),
      switchMap((dataFlows: DataFlow[]) => from(dataFlows)),
      map((dataFlow: DataFlow) => new DeleteDataFlowAction(dataFlow.id))
    ))
  );

  @Effect() closeOptionsAfterDeleting = this.action$.pipe(
    ofType(DELETE_ELEMENT, DELETE_DATAFLOW, DELETE_BOUNDARY), // FIXME: When Dataflow is duplex, the second one stays small after deletion
    map(() => new CloseOptionsViewAction()));

  constructor(private action$: Actions, private storeService: StoreService) {
  }

  private createChangeDataFlowPositionAction(action) {
    return of(new ChangeDataFlowPositionsAction({
      id: action.payload.id,
      coordinates: {...action.payload.coordinates},
      type: action.payload.genericType
    }));
  }
}
