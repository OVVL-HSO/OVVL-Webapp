import {GenericElementType} from '../models/modelling-related/base.model';
import {PointCoordinates} from '../models/view-related/coordinates.model';
import {Images} from "../models/view-related/image.model";

export class GeneralUtil {

  static getStringEnumAsArrayOfStrings(StringEnum): string[] {
    return Object.values(StringEnum).filter(value => typeof value === 'string') as string[];
  }

  static getCoordinatesOfElementWithUnknownType(element): PointCoordinates {
    let coordinates: PointCoordinates;
    if (element.genericType === GenericElementType.DATAFLOW) {
      coordinates = element.connectedElements.startElement.coordinates;
    } else {
      coordinates = element.coordinates;
    }
    return coordinates;
  }

  static convertUTCToDDMMYYYY(publishedAt: string) {
    const date = new Date(publishedAt);
    const day: string = date.getDate() < 10 ? "0" + date.getDate().toString() : date.getDate().toString();
    const month: string = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1).toString() : (date.getMonth() + 1).toString();
    return day + '.' + month + '.' + date.getFullYear().toString().substr(-2);
  }

  static substractTwoDates(date1: string, date2: string) {
    return new Date(date1).getTime() - new Date(date2).getTime();
  }

  static roundCoordinates(coordinates: PointCoordinates): PointCoordinates {
    return {
      x: Math.round(coordinates.x),
      y: Math.round(coordinates.y)
    };
  }

  static removeDuplicatesOfAnArray<T>(arrayWithDuplicates: T[]): T[] {
    return arrayWithDuplicates.filter((value, index, array) => array.indexOf(value) === index);
  }

  static combineTwoArrays<T>(array1: any[], array2: any[]): T[] {
    return array1.concat(array2);
  }

  static createEmptyImagesObject(): Images {
    return {
      elementImages: {},
      deleteImages: {}
    };
  }

  static combineAnArrayOfStringsToASingleString(array: string[]): string {
    return array.join();
  }

  static throttle = (func, limit) => {
    let inThrottle;
    return function () {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  };

  static capitalizeFirstLetterOfString(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  static splitStringIntoWords(string: string): string[] {
    let words: string[] = [];
    if (string.indexOf(",") > 1) {
      words = string.split(",");
    } else {
      words = string.split(" ");
    }
    return words;
  }
}
