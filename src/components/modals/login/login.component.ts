import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {Store} from "@ngrx/store";
import {State} from "../../../store";
import {UserLogin, UserSignUp} from "../../../models/user-related/user.model";
import {LoginAction, SignUpAction} from "../../../store/actions/user-related/user.action";
import {RegexUtil} from "../../../utils/regex.util";
import {StoreService} from "../../../services/store.service";
import {untilDestroyed} from "ngx-take-until-destroy";
import {Observable} from "rxjs";
import {RemoveModalAction} from "../../../store/actions/view-related/modal.action";
import {ModalConfig} from "../../../config/modal.config";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit, OnDestroy {

  loginSelected = true;
  username: string;
  password = "";
  email: string;
  authenticating$: Observable<boolean>;
  emailTaken: boolean;
  usernameTaken: boolean;
  passwordUnsafe: boolean;
  somethingIsWeird: boolean;

  constructor(private store: Store<State>,
              private storeService: StoreService) {
  }

  ngOnInit() {
    this.subscribeToAuthState();
    this.subscribeToAuthErrorState();
  }

  ngOnDestroy() {
  }


  switchBetweenLoginAndSignUp() {
    this.loginSelected = !this.loginSelected;
  }

  confirm(formValid: boolean) {
    if (this.loginSelected && formValid) {
      this.login();
    } else if (!this.loginSelected && formValid && this.fulfillsPasswordValidation()) {
      this.signup();
    }
  }

  cancel() {
    this.store.dispatch(new RemoveModalAction(ModalConfig.LOGIN_MODAL));
  }

  fulfillsPasswordValidation() {
    return this.password.length > 7 && this.hasUpperAndLowerCaseLetter() && this.hasSpecialCharOrNumber();
  }

  hasUpperAndLowerCaseLetter() {
    return RegexUtil.hasUppercaseLetter(this.password) && RegexUtil.hasLowercaseLetter(this.password);
  }

  hasSpecialCharOrNumber() {
    return RegexUtil.hasSpecialCharOrNumber(this.password);
  }

  getPasswordValidationHighlightClass() {
    if (this.password.length < 1) {
      return '';
    } else if (!this.fulfillsPasswordValidation()) {
      return 'invalid';
    } else {
      return 'valid';
    }
  }

  private signup() {
    const userCredentials: UserSignUp = {
      username: this.username,
      password: this.password,
      email: this.email
    };
    this.store.dispatch(new SignUpAction(userCredentials));
  }

  private login() {
    const userCredentials: UserLogin = {
      username: this.username,
      password: this.password,
    };
    this.store.dispatch(new LoginAction(userCredentials));
  }

  private subscribeToAuthState() {
    this.authenticating$ = this.storeService.selectAuthenticatingState().pipe(untilDestroyed(this));
  }

  private subscribeToAuthErrorState() {
    this.storeService.selectAuthErrorState().pipe(untilDestroyed(this))
      .subscribe((error: any) => {
        this.resetErrors();
        if (error && error.error && error.error.message) {
          if (error.error.message.indexOf("Username is already taken") > -1) {
            this.usernameTaken = true;
          } else if (error.error.message.indexOf("Email is already in use") > -1) {
            this.emailTaken = true;
          } else if (error.error.message.indexOf("Please try a different password") > -1) {
            this.passwordUnsafe = true;
          } else {
            this.somethingIsWeird = true;
          }
        }
      });
  }

  private resetErrors() {
    this.emailTaken = false;
    this.usernameTaken = false;
    this.passwordUnsafe = false;
    this.somethingIsWeird = false;
  }
}

