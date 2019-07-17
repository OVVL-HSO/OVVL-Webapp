import {Modal} from "../models/view-related/modal.model";

export class ModalConfig {
  static readonly OPTION_MODAL: Modal = {modalID: 'option-container'};
  static readonly LOGIN_MODAL: Modal = {modalID: 'login-container'};
  static readonly STORAGE_MODAL: Modal = {modalID: 'save-container'};
  static readonly ALERT_MODAL: Modal = {modalID: 'alert-container'};
  static readonly FEEDBACK_MODAL: Modal = {modalID: 'feedback-container'};
}
