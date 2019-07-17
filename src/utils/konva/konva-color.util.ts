import {GenericElementType} from "../../models/modelling-related/base.model";

export class KonvaColorUtil {
  static getElementShapeHEXColor(elementType: GenericElementType, highlighted: boolean): string {
    switch (elementType) {
      case GenericElementType.INTERACTOR:
        return this.getInteractorShapeHEXColor(highlighted);
      case GenericElementType.PROCESS:
        return this.getProcessShapeHEXColor(highlighted);
      case GenericElementType.DATASTORE:
        return this.getDataStoreShapeHEXColor(highlighted);
      case GenericElementType.DATAFLOW:
        return this.getDataFlowShapeHEXColor();
      case GenericElementType.TRUST_BOUNDARY:
        return this.getTrustBoundaryShapeHEXColor();
      default:
        break;
    }
  }

  static getElementStrokeColor(elementType: GenericElementType): string {
    switch (elementType) {
      case GenericElementType.INTERACTOR:
        return "#C6602C";
      case GenericElementType.PROCESS:
        return "#377432";
      case GenericElementType.DATASTORE:
        return "#32579F";
      case GenericElementType.TRUST_BOUNDARY:
        return "#CDCDCD";
      default:
        break;
    }
  }

  static getInteractorShapeHEXColor(highlighted: boolean): string {
    if (!highlighted) {
      return this.getInteractorShapeDefaultHEXColor();
    }
    return this.getInteractorShapeHighlightHEXColor();
  }

  static getProcessShapeHEXColor(highlighted: boolean): string {
    if (!highlighted) {
      return this.getProcessShapeDefaultHEXColor();
    }
    return this.getProcessShapeHighlightHEXColor();
  }

  static getDataStoreShapeHEXColor(highlighted: boolean): string {
    if (!highlighted) {
      return this.getDataStoreShapeDefaultHEXColor();
    }
    return this.getDataStoreShapeHighlightHEXColor();
  }

  static getTrustBoundaryShapeHEXColor(): string {
    return this.getTrustBoundaryShapeDefaultHEXColor();
  }

  static getInteractorShapeDefaultHEXColor(): string {
    return "#DE713F";
  }

  static getInteractorShapeHighlightHEXColor(): string {
    return "#FF7400";
  }

  static getProcessShapeDefaultHEXColor(): string {
    return "#3B7C66";
  }

  static getProcessShapeHighlightHEXColor(): string {
    return "#2C9241";
  }

  static getDataStoreShapeDefaultHEXColor(): string {
    return "#467C9D";
  }

  static getDataStoreShapeHighlightHEXColor(): string {
    return "#2378B3";
  }

  static getDataFlowShapeHEXColor() {
    return "#5A5A5A";
  }

  private static getTrustBoundaryShapeDefaultHEXColor() {
    return "#878787";
  }
}
