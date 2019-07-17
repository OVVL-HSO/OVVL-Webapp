import {Injectable, OnDestroy} from '@angular/core';
import {DomService} from './dom.service';
import {StoreService} from "../store.service";
import {untilDestroyed} from "ngx-take-until-destroy";
import {Modal} from "../../models/view-related/modal.model";
import {delay, skip} from "rxjs/operators";

@Injectable()
export class ModalService implements OnDestroy {

  private currentlyActiveModals: Modal[] = [];

  constructor(private domService: DomService, private storeService: StoreService) {
  }

  ngOnDestroy() {
  }

  initModalSubscription() {
    this.storeService.selectModalState()
    // We skip the first because it's empty, and set a delay of 10 so the view has time to refresh
      .pipe(untilDestroyed(this), skip(1), delay(10))
      .subscribe((modals: Modal[]) => this.addOrRemoveShownModals(modals));
  }

  private addOrRemoveShownModals(modals: Modal[]) {
    // If the new modal state is longer than the amount of modals stored here...
    if (modals.length > this.currentlyActiveModals.length) {
      this.addModal(modals);
    } else {
      this.removeModal(modals);
    }
    this.currentlyActiveModals = modals;
  }

  private findModalWhichExistsInOneArrayButNotTheOther(modalArrayToBeChecked: Modal[], modals: Modal[]): Modal {
    return modalArrayToBeChecked.find((modal: Modal) => !modals.includes(modal));
  }

  private addModal(modals: Modal[]) {
    const newModal: Modal = this.findModalWhichExistsInOneArrayButNotTheOther(modals, this.currentlyActiveModals);
    this.domService.addModal(newModal);
  }

  private removeModal(modals: Modal[]) {
    const modalToBeRemoved: Modal = this.findModalWhichExistsInOneArrayButNotTheOther(this.currentlyActiveModals, modals);
    if (modalToBeRemoved) {
      this.domService.removeModal(modalToBeRemoved);
    }
  }
}
