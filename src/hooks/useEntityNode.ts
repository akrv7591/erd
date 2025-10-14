import {useEffect, useMemo, useState} from "react";
import { useNodesData} from "@xyflow/react";
import type {EntityNode} from "@/types/diagram";
import { useNodeId } from "./useNodeId";

export const useEntityNode = () => {
  const nodeId = useNodeId()
  const node = useNodesData<EntityNode>(nodeId)

  if (!node) {
    throw new Error("useEntity must be used within a EntityNode")
  }

  return node
}

export const useEntityColor = () => {
  const entityNode = useEntityNode()
  const [color, setColor] = useState(entityNode.data.color)

  useEffect(() => {
    setColor(entityNode.data.color)
  }, [entityNode.data.color])

  return color
}

export const useEntityName = () => {
  const entityNode = useEntityNode()

  return useMemo(() => {
    return entityNode.data.name
  }, [entityNode.data.name])
}