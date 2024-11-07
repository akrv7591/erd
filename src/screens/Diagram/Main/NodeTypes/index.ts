import type { NodeTypes } from "@xyflow/react";
import { MemoNode } from "./MemoNode";
import { EntityNode } from "./EntityNode";

export enum NODE_TYPES {
  ENTITY = "entity",
  MEMO = "memo"
}

export const nodeTypes: NodeTypes = {
  [NODE_TYPES.ENTITY]: EntityNode,
  [NODE_TYPES.MEMO]: MemoNode
}
