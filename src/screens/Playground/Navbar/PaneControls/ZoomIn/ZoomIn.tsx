import {Tooltip} from "@mantine/core";
import {useReactFlow} from "@xyflow/react";
import {IconZoomIn} from "@tabler/icons-react";
import {PlaygroundActionIcon} from "@/components/common/PlaygroundActionIcon";

export const ZoomIn = () => {
  const reactflow = useReactFlow()

  const handleZoomIn = () => reactflow.zoomIn({duration: 200})
  return (
    <Tooltip position={"right"} withArrow label={"Zoom in"}>
      <PlaygroundActionIcon mt={"auto"} onClick={handleZoomIn}>
        <IconZoomIn/>
      </PlaygroundActionIcon>
    </Tooltip>
  )
}
