import {Threat} from "./threat.model";

export interface PrivacyThreat extends Threat {
  threatCategory: LinddunCategory;
}


export enum LinddunCategory {
  LINKABILITY = 'Linkability',
  IDENTIFIABILITY = 'Identifiability',
  REPUDIATION = 'Repudiation',
  DETECTABILITY = 'Detectability',
  DISCLOSURE_OF_INFORMATION = 'Disclosure of Information',
  UNAWARENESS = 'Unawareness',
  NON_COMPLIANCE = 'Non-Compliance'
}

