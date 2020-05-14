import {PointCoordinates} from "../models/view-related/coordinates.model";

export class ShapeConfig {

  static readonly DFD_SHAPE_SCALE_FACTOR = 0.1;
  static readonly TRASHCAN_SCALE_FACTOR = ShapeConfig.DFD_SHAPE_SCALE_FACTOR * 1.1;
  static readonly TRASHCAN_ASPECT_RATIO = 0.7894736842105263;
  static readonly ELEMENT_TRASH_HOVER_SCALE_FACTOR = ShapeConfig.DFD_SHAPE_SCALE_FACTOR * 2;


  static GET_IMAGE_SIZE() {
    return this.GET_DFD_SHAPE_RADIUS() * 1.4; // 70% of element width
  }

  static GET_HEIGHT_REDUCTION() {
    return this.GET_DFD_SHAPE_RADIUS() * 0.05;
  }

  static GET_DFD_DRAG_SHAPE_COORDINATES() {
    // Coordinates of the left toolbar button wrapper
    // For y: Offset from top + radius of the button element
    return {x: window.innerWidth * 0.03, y: window.innerHeight * 0.03 + window.innerWidth * 0.02};
  }

  static GET_DFD_SHAPE_OFFSET() {
    // Offset of the Drag & Drop shapes in the toolbar
    return window.innerHeight * 0.041 + window.innerWidth * 0.04;
  }

  static GET_LEFT_TOOLBAR_WIDTH() {
    return window.innerWidth * 0.06;
  }

  static GET_DATA_FLOW_TIP_LENGTH() {
    return ShapeConfig.GET_DFD_SHAPE_RADIUS() * 4;
  }

  static GET_REDUCED_DATA_FLOW_TIP_LENGTH() {
    return this.GET_DATA_FLOW_TIP_LENGTH() / 2;
  }

  static GET_ELEMENT_FONTSIZE() {
    return this.GET_DFD_SHAPE_RADIUS() * 0.31;
  }

  static GET_TRANSFORM_BOUNDARY_PADDING() {
    return ShapeConfig.GET_DFD_SHAPE_RADIUS() / 1.5;
  }

  static GET_TRASHCAN_POSITION(): PointCoordinates {
    return {
      x: window.innerWidth * 0.08 - this.GET_LEFT_TOOLBAR_WIDTH(),
      y: window.innerHeight * 0.85,
    };
  }

  static GET_TRASHCAN_HEIGHT(): number {
    return this.GET_IMAGE_SIZE() * 1.1;
  }

  static GET_TRASHCAN_WIDTH(): number {
    return this.GET_TRASHCAN_HEIGHT() * ShapeConfig.TRASHCAN_ASPECT_RATIO;
  }

  // Same size as defined for the respective buttons in toolbar-left.component.scss
  static GET_DFD_SHAPE_RADIUS() {
    return window.innerWidth * 0.02;
  }

}
