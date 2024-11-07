import { ActionIcon, Tooltip } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { memo } from "react";
import {useEntityNode} from "@/hooks";

export const DeleteEntityButton = memo(() => {
  const {onDelete} = useEntityNode()

  return (
    <Tooltip label={"Delete entity"}>
      <ActionIcon size={"lg"} onClick={onDelete} variant={"default"}>
        <IconTrash/>
      </ActionIcon>
    </Tooltip>
  )
})
