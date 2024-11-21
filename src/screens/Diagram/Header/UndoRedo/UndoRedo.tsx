import {memo} from "react";
import {ButtonGroup, Tooltip} from "@mantine/core";
import {IconArrowLeft, IconArrowRight} from "@tabler/icons-react";
import {PlaygroundActionIcon} from "@/components/common/PlaygroundActionIcon";
import {useUndoRedo} from "@/hooks";

export const UndoRedo = memo(() => {
  const {canUndo, canRedo, undo: handleUndo, redo: handleRedo} = useUndoRedo()

  return (
    <ButtonGroup>
      <Tooltip label={"Undo"}>
        <PlaygroundActionIcon disabled={!canUndo} variant={"default"} onClick={handleUndo}>
          <IconArrowLeft />
        </PlaygroundActionIcon>
      </Tooltip>
      <Tooltip label={"Redo"}>
        <PlaygroundActionIcon disabled={!canRedo} ml={"5px"} variant={"default"} onClick={handleRedo}>
          <IconArrowRight />
        </PlaygroundActionIcon>
      </Tooltip>
    </ButtonGroup>
  )
})
