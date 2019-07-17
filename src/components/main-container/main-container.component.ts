import {Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {State} from '../../store';
import {Store} from '@ngrx/store';
import {DataFlowService} from '../../services/modelling-related/data-flow.service';
import {ModalService} from '../../services/view-related/modal.service';
import * as Konva from "konva";
import {View, ViewState} from "../../models/view-related/view.model";
import {untilDestroyed} from "ngx-take-until-destroy";
import {KonvaGeneralUtil} from "../../utils/konva/konva-general.util";
import {StoreService} from "../../services/store.service";
import {Images} from "../../models/view-related/image.model";
import {Observable} from "rxjs";
import {GeneralUtil} from "../../utils/general.util";
import {Modal} from "../../models/view-related/modal.model";
import {RemoveModalAction} from "../../store/actions/view-related/modal.action";
import {SessionStorageService} from "../../services/session-storage.service";
import {LoadProfileDataAction} from "../../store/actions/user-related/user.action";
import {LoadStoredWorkAction} from "../../store/actions/user-related/storage.action";
import {RedrawAllAction} from "../../store/actions/view-related/redraw.action";

@Component({
  selector: 'app-main-container',
  templateUrl: './main-container.component.html',
  styleUrls: ['./main-container.component.scss']
})
export class MainContainerComponent implements OnInit, OnDestroy {
  @ViewChild('drawingStageContainer') drawingStageContainer: ElementRef;
  @ViewChild('freeDrawingStageContainer') freeDrawingStageContainer: ElementRef;

  designViewShown: boolean;
  analysisViewShown: boolean;
  landingViewShown: boolean;
  profileViewShown: boolean;
  drawingStage: Konva.Stage;
  freeDrawStage: Konva.Stage;
  images: Images = GeneralUtil.createEmptyImagesObject();
  isLoading$: Observable<boolean>;
  $activeModals: Observable<Modal[]>;
  private currentView: View;

  @HostListener('window:resize', ['$event'])
  onResize() {
    KonvaGeneralUtil.changeWidthAndHeightOfDrawingStage(this.drawingStage);
    KonvaGeneralUtil.changeWidthAndHeightOfDrawingStage(this.freeDrawStage);
    this.store.dispatch(new RedrawAllAction());
  }

  constructor(private store: Store<State>,
              private dataFlowService: DataFlowService,
              private storeService: StoreService,
              private modalService: ModalService) {
  }

  ngOnDestroy() {
    this.drawingStage.destroy();
  }

  ngOnInit() {
    this.preventContextMenuInApplication();
    this.subscribeToShownViewState();
    this.createDrawingStages();
    this.subscribeToLoading();
    this.loadImages();
    this.subscribeToActiveModals();
    this.loadUserData();
    this.modalService.initModalSubscription();
  }

  getDrawingStageClass() {
    if (this.designViewShown) {
      return '';
    } else if (this.landingViewShown) {
      return 'hidden';
    } else {
      return 'analysis-view';
    }
  }

  loadASingleImage(imageSource: string) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = imageSource;
      if (image.complete) {
        resolve(image);
      } else {
        image.onerror = () => {
          reject(imageSource);
        };
        image.onload = () => {
          resolve(image);
          image.onload = null;
        };
      }
    });
  }

  removeLastModal(modalToBeclosed: Modal) {
    this.store.dispatch(new RemoveModalAction(modalToBeclosed));
  }

  private createDrawingStages() {
    this.drawingStage = KonvaGeneralUtil.createStage(this.drawingStageContainer, true);
    this.freeDrawStage = KonvaGeneralUtil.createStage(this.freeDrawingStageContainer, false);
  }

  private subscribeToLoading() {
    this.isLoading$ = this.storeService.selectAnalysingState().pipe(untilDestroyed(this));
  }

  private subscribeToShownViewState() {
    this.storeService.selectViewState()
      .pipe(untilDestroyed(this))
      .subscribe((shownView: ViewState) => this.showCurrentView(shownView.currentView));
  }

  private showCurrentView(currentView: View) {
    if (this.currentView !== currentView) {
      if (this.currentView !== currentView) {
        this.currentView = currentView;
        this.landingViewShown = currentView === View.LANDING;
        this.designViewShown = currentView === View.DESIGN;
        this.analysisViewShown = currentView === View.ANALYSIS;
        this.profileViewShown = currentView === View.PROFILE;
      }
    }
  }

  private preventContextMenuInApplication() {
    window.addEventListener('contextmenu', (e: any) => {
      e.preventDefault();
    });
  }

  private loadImages() {
    this.loadASingleImage('../assets/interactor-normal.png')
      .then((interactorImage: HTMLImageElement) => {
        this.images.elementImages.interactorImage = interactorImage;
        return this.loadASingleImage('../assets/process-normal.png');
      })
      .then((processImage: HTMLImageElement) => {
        this.images.elementImages.processImage = processImage;
        return this.loadASingleImage('../assets/datastore-normal.png');
      })
      .then((dataStoreImage: HTMLImageElement) => {
        this.images.elementImages.dataStoreImage = dataStoreImage;
        return this.loadASingleImage('../assets/deleteSmall.png');
      })
      .then((deleteImage: HTMLImageElement) => {
        this.images.deleteImages.deleteImage = deleteImage;
        return this.loadASingleImage('../assets/deleteHoverSmall.png');
      })
      .then((deleteHoverImage: HTMLImageElement) => {
        this.images.deleteImages.deleteHoverImage = deleteHoverImage;
        return this.loadASingleImage('../assets/dftip.png');
      })
      .then((dataFlowTip: HTMLImageElement) => {
        this.images.dataFlowTip = dataFlowTip;
      })
      .catch((imageSource: string) => {
        console.error("Error loading image " + imageSource);
      });
  }

  private subscribeToActiveModals() {
    this.$activeModals = this.storeService.selectModalState().pipe(untilDestroyed(this));
  }

  private loadUserData() {
    if (SessionStorageService.isSignedIn()) {
      this.store.dispatch(new LoadProfileDataAction());
      this.store.dispatch(new LoadStoredWorkAction());
    }
  }
}
