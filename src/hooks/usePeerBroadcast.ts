import { useDiagramStore } from "./useDiagramStore"
import { NodePositionChange, useReactFlow, XYPosition } from "@xyflow/react"
import { useCallback, MouseEvent} from "react"
import {NodeType} from "@/types/diagram";
import {SOCKET} from "@/namespaces";

export const usePeerBroadcast = () => {
  const {io} = useDiagramStore(state => state.socket)

  const reactFlow = useReactFlow()

  const handleCursorChange = useCallback((cursor: XYPosition | null) => {
    io.emit(SOCKET.USER.CURSOR_CHANGE, {id: io.id!, cursor: cursor? reactFlow.screenToFlowPosition(cursor): null})
  }, [])

  const handleNodeDrag = useCallback((event: MouseEvent, node: NodeType, nodes: NodeType[]) => {
    const positionChanges: NodePositionChange[] = nodes.map(node => ({
      type: "position",
      id: node.id,
      position: node.position,
      dragging: true
    }))

    const cursor: XYPosition = {
      x: event.clientX,
      y: event.clientY
    }

    io.emit(SOCKET.USER.NODE_DRAG, positionChanges)
    handleCursorChange(cursor)

  }, [handleCursorChange])

  const setCursorNull = useCallback(() => {
    handleCursorChange(null)
  }, [handleCursorChange])

  return {
    handleCursorChange,
    handleNodeDrag,
    setCursorNull
  }
}
