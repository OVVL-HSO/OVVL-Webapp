import {Injectable} from "@angular/core";
import {Actions, Effect, ofType} from "@ngrx/effects";
import {map, switchMap, take} from "rxjs/operators";
import {ERROR_LOADING_INVITATIONS, ERROR_LOADING_STORED_WORK} from "../actions/user-related/storage.action";
import {
  ERROR_DECLINING_INVITATION,
  ERROR_INVITING_USER,
  ERROR_JOINING_PROJECT
} from "../actions/user-related/projects/project-invitation.action";
import {ERROR_LEAVING_PROJECT} from "../actions/user-related/projects/project-leave.action";
import {ERROR_DELETING_PROJECT} from "../actions/user-related/projects/project-delete.action";
import {ERROR_LINKING_MODEL, ERROR_UNLINKING_MODEL} from "../actions/user-related/projects/project-link.action";
import {ERROR_CREATING_PROJECT} from "../actions/user-related/projects/project-creation.action";
import {ERROR_DELETING_DFD, ERROR_LOADING_DFD, ERROR_SAVING_DFD} from "../actions/modelling-related/dfd-model.action";
import {ERROR_SEARCHING_CPE} from "../actions/analysis-related/cpe.action";
import {ERROR_ANALYZING_THREAT_MODEL} from "../actions/analysis-related/analysis.action";
import {SignOutAction} from "../actions/user-related/user.action";
import {EMPTY, of} from "rxjs";
import {StoreService} from "../../services/store.service";
import {View} from "../../models/view-related/view.model";

@Injectable()
export class ErrorEffects {

  @Effect() errorEffects$ = this.action$.pipe(
    ofType(
      ERROR_JOINING_PROJECT,
      ERROR_LEAVING_PROJECT,
      ERROR_LOADING_INVITATIONS,
      ERROR_INVITING_USER,
      ERROR_DELETING_PROJECT,
      ERROR_LINKING_MODEL,
      ERROR_UNLINKING_MODEL,
      ERROR_CREATING_PROJECT,
      ERROR_DELETING_DFD,
      ERROR_SEARCHING_CPE,
      ERROR_SAVING_DFD,
      ERROR_ANALYZING_THREAT_MODEL,
      ERROR_LOADING_DFD,
      ERROR_DECLINING_INVITATION,
      ERROR_LOADING_STORED_WORK),
    map((action: any) => action.error.error),
    switchMap((error: any) => {
      return this.storeService.selectCurrentViewState().pipe(
        take(1),
        switchMap((view: View) => {
          if (error.message.indexOf("JWT expired") > -1) {
            // If the token expires while the user is not on their profile, we want to switch to the analysis view so their work isnt delted
            // Otherwise, we just stay on the landing page
            return view === View.LANDING ? of(new SignOutAction(View.LANDING)) : of(new SignOutAction(View.DESIGN));
          } else {
            return EMPTY;
          }
        })
      );
    }));

  constructor(private action$: Actions, private storeService: StoreService) {
  }
}
