import { useDiagramStore } from "./useDiagramStore"
import { useReactFlow, XYPosition } from "@xyflow/react"
import { useCallback, MouseEvent} from "react"
import {NodeType, DataBroadcast} from "@/types/diagram";
import {BROADCAST} from "@/namespaces";

export const usePeerBroadcast = () => {
  const {broadcastData, id: peerId} = useDiagramStore(state => state.webrtc)

  const reactFlow = useReactFlow()


  const handleCursorChange = useCallback((cursor: XYPosition | null) => {
    broadcastData([{
      type: BROADCAST.DATA.TYPE.CLIENT_CURSOR_CHANGE,
      value: {
        peerId,
        cursor: cursor? reactFlow.screenToFlowPosition(cursor, {snapToGrid: false}): null
      }
    }])
  }, [])

  // const handleViewportChange = useCallback((viewport: Viewport) => {
    // awareness.setLocalStateField("viewport", viewport)
  // }, [])

  const handleNodeDrag = useCallback((event: MouseEvent) => {

    const cursor: XYPosition = {
      x: event.clientX,
      y: event.clientY
    }

    handleCursorChange(cursor)

  }, [handleCursorChange])

  const handleNodeDragStop = useCallback((_: MouseEvent, __: NodeType, nodes: NodeType[]) => {
    const dataToBroadcast: DataBroadcast = {
      type: BROADCAST.DATA.TYPE.REACTFLOW_NODE_CHANGE,
      value: nodes.map(node => ({
        type: "position",
        position: node.position,
        id: node.id
      })),
      server: true
    }

    broadcastData([dataToBroadcast])
  }, [])

  return {
    // awareness,
    handleCursorChange,
    // handleViewportChange,
    handleNodeDrag,
    handleNodeDragStop
  }
}
