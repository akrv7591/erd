import type {Node} from "@xyflow/react";
import type {CustomNodeTypes} from "@/types/playground";

export type MemoData = {
  content: string
  color: string
}

export type MemoNode = Node<MemoData, CustomNodeTypes>
