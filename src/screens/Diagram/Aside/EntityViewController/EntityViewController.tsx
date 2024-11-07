import {Tooltip} from "@mantine/core";
import {IconLetterE, IconLetterL} from "@tabler/icons-react";
import {PlaygroundActionIcon} from "@/components/common/PlaygroundActionIcon";
import {DiagramStore} from "src/stores/diagram-store";
import {useShallow} from "zustand/react/shallow";
import {useDiagramStore} from "@/hooks";
import {DIAGRAM} from "@/namespaces";

const selector = ({entityViewMode, setEntityViewMode}: DiagramStore) => ({
  entityViewMode,
  setEntityViewMode
})

export const EntityViewController = () => {
  const store = useDiagramStore(useShallow(selector))
  const isEditor = store.entityViewMode === DIAGRAM.ENTITY.VIEW_MODE.EDITOR
  const toggle = () => store.setEntityViewMode(isEditor? DIAGRAM.ENTITY.VIEW_MODE.LOGICAL: DIAGRAM.ENTITY.VIEW_MODE.EDITOR)
  return (
    <Tooltip label={isEditor? "Logical view": "Editor view"} position={"left"}>
      <PlaygroundActionIcon mt={"auto"} onClick={toggle}>
        {isEditor? <IconLetterL/>: <IconLetterE />}
      </PlaygroundActionIcon>
    </Tooltip>
  )
}
