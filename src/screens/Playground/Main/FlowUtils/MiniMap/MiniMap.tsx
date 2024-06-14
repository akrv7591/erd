import {memo} from "react";
import {MiniMap as FlowMinimap} from "@xyflow/react"
import {EntityNode} from "@/types/entity-node";
import {usePlayground} from "@/contexts/playground/PlaygroundStoreContext.ts";

export const MiniMap = memo(() => {
  const minimap = usePlayground(state => state.minimap)

  if (!minimap) {
    return null
  }

  return (
    <FlowMinimap
      zoomable
      pannable
      nodeStrokeWidth={20}
      nodeColor={(node: EntityNode) => node.data.color}
    />
  )
})
