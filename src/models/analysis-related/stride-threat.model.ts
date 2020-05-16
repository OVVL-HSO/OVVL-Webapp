import {Threat} from "./threat.model";

export interface StrideThreat extends Threat {
  threatCategory: StrideCategory;
}


export enum StrideCategory {
  SPOOFING = 'Spoofing',
  TAMPERING = 'Tampering',
  REPUDIATION = 'Repudiation',
  INFORMATION_DISCLOSURE = 'Information Disclosure',
  DENIAL_OF_SERVICE = 'Denial Of Service',
  ELEVATION_OF_PRIVILEGE = 'Elevation Of Privilege'
}

