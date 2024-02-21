import {ActionIcon, Tooltip} from "@mantine/core";
import {useReactFlow} from "@xyflow/react";
import {IconZoomIn} from "@tabler/icons-react";

export default function ZoomIn() {
  const reactflow = useReactFlow()

  const handleZoomIn = () => reactflow.zoomIn({duration: 200})
  return (
    <Tooltip position={"right"} withArrow label={"Zoom in"}>
      <ActionIcon h={"40px"} w={"40px"} variant={"default"} mt={"auto"} onClick={handleZoomIn}>
        <IconZoomIn/>
      </ActionIcon>
    </Tooltip>
  )
}
