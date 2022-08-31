import { EntityAttribute } from "./split-interface";
import { Entity } from "./split-interface";
import { Domainn } from "./split-interface";

export interface Filter {
   datasource: Domainn
   table: Entity
   column: EntityAttribute
   operator: string
   condition: any
   screen: string
   expression: string
   columnCalName:string
   columnFormula:string
}
//operator for operators sign, condition is the last box after operator,
// screen is the type of screen like manual or simple
//expression would be for and/or selection.