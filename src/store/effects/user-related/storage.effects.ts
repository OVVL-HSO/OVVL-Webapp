import {Injectable} from "@angular/core";
import {Actions, Effect, ofType} from "@ngrx/effects";
import {catchError, map, mergeMap, switchMap} from "rxjs/operators";
import {
  ErrorLoadingInvitationsAction,
  ErrorLoadingStoredWorkAction,
  LOAD_INVITES,
  LOAD_STORED_WORK, LoadInvitesAction, LoadInvitesCompleteAction, LoadStoredWorkAction,
  LoadStoredWorkCompleteAction,
} from "../../actions/user-related/storage.action";
import {Observable, of} from "rxjs";
import {Action} from "@ngrx/store";
import {StoredWork} from "../../../models/user-related/storage.model";
import {StorageService} from "../../../services/user-related/storage.service";
import {Invitation} from "../../../models/user-related/invitation.model";

@Injectable()
export class StorageEffects {

  @Effect() loadStoredWork$ = this.action$.pipe(
    ofType(LOAD_STORED_WORK),
    switchMap(() => {
      return this.storageService.loadStoredWork()
        .pipe(
          mergeMap((storageData: StoredWork) => [new LoadStoredWorkCompleteAction(storageData), new LoadInvitesAction()]),
          catchError((error: Error) => this.createErrorObservableAndLog(error, "work"))
        );
    })
  );

  @Effect() loadInvites$ = this.action$.pipe(
    ofType(LOAD_INVITES),
    switchMap(() => {
      return this.storageService.loadInvites()
        .pipe(
          map((invites: Invitation[]) => new LoadInvitesCompleteAction(invites)),
          catchError((error: Error) => this.createErrorObservableAndLog(error, "invite"))
        );
    })
  );

  constructor(private action$: Actions,
              private storageService: StorageService) {
  }

  private createErrorObservableAndLog(error, origin: "work" | "invite"): Observable<Action> {
    if (origin === "work") {
      return of(new ErrorLoadingStoredWorkAction(error));
    }
    return of(new ErrorLoadingInvitationsAction(error));
  }
}
