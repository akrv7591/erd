import { NodeType } from "@/types/diagram";
import { NodeAddChange, NodeRemoveChange } from "@xyflow/react";
import { useCallback, useMemo } from "react"
import { useDiagramStore } from "./useDiagramStore";
import { REACTFLOW } from "@/namespaces/broadcast/reactflow";

export const useAddNode = () => {
  const handleDataChange = useDiagramStore(state => state.handleDataChange)

  const addNode = useCallback((node: NodeType) => {
    const reactflowNodaAddData: NodeAddChange<NodeType>[] = [{
      item: node,
      type: "add",
    }];

    const reactflowNodeDeleteData: NodeRemoveChange[] = [{
      type: "remove",
      id: node.id
    }]

    const current: REACTFLOW.NODE_CHANGE[] = [{
      type: REACTFLOW.TYPE.NODE_CHANGE,
      value: reactflowNodeDeleteData,
    }]

    const updates: REACTFLOW.NODE_CHANGE[] = [{
      type: REACTFLOW.TYPE.NODE_CHANGE,
      value: reactflowNodaAddData,
    }]

    handleDataChange({
      updates,
      current
    })
  }, [])

  return useMemo(() => ({addNode}), [addNode])
}
