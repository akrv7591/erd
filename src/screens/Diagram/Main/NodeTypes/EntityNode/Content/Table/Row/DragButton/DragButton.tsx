import {ActionIcon} from "@mantine/core";
import {IconGripVertical} from "@tabler/icons-react";

export const DragButton = () => {
  return (
    <ActionIcon variant={"transparent"}>
      <IconGripVertical stroke={1} data-movable-handle/>
    </ActionIcon>
  )
}
