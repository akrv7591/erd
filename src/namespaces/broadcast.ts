import { CLIENT } from "./broadcast/client"
import { NODE } from "./broadcast/node"
import { REACTFLOW } from "./broadcast/reactflow"

export class BROADCAST{}

export namespace BROADCAST {
  export type TYPE = NODE.TYPE | CLIENT.TYPE | REACTFLOW.TYPE
  export type DATA = NODE.DATA | CLIENT.DATA | REACTFLOW.DATA
}
