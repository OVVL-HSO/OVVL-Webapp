export interface CPEITem {
  id: number;
  title: string;
  cpeName: string;
  cpe23Name: string;
  references: CPEReference[];
  selected?: boolean;
}

export interface CPEReference {
  referenceType: string;
  referenceContent: string;
}
