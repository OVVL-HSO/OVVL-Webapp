import {Injectable} from "@angular/core";
import {Actions, Effect, ofType} from "@ngrx/effects";
import {catchError, map, switchMap, take} from "rxjs/operators";
import {SettingsService} from "../../../services/user-related/settings.service";
import {Settings} from "../../../models/user-related/settings.model";
import {Observable, of} from "rxjs";
import {Action} from "@ngrx/store";

import {
  LOAD_USER_SETTINGS,
  LoadUserSettingsCompleteAction,
  SAVE_SETTINGS,
  SaveSettingsCompleteAction,
  SaveSettingsErrorAction
} from "../../actions/user-related/settings.action";

@Injectable()
export class SettingsEffects {
  @Effect() saveSettingsAction$ = this.action$.pipe(
    ofType(SAVE_SETTINGS),
    map((action: any) => action.payload),
    switchMap((userSettings: Settings) => {
      return this.settingsService.saveSettings(userSettings)
        .pipe(
          take(1),
          map(() => new SaveSettingsCompleteAction()),
          catchError((error: Error) => SettingsEffects.createErrorObservableAndLog(error))
        );
    }),
  );

  @Effect() loadSettingsAction$ = this.action$.pipe(
    ofType(LOAD_USER_SETTINGS),
    switchMap(() => {
      return this.settingsService.loadSettings()
        .pipe(
          map((settings: Settings) => new LoadUserSettingsCompleteAction(settings)),
          catchError((error: Error) => SettingsEffects.createErrorObservableAndLog(error))
        );
    })
  );
  constructor(private action$: Actions,
              private settingsService: SettingsService) {
  }

  private static createErrorObservableAndLog(error): Observable<Action> {
    return of(new SaveSettingsErrorAction(error));
  }

}
