import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Store} from "@ngrx/store";
import {State} from "../../store";
import {SetViewAction} from "../../store/actions/view-related/view.action";
import {View} from "../../models/view-related/view.model";
import {SessionStorageService} from "../../services/session-storage.service";
import {StoreService} from "../../services/store.service";
import {untilDestroyed} from "ngx-take-until-destroy";
import {AddModalAction} from "../../store/actions/view-related/modal.action";
import {ModalConfig} from "../../config/modal.config";
import {Settings} from "../../models/user-related/settings.model";

@Component({
  selector: 'app-landing-view',
  templateUrl: './landing-view.component.html',
  styleUrls: ['./landing-view.component.scss']
})
export class LandingViewComponent implements OnInit, OnDestroy {
  @ViewChild('gradientButton') el: ElementRef;
  showDefaultLogo = true;
  private showLandingView = true;
  private hoveringOnLogo = false;

  constructor(private store: Store<State>, private storeService: StoreService) {
  }

  ngOnInit() {
    this.subscribeToViewState();
  }

  ngOnDestroy() {
  }

  createThreatModel() {
    this.store.dispatch(new SetViewAction(View.DESIGN));
  }

  loadThreatModel() {
    if (!SessionStorageService.isSignedIn()) {
      this.store.dispatch(new AddModalAction(ModalConfig.LOGIN_MODAL));
    } else {
      this.store.dispatch(new AddModalAction(ModalConfig.STORAGE_MODAL));
    }
  }

  createGradient(event) {
    const x = event.pageX - this.el.nativeElement.offsetLeft;
    const y = event.pageY - this.el.nativeElement.offsetTop;
    this.el.nativeElement.style.setProperty('--x', x + 'px');
    this.el.nativeElement.style.setProperty('--y', y + 'px');
  }

  logoHover() {
    this.logoBlinkToggle();
    this.hoveringOnLogo = !this.hoveringOnLogo;
  }

  logoBlinkToggle() {
    this.showDefaultLogo = !this.showDefaultLogo;
  }

  private startLogoBlinkTimer() {
    // Interval for the recursive loop
    const randomLoopInterval = Math.round(Math.random() * (8000 - 3500)) + 2000;
    // Interval defining how long the logo is "blinking"
    const randomBlinkInterval = Math.round(Math.random() * (500 - 150)) + 150;
    setTimeout(() => {
      // Only execute the timeout logic if the user is currently not hovering on the logo
      // If he is, the eyes have to be closed
      if (!this.hoveringOnLogo) {
        // Blink
        this.showDefaultLogo = false;
        setTimeout(() => {
          // We check the same condition again, because the timeout might have started before the user hovered on the logo
          if (!this.hoveringOnLogo) {
            this.showDefaultLogo = true;
          }
        }, randomBlinkInterval);
      }
      // Only continue the timer if the landing page is shown
      if (this.showLandingView) {
        this.startLogoBlinkTimer();
      }
    }, randomLoopInterval);
  }

  private subscribeToViewState() {
    this.storeService.selectCurrentViewState()
      .pipe(untilDestroyed(this))
      .subscribe((view: View) => {
        if (view === View.LANDING) {
          this.showLandingView = true;
          this.startLogoBlinkTimer();
        } else {
          this.showLandingView = false;
        }
      });
  }
}
