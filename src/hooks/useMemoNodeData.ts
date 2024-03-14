import {useNodeId, useNodesData} from "@xyflow/react";
import {MemoNode} from "@/stores/playground/memoStore.ts";

export const useMemoNodeData = () => {
  const nodeId = useNodeId()

  if (!nodeId) return

  return useNodesData<MemoNode>(nodeId)
}
