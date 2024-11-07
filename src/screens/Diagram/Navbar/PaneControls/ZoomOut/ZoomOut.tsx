import {Tooltip} from "@mantine/core";
import {useReactFlow} from "@xyflow/react";
import {IconZoomOut} from "@tabler/icons-react";
import {PlaygroundActionIcon} from "@/components/common/PlaygroundActionIcon";

export const ZoomOut = () => {
  const reactflow = useReactFlow()

  const handleZoomOut = () => reactflow.zoomOut({duration: 200})
  return (
    <Tooltip position={"right"} withArrow label={"Zoom out"}>
      <PlaygroundActionIcon onClick={handleZoomOut}>
        <IconZoomOut/>
      </PlaygroundActionIcon>
    </Tooltip>
  )
}
