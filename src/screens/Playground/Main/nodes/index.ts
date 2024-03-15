import type {NodeTypes} from "@xyflow/react";
import EntityNode from "./EntityNode";
import MemoNode from "@/screens/Playground/Main/nodes/MemoNode";

export const nodeTypes: NodeTypes = {
  entityNode: EntityNode,
  memoNode: MemoNode
}
