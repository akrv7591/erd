import {ITools} from "@/types/entity-node";
import {NODE_TYPES} from "@/screens/Diagram/Main/NodeTypes";

export interface EntityControl {
  label: string
  value: ITools
  icon: any
  allowOnDisabled: boolean
  type?: NODE_TYPES
}
