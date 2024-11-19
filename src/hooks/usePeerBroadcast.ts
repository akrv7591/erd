import { useDiagramStore } from "./useDiagramStore"
import { useReactFlow, XYPosition } from "@xyflow/react"
import { useCallback, MouseEvent} from "react"
import {NodeType} from "@/types/diagram";
import {BROADCAST} from "@/namespaces";
import {CLIENT} from "@/namespaces/broadcast/client";
import {REACTFLOW} from "@/namespaces/broadcast/reactflow";

export const usePeerBroadcast = () => {
  const {broadcastData, id} = useDiagramStore(state => state.socket)

  const reactFlow = useReactFlow()

  const handleCursorChange = useCallback((cursor: XYPosition | null) => {
    broadcastData([{
      type: CLIENT.CURSOR.TYPE.CHANGE,
      value: {
        id,
        cursor: cursor? reactFlow.screenToFlowPosition(cursor): null
      }
    }])
  }, [])

  const handleNodeDrag = useCallback((event: MouseEvent, node: NodeType, nodes: NodeType[]) => {
    const positionChanges: BROADCAST.DATA = {
      type: REACTFLOW.TYPE.NODE_CHANGE,
      value: nodes.map(node => ({
        type: "position",
        id: node.id,
        position: node.position,
      }))
    }

    const cursor: XYPosition = {
      x: event.clientX,
      y: event.clientY
    }

    const cursorChange: BROADCAST.DATA = {
      type: CLIENT.CURSOR.TYPE.CHANGE,
      value: {
        id,
        cursor: cursor? reactFlow.screenToFlowPosition(cursor): null
      }
    }

    broadcastData([
      positionChanges,
      cursorChange
    ])

    handleCursorChange(cursor)

  }, [handleCursorChange])

  return {
    handleCursorChange,
    handleNodeDrag,
  }
}
