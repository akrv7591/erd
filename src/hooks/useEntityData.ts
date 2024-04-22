import {useNodeId, useNodesData, useReactFlow,} from "@xyflow/react";
import {useCallback} from "react";
import {EntityNode} from "@/types/entity-node";

type NodeData = EntityNode['data']
type SetNodeData = (data: NodeData | ((data: NodeData) => NodeData)) => void

export const useEntityData = (): [NodeData, SetNodeData] => {
  const nodeId = useNodeId()!
  const nodeData = useNodesData<EntityNode>(nodeId)
  const reactflow = useReactFlow()


  const setNodeData: SetNodeData = useCallback((data) => {
    reactflow.updateNodeData(nodeId, data)
  }, [])

  return [nodeData?.data!, setNodeData]
}
