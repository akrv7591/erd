import type {NodeTypes} from "@xyflow/react";
import MemoNode from "@/screens/Playground/Main/nodes/MemoNode";
import EntityNode from "@/screens/Playground/Main/nodes/EntityNode";

export enum NODE_TYPES {
  ENTITY = "entity",
  MEMO = "memo"
}

export const nodeTypes: NodeTypes = {
  [NODE_TYPES.ENTITY]: EntityNode,
  [NODE_TYPES.MEMO]: MemoNode
}
