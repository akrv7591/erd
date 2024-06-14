import { useEntityNodeData } from "@/hooks/useEntityNodeData.ts";
import { ActionIcon, Tooltip } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { useReactFlow } from "@xyflow/react";
import { memo } from "react";

export const DeleteEntityButton = memo(() => {
  const {id} = useEntityNodeData()
  const reactFlow = useReactFlow()

  const handleDelete = () => {
    reactFlow.deleteElements({
      nodes: [{id}]
    })
  }
  return (
    <Tooltip label={"Delete entity"}>
      <ActionIcon size={"lg"} onClick={handleDelete} color={"red"} variant={"subtle"}>
        <IconTrash/>
      </ActionIcon>
    </Tooltip>
  )
})
