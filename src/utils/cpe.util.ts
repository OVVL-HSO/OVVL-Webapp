import {CPEITem} from "../models/analysis-related/cpe.model";
import {CveUtil} from "./analysis/cve.util";
import {GeneralUtil} from "./general.util";

export class CpeUtil {
  static extractCPEType(cpe: CPEITem): string {
    if (cpe.cpe23Name.indexOf(":a:") > -1) {
      return "application";
    }
    if (cpe.cpe23Name.indexOf(":o:") > -1) {
      return "os";
    }
    if (cpe.cpe23Name.indexOf(":h:") > -1) {
      return "hardware";
    }
  }

  static extractCPEHoverTitle(cpe: CPEITem): string {
    const vendor: string = CveUtil.extractProductDataFromCPEName(cpe.cpe23Name).vendor;
    const vendorCapitalized: string = GeneralUtil.capitalizeFirstLetterOfString(vendor);
    if (cpe.cpe23Name.indexOf(":a:") > -1) {
      return "Application |" + vendorCapitalized;
    }
    if (cpe.cpe23Name.indexOf(":o:") > -1) {
      return "Operating System | " + vendorCapitalized;
    }
    if (cpe.cpe23Name.indexOf(":h:") > -1) {
      return "Hardware | " + vendorCapitalized;
    }
  }
}
