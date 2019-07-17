import {ApplicationRef, ComponentFactoryResolver, EmbeddedViewRef, Injectable, Injector} from '@angular/core';
import {Modal} from "../../models/view-related/modal.model";
import {LoginComponent} from "../../components/modals/login/login.component";
import {SaveComponent} from "../../components/modals/save/save.component";
import {AlertComponent} from "../../components/modals/alert/alert.component";
import {FeedbackComponent} from "../../components/modals/feedback/feedback.component";
import {MainOptionComponent} from "../../components/modals/option-view/main-options/main-option.component";

@Injectable()
export class DomService {

  private childComponentRef: ComponentData[] = [];

  constructor(private componentFactoryResolver: ComponentFactoryResolver,
              private appRef: ApplicationRef,
              private injector: Injector) {
  }

  addModal(modal: Modal) {
    const componentToBeShown = {
      "login-container": LoginComponent,
      "save-container": SaveComponent,
      "alert-container": AlertComponent,
      "feedback-container": FeedbackComponent,
      "option-container": MainOptionComponent
    }[modal.modalID];
    this.appendComponentToView(componentToBeShown, modal);
  }

  removeModal(deletedModal: Modal) {
    const modalToBeRemoved = this.childComponentRef.find((component: ComponentData) => component.modal.modalID === deletedModal.modalID);
    this.childComponentRef = this.childComponentRef.filter((component: ComponentData) => component.modal.modalID !== deletedModal.modalID);
    if (modalToBeRemoved) {
      this.appRef.detachView(modalToBeRemoved.componentRef.hostView);
      modalToBeRemoved.componentRef.destroy();
    }
  }

  private appendComponentToView(component: any, modal: Modal) {
    // Create a component reference from the component
    const childComponentRef = this.componentFactoryResolver
      .resolveComponentFactory(component)
      .create(this.injector);

    const componentData: ComponentData = {
      modal: modal,
      componentRef: childComponentRef
    };
    this.childComponentRef = [...this.childComponentRef, componentData];
    // Attach component to the appRef so that it's inside the ng component tree
    this.appRef.attachView(childComponentRef.hostView);

    // Get DOM element from component
    const childDomElem = (childComponentRef.hostView as EmbeddedViewRef<any>)
      .rootNodes[0] as HTMLElement;

    // Append DOM element to the body
    document.getElementsByClassName(modal.modalID)[0].appendChild(childDomElem);
  }
}

interface ComponentData {
  modal: Modal;
  componentRef: any;
}
