import {useNodeId, useNodesData} from "@xyflow/react";
import {ITableNode} from "@/types/table-node";

export const useNodeData = () => {
  const nodeId = useNodeId()

  const dataList = useNodesData<ITableNode>([nodeId!])

  if (dataList.length === 0) {
    throw new Error("useNodeData hook should be used under ReactflowProvider")
  }

  return dataList[0]
}
