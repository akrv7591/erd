import {useNodeId, useNodesData} from "@xyflow/react";
import {Center, Overlay, Text} from "@mantine/core";
import {ITableNodeData} from "@/types/table-node";
import {usePlaygroundStore} from "@/stores/usePlaygroundStore.ts";


const getTextSize = (zoom: number) => {
  return {
    fontSize: `${(1 / zoom) * 22}px`,
  }
}

export default function NameOverlay() {
  const zoom = usePlaygroundStore(state => state.zoom)
  const nodeId = useNodeId()
  const data = useNodesData(nodeId || "") as ITableNodeData

  if (zoom > 0.3 || !data) return null

  const textStyle = getTextSize(zoom)

  return (
    <Overlay bg={"var(--mantine-primary-color-light)"}>
      <Center h={"100%"}>
        <Text style={textStyle}>
          {data.name}
        </Text>
      </Center>
    </Overlay>
  )
}
