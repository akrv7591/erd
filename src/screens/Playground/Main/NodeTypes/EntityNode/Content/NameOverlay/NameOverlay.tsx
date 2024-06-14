import {Center, Overlay, Text} from "@mantine/core";
import {useEntityNodeData} from "@/hooks/useEntityNodeData.ts";
import {RELATION} from "@/constants/relations.ts";
import {memo} from "react";
import {useViewport} from "@xyflow/react";
import {usePlayground} from "@/contexts/playground/PlaygroundStoreContext.ts";


const getTextSize = (zoom: number) => {
  return {
    fontSize: `${(1 / zoom) * 22}px`,
  }
}

 export const NameOverlay = memo(() => {
  const {zoom} = useViewport()
  const nodeData = useEntityNodeData()
  const isRelationshipMode = usePlayground(state => RELATION.NAME_LIST.includes(state.tool as any))

  if (isRelationshipMode) return null
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
})
