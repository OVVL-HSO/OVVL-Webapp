import {Injectable} from "@angular/core";
import {Actions, Effect, ofType} from "@ngrx/effects";
import {ConnectElementsToDataFlowAction} from "../../actions/modelling-related/dfd-element.action";
import {map, switchMap} from "rxjs/operators";
import {DataFlow} from "../../../models/modelling-related/dataflow.model";
import {StoreService} from "../../../services/store.service";
import {of} from "rxjs";
import {DFDElementType} from "../../../models/types/types.model";
import {DataFlowConnectionInfo} from "../../../models/modelling-related/base.model";
import {ADD_DATAFLOW, AddDataFlowAction} from "../../actions/modelling-related/element-add.action";
import {DELETE_DATAFLOW} from "../../actions/modelling-related/element-delete.action";
import {UpdateDFDElementAction} from "../../actions/modelling-related/element-update.action";

@Injectable()
export class DataFlowEffects {

  @Effect() addDataFlowAction$ = this.action$.pipe(
    ofType(ADD_DATAFLOW),
    map((action: AddDataFlowAction) => action.payload),
    map((connectedElements: DataFlowConnectionInfo) =>
      new ConnectElementsToDataFlowAction([connectedElements.startElement.id, connectedElements.endElement.id])
    )
  );


  @Effect() deleteDataFlowAction$ = this.action$.pipe(
    ofType(DELETE_DATAFLOW),
    switchMap((dataFlowID: string) => this.storeService.selectDataFlowByID(dataFlowID).pipe(
      switchMap((dataFlow: DataFlow) => dataFlow ? this.storeService.selectElementsConnectedToDataFlow(dataFlow) : of()),
      map((connectedElements: (DFDElementType)[]) => {
        const updatedActionArray: UpdateDFDElementAction[] = [];
        connectedElements.forEach((dfdElement: DFDElementType) =>
          updatedActionArray.push(new UpdateDFDElementAction({...dfdElement, connectedToDataFlow: false})));
        return updatedActionArray;
      })
    ))
  );

  constructor(private action$: Actions, private storeService: StoreService) {
  }
}
