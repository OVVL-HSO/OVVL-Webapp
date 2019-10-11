import {Injectable} from "@angular/core";
import {Actions, Effect, ofType} from "@ngrx/effects";
import {catchError, concatMap, exhaustMap, map, mergeMap, switchMap, take} from "rxjs/operators";
import {
  AuthenticationErrorAction,
  LOAD_PROFILE_DATA,
  LoadProfileDataAction,
  LoadProfileDataCompleteAction,
  LOG_IN,
  LOG_IN_COMPLETE,
  LoginAction,
  LoginCompleteAction, SIGN_OUT,
  SIGN_UP, SignOutCompleteAction,
  SignUpCompleteAction
} from "../../actions/user-related/user.action";
import {UserService} from "../../../services/user-related/user.service";
import {UserLogin, UserSignUp} from "../../../models/user-related/user.model";
import {EMPTY, Observable, of} from "rxjs";
import {Action} from "@ngrx/store";
import {JwtResponse} from "../../../models/user-related/auth.model";
import {SessionStorageService} from "../../../services/session-storage.service";
import {RemoveModalAction} from "../../actions/view-related/modal.action";
import {ModalConfig} from "../../../config/modal.config";
import {Profile} from "../../../models/user-related/profile.model";
import {LoadStoredWorkAction, ResetStorageStateAction} from "../../actions/user-related/storage.action";
import {StoreService} from "../../../services/store.service";
import {CancelProjectCreationAction} from "../../actions/user-related/projects/project-creation.action";
import {ResetProfileStateAction} from "../../actions/user-related/profile.action";
import {SetViewAction} from "../../actions/view-related/view.action";
import {View} from "../../../models/view-related/view.model";
import {LoadUserSettingsAction} from "../../actions/user-related/settings.action";

@Injectable()
export class UserEffects {
  @Effect() signUpAction$ = this.action$.pipe(
    ofType(SIGN_UP),
    map((action: any) => action.payload),
    switchMap((userCredentials: UserSignUp) => {
      return this.userService.signUp(userCredentials)
        .pipe(
          take(1),
          concatMap(() => {
            const userLogin: UserLogin = {username: userCredentials.username, password: userCredentials.password};
            return [new SignUpCompleteAction(), new LoginAction(userLogin)];
          }),
          catchError((error: Error) => UserEffects.createErrorObservableAndLog(error))
        );
    }),
  );
  @Effect() loginAction$ = this.action$.pipe(
    ofType(LOG_IN),
    map((action: any) => action.payload),
    switchMap((userCredentials: UserLogin) => {
      return this.userService.login(userCredentials)
        .pipe(
          take(1),
          exhaustMap((jwtResponse: JwtResponse) => {
            SessionStorageService.storeJWTData(jwtResponse);
            return of(new LoginCompleteAction());
          }),
          catchError((error: Error) => UserEffects.createErrorObservableAndLog(error))
        );
    })
  );

  @Effect() loginCompleteAction$ = this.action$.pipe(
    ofType(LOG_IN_COMPLETE),
    switchMap(() => [new RemoveModalAction(ModalConfig.LOGIN_MODAL), new LoadProfileDataAction(), new LoadStoredWorkAction(), new LoadUserSettingsAction()])
  );

  @Effect() loadUserdataCompleteAction$ = this.action$.pipe(
    ofType(LOAD_PROFILE_DATA),
    mergeMap(() => {
      return this.userService.loadUserData()
        .pipe(
          take(1),
          mergeMap((profileData: Profile) => of(new LoadProfileDataCompleteAction(profileData))),
          catchError((error: Error) => UserEffects.createErrorObservableAndLog(error))
        );
    })
  );


  @Effect() signOutAction$ = this.action$.pipe(
    ofType(SIGN_OUT),
    map((action: any) => action.payload),
    exhaustMap((view: View) => {
      SessionStorageService.signOut();
      return [
        new SetViewAction(view),
        new CancelProjectCreationAction(),
        new ResetStorageStateAction(),
        new ResetProfileStateAction(),
        new SignOutCompleteAction()];
    })
  );

  constructor(private action$: Actions,
              private storeService: StoreService,
              private userService: UserService) {
  }

  private static createErrorObservableAndLog(error): Observable<Action> {
    return of(new AuthenticationErrorAction(error));
  }

}
