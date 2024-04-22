import {useNodeId, useNodesData} from "@xyflow/react";

import type {MemoNode} from "@/types/memo-node";

export const useMemoNodeData = () => {
  const nodeId = useNodeId()!

  return useNodesData<MemoNode>(nodeId)!
}
