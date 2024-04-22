import {useNodeId, useNodesData} from "@xyflow/react";
import {EntityNode} from "@/types/entity-node";

export const useEntityNodeData = () => {
  const nodeId = useNodeId()!

  return useNodesData<EntityNode>(nodeId)!
}
