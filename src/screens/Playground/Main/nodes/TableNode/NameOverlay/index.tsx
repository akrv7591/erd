import {Center, Overlay, Text} from "@mantine/core";
import {usePlaygroundStore} from "@/stores/usePlaygroundStore.ts";
import {useNodeData} from "@/hooks/useNodeData.ts";


const getTextSize = (zoom: number) => {
  return {
    fontSize: `${(1 / zoom) * 22}px`,
  }
}

export default function NameOverlay() {
  const zoom = usePlaygroundStore(state => state.zoom)
  const nodeData = useNodeData()

  if (zoom > 0.3 || !nodeData) return null

  const textStyle = getTextSize(zoom)

  return (
    <Overlay bg={"var(--mantine-primary-color-light)"}>
      <Center h={"100%"}>
        <Text style={textStyle}>
          {nodeData.data.name}
        </Text>
      </Center>
    </Overlay>
  )
}
