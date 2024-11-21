import { useMemo } from "react"
import { useDiagramStore } from "./useDiagramStore"

export const useUndoRedo = () => {
  const undoStack = useDiagramStore(state => state.undoStack)
  const redoStack = useDiagramStore(state => state.redoStack)
  const undo = useDiagramStore(state => state.undo)
  const redo = useDiagramStore(state => state.redo)

  return useMemo(() => {
    const canUndo = undoStack.length > 0
    const canRedo = redoStack.length > 0

    return {
      canUndo,
      canRedo,
      undo,
      redo,
    }
  }, [undoStack, redoStack, undo, redo])
}
