import {Center, Overlay, Text} from "@mantine/core";
import {RELATION} from "@/namespaces";
import {memo} from "react";
import {useViewport} from "@xyflow/react";
import {useDiagramStore} from "@/hooks";
import {useEntityNode} from "@/hooks";


const getTextSize = (zoom: number) => {
  return {
    fontSize: `${(1 / zoom) * 22}px`,
  }
}

export const NameOverlay = memo(() => {
  const {zoom} = useViewport()
  const {data} = useEntityNode()
  const isRelationshipMode = useDiagramStore(state => RELATION.NAME_LIST.includes(state.tool as any))

  if (isRelationshipMode) return null
  if (zoom > 0.3) return null

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
})
