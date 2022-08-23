export interface SplitInterface1
{
    domains: Domainn;
}

export interface Domainn {
  domainId: number
  domainName: string
  domainDesc: string
  createTs?: number
  selected:boolean;
  displayDomainTargetPanel:boolean;
  lastUpdtTs?: number
  entities: Entity[]
}

export interface Entity {
  entitySk: number
  entityId: string
  entityName: string
  entityDesc: string
  entitySrc: string
  sourceType: string
  expression?: string
  locationId?: string
  entityTypeId?: string
  entityDisableFlag:boolean;
  displayEntityTargetPanel:boolean;
  createTs?: number
  lastUpdtTs?: number
  entityAttributes: EntityAttribute[]
}

export interface EntityAttribute {
  attrSk: number
  attrName: string
  dataType?: string
  attrDesc: string
  attrComment: string
  attrLength: number
  position: number
  defaultValue?: string
  entityAttributeDisableFlag:boolean
  attrTags?: string
  colGrpName: string
  colGrpLvl: string
  createTs?: number
  lastUpdtTs?: number
}
