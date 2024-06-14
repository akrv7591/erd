import {Tooltip} from "@mantine/core";
import {IconLetterE, IconLetterL} from "@tabler/icons-react";
import {EntityViewMode} from "@/enums/playground.ts";
import {usePlayground} from "@/contexts/playground/PlaygroundStoreContext.ts";
import {PlaygroundActionIcon} from "@/components/common/PlaygroundActionIcon";

export const EntityViewController = () => {
  const mode = usePlayground(state => state.mode)
  const setMode = usePlayground(state => state.setEntityViewMode)
  const isEditor = mode === EntityViewMode.EDITOR
  const toggle = () => setMode(isEditor? EntityViewMode.LOGICAL: EntityViewMode.EDITOR)
  return (
    <Tooltip label={isEditor? "Logical view": "Editor view"} position={"left"}>
      <PlaygroundActionIcon mt={"auto"} onClick={toggle}>
        {isEditor? <IconLetterL/>: <IconLetterE />}
      </PlaygroundActionIcon>
    </Tooltip>
  )
}
