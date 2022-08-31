export interface EntityAttributeSave {
  attrSk: number;
  attrName: string;
  attrDesc: string;
  attrComment: string;
  entitySrc: string;
  domainSrc: string;
  dataType: string;
  attrLength: number;
  position: number;
  colGrpName: string;
  colGrpLvl: string;
  createTs: number;
  lastUpdtTs: number;
  tgtValSrcJson: string;
}

export interface EntitySave {
  entitySk: number;
  entityId: string;
  entityName: string;
  entityDesc: string;
  entitySrc: string;
  sourceType: string;
  entityAttributes: EntityAttributeSave[];
}
