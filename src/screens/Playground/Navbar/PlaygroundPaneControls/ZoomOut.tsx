import {ActionIcon, Tooltip} from "@mantine/core";
import {useReactFlow} from "@xyflow/react";
import {IconZoomOut} from "@tabler/icons-react";

export default function ZoomOut() {
  const reactflow = useReactFlow()

  const handleZoomOut = () => reactflow.zoomOut({duration: 200})
  return (
    <Tooltip position={"right"} withArrow label={"Zoom out"}>
      <ActionIcon h={"40px"} w={"40px"} variant={"default"} onClick={handleZoomOut}>
        <IconZoomOut/>
      </ActionIcon>
    </Tooltip>
  )
}
