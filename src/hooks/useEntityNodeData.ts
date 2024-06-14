import {useNodeId, useNodesData} from "@xyflow/react";
import {EntityNode, EntityNodeData} from "@/types/entity-node";
import {useCallback} from "react";
import {usePlayground} from "@/contexts/playground/PlaygroundStoreContext.ts";

export const useEntityNodeData = () => {
  const nodeId = useNodeId()!
  const {id, data} = useNodesData<EntityNode>(nodeId)!
  const setEntityData = usePlayground(state => state.setEntityData)

  const setData = useCallback((obj: Partial<EntityNodeData> | ((obj: EntityNodeData) => Partial<EntityNodeData>)) => {
    setEntityData(id, obj)
  }, [])

  return {id, data, setData}
}
