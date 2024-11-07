import { memo } from "react";
import { NameInput } from "./NameInput";
import { RowControls } from "./RowControls";
import { ColorChangeInput } from "./ColorChangeInput";
import { Group } from "@mantine/core";
import { DeleteEntityButton } from "./DeleteEntityButton";

export const Header = memo(() => {
  return (
    <Group gap={5} h={50} align={"flex-start"}>
      <NameInput />
      <RowControls />
      <ColorChangeInput />
      <DeleteEntityButton />
    </Group>
  )
})
