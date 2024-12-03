import {memo} from "react";
import {MiniMap as FlowMinimap} from "@xyflow/react"
import {useDiagramStore} from "@/hooks";
import {EntityNode} from "@/types/diagram";

const nodeColorGetter = (node: EntityNode) => {
  return node.data.color
}

export const MiniMap = memo(() => {
  const isMinimapVisible = useDiagramStore(state => state.isMinimapVisible)


  if (!isMinimapVisible) {
    return null
  }

  return (
    <FlowMinimap
      zoomable
      pannable
      nodeStrokeWidth={20}
      nodeColor={nodeColorGetter}
    />
  )
})
