
    export interface EntityAttributesMap {
        mapSk: number;
        tgtValSrcJson: string;
        consId: number;
        srcAttrSk: number;
        srcEntitySk: number;
        srcAttrName: string;
        srcEntityName: string;
        srcDomainName: string;
        consName: string;
    }

    export interface EntityAttribute {
        attrSk: number;
        attrName: string;
        attrDesc: string;
        attrComment: string;
        attrLength: number;
        position: number;
        colGrpName: string;
        colGrpLvl: string;
        entityAttributesMaps: EntityAttributesMap[];
        dataType: string;
        defaultValue: string;
        entityAttributeDisableFlag:boolean;
        attrTags: string;
    }

    export interface Entity {
        entitySk: number;
        entityId: string;
        entityName: string;
        entityDesc: string;
        entitySrc: string;
        sourceType: string;
        entityAttributes: EntityAttribute[];
        expression: string;
        locationId: string;
        entityDisableFlag:boolean;
        displayEntityTargetPanel:boolean;
        entityTypeId: string;
    }

    export interface Domainn {
        domainId: number;
        domainName: string;
        domainDesc: string;
        selected:boolean;
        displayDomainTargetPanel:boolean;
        entities: Entity[];
    }

    export interface SplitInterface
    {
        domains: Domainn;
    }

