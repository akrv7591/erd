import {useCallback, useMemo} from "react";
import {useNodeId, useNodesData, useReactFlow} from "@xyflow/react";
import type {EntityData, EntityNode} from "@/types/diagram";
import {useDiagramStore} from "@/hooks";

export const useEntityNode = () => {
  const nodeId = useNodeId()

  if (!nodeId) {
    throw new Error("useEntity must be used within a EntityNode")
  }

  const node = useNodesData<EntityNode>(nodeId)

  if (!node) {
    throw new Error("useEntity must be used within a EntityNode")
  }

  const updateNodeData = useDiagramStore(state => state.updateNodeData<EntityData>)

  const reactFlow = useReactFlow<EntityNode>()

  const onChange = useCallback((dataUpdate: Partial<EntityData> | ((node: EntityData) => Partial<EntityData>), broadcast: boolean = true) => {
    return updateNodeData(nodeId, dataUpdate, broadcast)
  }, [])

  const onDelete = useCallback(() => {
    void reactFlow.deleteElements({nodes: [{id: nodeId}]})
  }, [])

  return useMemo(() => {
    return {
      ...node,
      onChange,
      onDelete,
    }
  }, [node])
}
