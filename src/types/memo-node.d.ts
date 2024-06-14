import type {IMemo} from "@/types/data/db-model-interfaces";
import type {Node} from "@xyflow/react";
import type {CustomNodeTypes} from "@/types/playground";

export type MemoNodeData = Pick<IMemo, 'color' | 'content'>

export type MemoNode = Node<MemoNodeData, CustomNodeTypes>
