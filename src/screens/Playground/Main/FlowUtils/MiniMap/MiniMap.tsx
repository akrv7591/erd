import {memo} from "react";
import {MiniMap as FlowMinimap} from "@xyflow/react"
import {useDiagramStore} from "@/contexts/DiagramContext";
import {EntityNode} from "@/providers/shared-diagram-store-provider/type.ts";

const nodeColorGetter = (node: EntityNode) => {
  return node.data.color
}

export const MiniMap = memo(() => {
  const minimap = useDiagramStore(state => state.minimap)


  if (!minimap) {
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
