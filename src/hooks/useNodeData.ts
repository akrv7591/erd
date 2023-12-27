import {useNodeId, useNodes} from "reactflow";
import {ITableNodeData} from "@/types/table-node";

export const useNodeData = () => {
  const nodeId = useNodeId()
  const nodes = useNodes()

  if (!nodeId) {
    throw new Error("useNodeData hook should be used under ReactflowProvider")
  }

  const node = nodes.find(node => node.id === nodeId)

  if (!node) {
    throw new Error(`Node not found with id: ${nodeId}`)
  }

  return node.data as ITableNodeData
}
