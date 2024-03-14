import {useNodeId, useNodesData} from "@xyflow/react";
import {EntityNode} from "@/types/entity-node";

export const useEntityNodeData = () => {
  const nodeId = useNodeId()

  if (!nodeId) return

  return useNodesData<EntityNode>(nodeId)
}
