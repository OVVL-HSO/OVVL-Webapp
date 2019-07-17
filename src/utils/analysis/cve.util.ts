import {CVE, CVSS, Product, VendorData, VersionData} from '../../models/analysis-related/cve.model';
import {DataFlow} from '../../models/modelling-related/dataflow.model';
import {GeneralUtil} from "../general.util";
import {DFDElementType} from "../../models/types/types.model";
import {ProductData} from "../../models/analysis-related/product-data.model";

export class CveUtil {

  static sortCVEsByTheirImpact(foundCVEs: CVE[]) {
    return foundCVEs.sort((cve1: CVE, cve2: CVE) => {
      if (!cve1.cvss.cvssv2Metric && !cve1.cvss.cvssv3Metric) {
        return -1;
      }
      if (!cve2.cvss.cvssv2Metric && !cve2.cvss.cvssv3Metric) {
        return 1;
      }
      const value1 = cve2.cvss.cvssv3Metric ? cve2.cvss.cvssv3Metric.baseScore : cve2.cvss.cvssv2Metric.baseScore;
      const value2 = cve1.cvss.cvssv3Metric ? cve1.cvss.cvssv3Metric.baseScore : cve1.cvss.cvssv2Metric.baseScore;
      return value1 - value2;
    });
  }

  static getCVSSScore(cvss: CVSS): number {
    let impact = 0;
    if (cvss.cvssv3Metric && cvss.cvssv3Metric.baseScore) {
      impact = cvss.cvssv3Metric.baseScore;
    } else if (cvss.cvssv2Metric && cvss.cvssv2Metric.baseScore) {
      impact = cvss.cvssv2Metric.baseScore;
    }
    return impact;
  }

  static findAffectedElements(dfdElements: (DFDElementType | DataFlow)[],
                              vendorData: VendorData[]): (DFDElementType | DataFlow)[] {
    return this.findElementsByVendorData(dfdElements, vendorData);
  }

  static findCVEsByProductData(foundCVEs: CVE[], productData: ProductData): CVE[] {
    return foundCVEs.filter((cve: CVE) => {
      return this.twoProductVendorsMatchOrVendorIsWildcard(cve.affects, productData)
        && this.productNameAndVersionMatchOrAreWildcard(cve.affects, productData);
    });
  }

  static findCVEsNotIncludedInAnotherCVEList(foundCVEs: CVE[], cvesApplyingToElement: CVE[]): CVE[] {
    return foundCVEs.filter((cve: CVE) => !cvesApplyingToElement.includes(cve));
  }

  static updateCVEsSelectStatus(foundCVEs: CVE[], cpeName: string) {
    // 0. Extract the product information from the cpe
    const productData: ProductData = this.extractProductDataFromCPEName(cpeName);
    // 1. Find all CVEs that match the CPE of the element
    const cvesApplyingToElement: CVE[] = CveUtil.findCVEsByProductData(foundCVEs, productData);

    // 2. Set those to selected
    cvesApplyingToElement.forEach((cve: CVE) => cve.selected = true);

    // 3. Find all CVEs that don't affect the element
    const cvesNotApplyingtoElement: CVE[] = CveUtil.findCVEsNotIncludedInAnotherCVEList(foundCVEs, cvesApplyingToElement);

    // 4. Combine both arrays to a new one, so the affecting cves are sorted towards the beginning
    return GeneralUtil.combineTwoArrays<CVE>(cvesApplyingToElement, cvesNotApplyingtoElement);
  }

  static extractProductDataFromCPEName(cpe: string): ProductData {
    let vendor = "", product = "", version = "";
    let indexOfSeparator = 0;
    // cpe:2.3:a:10web:form_maker:1.13.5:*:*:*:*:wordpress:*:*
    // 1. Remove unnecessary part of CPEItem string
    if (cpe.length > 10) {
      cpe = cpe.substring(10);
      // -> 10web:form_maker:1.13.5:*:*:*:*:wordpress:*:*
    }
    // 2. Get the vendor
    if (cpe.indexOf(":") > -1) {
      indexOfSeparator = cpe.indexOf(":");
      vendor = cpe.substring(0, indexOfSeparator);
      cpe = cpe.substring(indexOfSeparator + 1);
      // -> form_maker:1.13.5:*:*:*:*:wordpress:*:*
    }
    // 3. Get the product
    if (cpe.indexOf(":") > -1) {
      indexOfSeparator = cpe.indexOf(":");
      product = cpe.substring(0, indexOfSeparator);
      cpe = cpe.substring(indexOfSeparator + 1);
      // -> 1.13.5:*:*:*:*:wordpress:*:*
    }
    // 4. Get the version
    if (cpe.indexOf(":") > -1) {
      version = cpe.substring(0, cpe.indexOf(":"));
    }
    return {
      vendor: vendor,
      product: product,
      version: version
    };
  }

  private static findElementsByVendorData(dfdElements: (DFDElementType | DataFlow)[], vendorData: VendorData[])
    : (DFDElementType | DataFlow)[] {
    return dfdElements.filter((element: DFDElementType | DataFlow) => {
      if (!element.cpe || !element.cpe.cpe23Name) {
        return false;
      } else {
        // Extracting the product information from the CPE string. This information can than be matched against CVEs
        const productData: ProductData = this.extractProductDataFromCPEName(element.cpe.cpe23Name);
        return this.twoProductVendorsMatchOrVendorIsWildcard(vendorData, productData)
          && this.productNameAndVersionMatchOrAreWildcard(vendorData, productData);
      }
    });
  }

  private static twoProductVendorsMatchOrVendorIsWildcard(affects: VendorData[], productData: ProductData): boolean {
    return affects.some((vendorData: VendorData) => vendorData.vendorName === productData.vendor || productData.vendor === "*");
  }

  private static productNameAndVersionMatchOrAreWildcard(affects: VendorData[], productData: ProductData) {
    return affects.some((vendorData: VendorData) =>
      vendorData.products.some((product: Product) =>
        this.productNamesMatchOrIsWildcard(product, productData)
        && this.versionDataMatchOrIsWildcard(product.versionData, productData)
      )
    );
  }

  private static productNamesMatchOrIsWildcard(product: Product, productData: ProductData) {
    return product.productName === productData.product
      || productData.product === "*";
  }

  private static versionDataMatchOrIsWildcard(versionData: VersionData[], productData: ProductData) {
    return versionData.some((version: VersionData) =>
      version.versionValue === productData.version || productData.version === "*");
  }
}
