import {useNodeId, useNodesData} from "@xyflow/react";
import {MemoNode} from "@/types/diagram";
import {NODE_TYPES} from "@/screens/Playground/Main/NodeTypes";
import {useMemo} from "react";

export const useMemoNode = () => {
  const nodeId = useNodeId()

  if (!nodeId) {
    throw new Error("useMemoNode must be used within a MemoNode")
  }

  const nodeData = useNodesData<MemoNode>(nodeId)

  if (!nodeData) {
    throw new Error("useMemoNode must be used within a MemoNode")
  }

  if (nodeData.type !== NODE_TYPES.MEMO) {
    throw new Error("useMemoNode must be used within a MemoNode")
  }

  return useMemo(() => {
    return {
      ...nodeData
    }
  }, [nodeData])
}
