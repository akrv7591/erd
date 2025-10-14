import { ActionIcon, Tooltip } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { memo } from "react";
import { useNodeId} from "@/hooks/useNodeId";
import { useReactFlow } from "@xyflow/react";

export const DeleteEntityButton = memo(() => {
  const reactFlow = useReactFlow()
  const nodeId = useNodeId()
  const handleDelete = () => reactFlow.deleteElements({nodes: [{id: nodeId}]})

  return (
    <Tooltip label={"Delete entity"}>
      <ActionIcon size={"lg"} onClick={handleDelete} variant={"default"}>
        <IconTrash/>
      </ActionIcon>
    </Tooltip>
  )
})
