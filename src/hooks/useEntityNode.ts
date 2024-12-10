import {useCallback, useEffect, useMemo, useState} from "react";
import {useNodeId, useNodesData, useReactFlow} from "@xyflow/react";
import type {EntityNode} from "@/types/diagram";

export const useEntityNode = () => {
  const nodeId = useNodeId()

  if (!nodeId) {
    throw new Error("useEntity must be used within a EntityNode")
  }

  const node = useNodesData<EntityNode>(nodeId)

  if (!node) {
    throw new Error("useEntity must be used within a EntityNode")
  }

  const reactFlow = useReactFlow<EntityNode>()

  const onDelete = useCallback(() => {
    void reactFlow.deleteElements({nodes: [{id: nodeId}]})
  }, [])

  return useMemo(() => {
    return {
      ...node,
      onDelete,
    }
  }, [node])
}

export const useEntityColor = () => {
  const entityNode = useEntityNode()
  const [color, setColor] = useState(entityNode.data.color)

  useEffect(() => {
    setColor(entityNode.data.color)
  }, [entityNode.data.color])

  return color
}