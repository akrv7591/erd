import type {NodeTypes} from "@xyflow/react";
import EntityNode from "./EntityNode";
import MemoNode from "@/screens/Playground/Main/nodes/MemoNode";

export enum NODE_TYPES {
  ENTITY = "entity",
  MEMO = "memo"
}

export const nodeTypes: NodeTypes = {
  [NODE_TYPES.ENTITY]: EntityNode,
  [NODE_TYPES.MEMO]: MemoNode
}
