import { Component, Input, OnInit } from '@angular/core';
import {Settings} from "../../../models/user-related/settings.model";
import {Store} from "@ngrx/store";
import {State} from "../../../store";
import {ShowAlertAction} from "../../../store/actions/general-interaction-related/alert.action";
import {SaveSettingsAction, ToggleThemeAction} from "../../../store/actions/user-related/settings.action";
import {AlertType} from "../../../models/alert.model";
import {StoreService} from "../../../services/store.service";
import {untilDestroyed} from "ngx-take-until-destroy";
import {Observable} from "rxjs";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})


export class SettingsComponent implements OnInit {
  userSettings: Settings;

  @Input()
  set settings(settings: Settings) {

  }

  constructor(private store: Store<State>, private storeService: StoreService) {
  }

  toggleTheme() {
    this.store.dispatch(new ToggleThemeAction());
  }

  saveSettings() {
    this.store.dispatch(new SaveSettingsAction(this.userSettings));
  }

  ngOnInit() {
    this.subscribeToSettingsState();
  }

  getSelectedThemeName() {
    if (this.userSettings.darktheme) {
      return "Dark theme";
    } else {
      return "Light theme";
    }
  }

  getSelectableThemeName() {
    if (this.userSettings.darktheme) {
      return "Light theme";
    } else {
      return "Dark theme";
    }
  }

  ngOnDestroy() {

  }


  private subscribeToSettingsState() {
    this.storeService.selectUserSettings().pipe(untilDestroyed(this))
      .subscribe((settings: Settings) => this.userSettings = settings);

  }


}
