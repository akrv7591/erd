import {Tooltip} from "@mantine/core";
import {useReactFlow} from "@xyflow/react";
import {IconFocusCentered} from "@tabler/icons-react";
import {PlaygroundActionIcon} from "@/components/common/PlaygroundActionIcon";

export const FitView = () => {
  const reactflow = useReactFlow()

  const handleOverview = () => {
    const nodes = reactflow.getNodes()
    reactflow.fitView({nodes, duration: 200})
  }
  return (
    <Tooltip position={"right"} withArrow label={"Fit view"}>
      <PlaygroundActionIcon onClick={handleOverview}>
        <IconFocusCentered />
      </PlaygroundActionIcon>
    </Tooltip>
  )
}
