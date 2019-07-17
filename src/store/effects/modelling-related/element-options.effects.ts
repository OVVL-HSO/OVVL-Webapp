import {Injectable} from "@angular/core";
import {Actions, Effect, ofType} from "@ngrx/effects";
import { map, switchMap, take} from "rxjs/operators";

import {DFDComponent} from "../../../models/types/types.model";
import {StorageService} from "../../../services/user-related/storage.service";
import {StoreService} from "../../../services/store.service";
import {INIT_OPTION_VIEW, OpenOptionsViewAction} from "../../actions/modelling-related/element-options.action";
import {DFDElementState} from "../../reducer/modelling-related/dfd-element.reducer";
import {ElementRelationInfo} from "../../../models/modelling-related/base.model";
import {ElementUtil} from "../../../utils/element.util";
import {of} from "rxjs";

@Injectable()
export class ElementOptionsEffects {

  @Effect() initOptionsAction$ = this.action$.pipe(
    ofType(INIT_OPTION_VIEW),
    map((action: any) => action.payload),
    switchMap((dfdEntity: DFDComponent) => {
      return this.storeService.selectElementState()
        .pipe(
          take(1),
          switchMap((dfdElements: DFDElementState) => {
            const connectedElements: ElementRelationInfo
              = ElementUtil.findAllElementsConnectedToAnElement(dfdEntity, dfdElements);
            return of(new OpenOptionsViewAction({connectedElements: connectedElements, elementToBeChanged: dfdEntity}));
          })
        );
    })
  );


  constructor(private action$: Actions,
              private storageService: StorageService,
              private storeService: StoreService) {
  }
}
