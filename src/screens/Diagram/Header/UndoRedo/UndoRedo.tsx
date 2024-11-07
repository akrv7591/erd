import {memo, useCallback} from "react";
import {ButtonGroup, Tooltip} from "@mantine/core";
import {IconArrowLeft, IconArrowRight} from "@tabler/icons-react";
import {PlaygroundActionIcon} from "@/components/common/PlaygroundActionIcon";
import {useDiagramStore} from "@/hooks";

export const UndoRedo = memo(() => {
  const canUndo = useDiagramStore(state => state.canUndo)
  const canRedo = useDiagramStore(state => state.canRedo)
  // const undoManager = useDiagramStore(state => state.undoManager)
  const handleUndo = useCallback(() => {
    if (!canUndo) {
      return
    }
    // undoManager.undo()
  }, [canUndo])

  const handleRedo = useCallback(() => {
    if (!canRedo) {
      return
    }
    // undoManager.redo()
  }, [canRedo])
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
