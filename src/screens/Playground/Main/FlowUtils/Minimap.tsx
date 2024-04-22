import {memo} from "react";
import {MiniMap as FlowMinimap} from "@xyflow/react"
import {usePlaygroundStore} from "@/stores/usePlaygroundStore.ts";
import {EntityNode} from "@/types/entity-node";

const MiniMap = memo(() => {
  const minimap = usePlaygroundStore(state => state.minimap)

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

export default MiniMap
