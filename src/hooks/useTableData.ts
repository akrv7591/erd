import {useNodeId, useNodesData} from "@xyflow/react";
import {ITableNode} from "@/types/table-node";
import {usePlaygroundStore} from "@/stores/usePlaygroundStore.ts";
import {useCallback} from "react";

type NodeData = ITableNode['data']
type SetNodeData = (data: NodeData | ((data: NodeData) => NodeData)) => void

export const useTableData = (): [NodeData, SetNodeData] => {
  const nodeId = useNodeId()!
  const nodeData = useNodesData<ITableNode>(nodeId)

  const setNodeData: SetNodeData = useCallback((data) => {
    if (typeof data === 'function') {

      if (!nodeData || !nodeData.data) return
      usePlaygroundStore.setState(cur => ({
        tables: cur.tables.map(table => table.id === nodeId ? {
          ...table,
          data: data(nodeData.data)
        } : table)
      }))

    } else {
      usePlaygroundStore.setState(cur => ({
        tables: cur.tables.map(table => table.id === nodeId ? {
          ...table,
          data
        } : table)
      }))
    }
  }, [nodeId])

  return [nodeData?.data!, setNodeData]
}
