import {usePlaygroundStore} from "@/stores/usePlaygroundStore.ts";
import {ActionIcon, Tooltip} from "@mantine/core";
import {IconLetterE, IconLetterL} from "@tabler/icons-react";
import {EntityViewMode} from "@/enums/playground.ts";

export default function EntityLogicalAdvancedViewController() {
  const mode = usePlaygroundStore(state => state.mode)
  const setMode = usePlaygroundStore(state => state.setEntityViewMode)
  const isEditor = mode === EntityViewMode.EDITOR
  const toggle = () => setMode(isEditor? EntityViewMode.LOGICAL: EntityViewMode.EDITOR)
  return (
    <Tooltip label={isEditor? "Logical view": "Editor view"} position={"left"}>
      <ActionIcon
        mx={"5px"}
        w={"40px"}
        mt={"auto"}
        h={"40px"}
        variant={"default"}
        onClick={toggle}
      >
        {isEditor? <IconLetterL/>: <IconLetterE />}
      </ActionIcon>
    </Tooltip>
  )
}
