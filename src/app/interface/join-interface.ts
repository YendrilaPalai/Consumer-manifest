import { EntityAttribute } from "./split-interface";
import { Entity } from "./split-interface";
import { Domainn } from "./split-interface";

export interface Join {
   tableleft: Entity
   tableright: Entity
   columnleft: EntityAttribute
   columnright: EntityAttribute
   operator: string
   joinCondition: any
  
}
