import {useNodeId, useNodesData} from "@xyflow/react";
import {Center, Overlay, Paper, Text} from "@mantine/core";
import {ITableNodeData} from "@/types/table-node";
import {usePlaygroundStore} from "@/stores/usePlaygroundStore.ts";

export default function NameOverlay() {
  const zoom = usePlaygroundStore(state => state.zoom)
  const nodeId = useNodeId()
  const data = useNodesData(nodeId || "") as ITableNodeData

  if (zoom > 0.5) return null

  return (
    <Overlay>
      <Center h={"100%"}>
        <Paper p={"20px 40px"} bg={"var(--mantine-color-dark-5)"}>
          <Text
            style={{
              fontSize: `${(1 / zoom) * 20}px`,
            }}
          >
            {data.name}
          </Text>
        </Paper>
      </Center>
    </Overlay>
  )
}
