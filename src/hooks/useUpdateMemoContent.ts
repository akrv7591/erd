import { useCallback } from "react"
import { useMemoNode } from "./useMemoNode"
import { useDiagramStore } from "./useDiagramStore"
import { NODE } from "@/namespaces/broadcast/node"

export const useUpdateMemoContent = () => {
  const {id: memoId, data} = useMemoNode()
  const socket = useDiagramStore(state => state.socket)
  const pushUndo = useDiagramStore(state => state.pushUndo)
  const applyChanges = useDiagramStore(state => state.applyDataChanges)

  const updateContent = useCallback((content: string) => {
    const updates: NODE.MEMO.CONTENT_UPDATE[] = [{
      type: NODE.MEMO.TYPE.CONTENT_UPDATE,
      value: {
        memoId,
        content
      }
    }]

    const current: NODE.MEMO.CONTENT_UPDATE[] = [{
      type: NODE.MEMO.TYPE.CONTENT_UPDATE,
      value: {
        memoId,
        content: data.content
      }
    }]

    applyChanges(updates)
    socket.broadcastData(updates)
    pushUndo({
      undo: current,
      redo: updates
    })

  }, [data.content])

  return updateContent
}
