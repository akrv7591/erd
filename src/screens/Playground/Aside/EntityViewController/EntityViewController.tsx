import {Tooltip} from "@mantine/core";
import {IconLetterE, IconLetterL} from "@tabler/icons-react";
import {EntityViewMode} from "@/enums/playground.ts";
import {PlaygroundActionIcon} from "@/components/common/PlaygroundActionIcon";
import {DiagramStore} from "src/stores/diagram-store";
import {useShallow} from "zustand/react/shallow";
import {useDiagramStore} from "@/contexts/DiagramContext";

const selector = ({entityViewMode, setEntityViewMode}: DiagramStore) => ({
  entityViewMode,
  setEntityViewMode
})

export const EntityViewController = () => {
  const store = useDiagramStore(useShallow(selector))
  const isEditor = store.entityViewMode === EntityViewMode.EDITOR
  const toggle = () => store.setEntityViewMode(isEditor? EntityViewMode.LOGICAL: EntityViewMode.EDITOR)
  return (
    <Tooltip label={isEditor? "Logical view": "Editor view"} position={"left"}>
      <PlaygroundActionIcon mt={"auto"} onClick={toggle}>
        {isEditor? <IconLetterL/>: <IconLetterE />}
      </PlaygroundActionIcon>
    </Tooltip>
  )
}
