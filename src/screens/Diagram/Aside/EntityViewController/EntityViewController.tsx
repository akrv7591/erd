import {Tooltip} from "@mantine/core";
import {IconLetterE, IconLetterL} from "@tabler/icons-react";
import {PlaygroundActionIcon} from "@/components/common/PlaygroundActionIcon";
import {DIAGRAM} from "@/namespaces";
import {memo, useMemo} from "react";
import {useDiagramStore} from "@/hooks/useDiagramStore";


export const EntityViewController = memo(() => {
  const entityViewMode = useDiagramStore(state => state.entityViewMode)
  const isEditor = useMemo(() => {
    return entityViewMode === DIAGRAM.ENTITY.VIEW_MODE.EDITOR
  }, [entityViewMode])
  const toggleEntityViewMode = useDiagramStore(state => state.toggleEntityViewMode)

  return (
    <Tooltip label={isEditor? "Logical view": "Editor view"} position={"left"}>
      <PlaygroundActionIcon mt={"auto"} onClick={toggleEntityViewMode}>
        {isEditor? <IconLetterL/>: <IconLetterE />}
      </PlaygroundActionIcon>
    </Tooltip>
  )
})
