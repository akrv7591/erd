import {useNodeId, useNodesData} from "@xyflow/react";
import {useSharedDiagramStore} from "@/contexts/SharedDiagramContext.ts";
import {useCallback, useMemo} from "react";
import {EntityData, EntityNode} from "@/providers/shared-diagram-store-provider/type.ts";

export const useEntityNodeData = () => {
  const nodeId = useNodeId()

  if (!nodeId) {
    throw new Error("useEntityNodeData must be used within a EntityNode")
  }

  const node = useNodesData<EntityNode>(nodeId)

  if (!node) {
    throw new Error("useEntityNodeData must be used within a EntityNode")
  }

  const setNodeData = useSharedDiagramStore(state => state.setEntityData)

  const setData = useCallback((obj: (Partial<EntityData> | ((obj: EntityData) => Partial<EntityData>))) => {
    setNodeData(nodeId, obj)
  }, [])

  const columns = useMemo(() => {
    return  Array.from(Object.values(node.data.columns).sort((a, b) => a.order - b.order))
  }, [node.data])

  return {
    ...node,
    setData,
    columns
  }
}
