import {useNodeId, useNodesData} from "@xyflow/react";
import {usePlaygroundStore} from "@/stores/usePlaygroundStore.ts";
import {useCallback} from "react";
import {EntityNode} from "@/types/entity-node";

type NodeData = EntityNode['data']
type SetNodeData = (data: NodeData | ((data: NodeData) => NodeData)) => void

export const useTableData = (): [NodeData, SetNodeData] => {
  const nodeId = useNodeId()!
  const nodeData = useNodesData<EntityNode>(nodeId)

  const setNodeData: SetNodeData = useCallback((data) => {
    if (typeof data === 'function') {

      if (!nodeData || !nodeData.data) return
      usePlaygroundStore.setState(cur => ({
        entities: cur.entities.map(entity => entity.id === nodeId ? {
          ...entity,
          data: data(nodeData.data)
        } : entity)
      }))

    } else {
      usePlaygroundStore.setState(cur => ({
        entities: cur.entities.map(entity => entity.id === nodeId ? {
          ...entity,
          data
        } : entity)
      }))
    }
  }, [nodeId, nodeData])

  return [nodeData?.data!, setNodeData]
}
