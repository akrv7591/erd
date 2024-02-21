import {ActionIcon, Tooltip} from "@mantine/core";
import {useReactFlow} from "@xyflow/react";
import {IconMaximize} from "@tabler/icons-react";

export default function FitView() {
  const reactflow = useReactFlow()
  const nodes = reactflow.getNodes()

  const handleOverview = () => reactflow.fitView({nodes, duration: 200})
  return (
    <Tooltip position={"right"} withArrow label={"Fit view"}>
      <ActionIcon h={"40px"} w={"40px"} variant={"default"} onClick={handleOverview}>
        <IconMaximize />
      </ActionIcon>
    </Tooltip>
  )
}
