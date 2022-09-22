export interface EntityAttributeSave {
  attrComment: string;
  attrDesc: string;
  attrLength: number;
  attrName: string;
  attrSk: number;
  attrTags: string;
  colGrpLvl: string;
  colGrpName: string;
  createTs: Date;
  dataType: string;
  defaultValue: string;
  domainSrc: string;
  entitySrc: string;
  lastUpdtTs: Date;
  position: number;
  tgtValSrcJson: string;
  tgtValSrcOthr: string;
  tgtValSrcSql: string;
}

export interface EntitySave {
  consId: number;
  createTs: Date;
  cronExpr: string;
  domainId: number;
  domainName: string;
  entityAttributes: EntityAttributeSave[];
  entityTypeId: string;
  expression: string;
  lastUpdtTs: Date;
  locationId: string;
  manifestDesc: string;
  manifestId: number;
  manifestName: string;
  manifestSrc: string;
  sourceType: string;
  startDate: Date;
  endDate: Date;
  status: string;
}
