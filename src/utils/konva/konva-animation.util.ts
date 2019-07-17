import * as Konva from "konva";
import {Tween} from "konva";
import {ShapeConfig} from "../../config/shape.config";

export class KonvaAnimationUtil {

  static playTrashCanTween(trashcanGroup: Konva.Group, hovering: boolean) {
    const trashCanImage = trashcanGroup.find("Image")[0];
    new Tween({
      node: trashCanImage,
      easing: Konva.Easings.EaseIn,
      duration: 0.1,
      scaleX: hovering ? 1 + ShapeConfig.TRASHCAN_SCALE_FACTOR : 1,
      scaleY: hovering ? 1 + ShapeConfig.TRASHCAN_SCALE_FACTOR : 1,
      offsetX: hovering ? ShapeConfig.GET_TRASHCAN_WIDTH() * ShapeConfig.TRASHCAN_SCALE_FACTOR / 2 : 0,
      offsetY: hovering ? ShapeConfig.GET_TRASHCAN_HEIGHT() * ShapeConfig.DFD_SHAPE_SCALE_FACTOR * 1.1 / 2 : 0
    }).play();
  }

  static playElementTrashcanHoverTween(circle: Konva.Circle | Konva.Rect, hovering: boolean) {
    new Tween({
      node: circle,
      easing: Konva.Easings.EaseIn,
      duration: 0.1,
      scaleX: hovering ? 1 + ShapeConfig.ELEMENT_TRASH_HOVER_SCALE_FACTOR : 1 + ShapeConfig.DFD_SHAPE_SCALE_FACTOR,
      scaleY: hovering ? 1 + ShapeConfig.ELEMENT_TRASH_HOVER_SCALE_FACTOR : 1 + ShapeConfig.DFD_SHAPE_SCALE_FACTOR,
    }).play();
  }
}
