import {createContext, type MouseEvent as ReactMouseEvent, useCallback, useContext} from "react";
import {Awareness} from "y-protocols/awareness";
import {Node, ReactFlowProps, useReactFlow, Viewport, XYPosition} from "@xyflow/react";
import {MESSAGE_KEYS} from "@/providers/webrtc/constants.ts";
import {useSharedDiagramStoreApi} from "@/contexts/SharedDiagramContext.ts";

export type AwarenessContext = Awareness

export const AwarenessContext = createContext<Awareness>({} as Awareness)

export const useAwareness = () => {
  const awareness = useContext(AwarenessContext)
  const reactFlow = useReactFlow()
  const sharedDiagramStoreApi = useSharedDiagramStoreApi()
  const handleCursorChange = useCallback((cursor: XYPosition | null) => {
    awareness.setLocalStateField("cursor", cursor ? reactFlow.screenToFlowPosition(cursor, {snapToGrid: false}) : null)
  }, [])

  const handleViewportChange = useCallback((viewport: Viewport) => {
    awareness.setLocalStateField("viewport", viewport)
  }, [])

  const handleNodeDrag = useCallback((event: ReactMouseEvent, _: Node, nodes: Node[]) => {
    const positionValues = nodes.map(node => {
      return `${node.id}|${node.position.x}|${node.position.y}`
    })

    const cursor: XYPosition = {
      x: event.clientX,
      y: event.clientY
    }

    const localState = awareness.getLocalState()
    awareness.setLocalState({
      ...localState,
      cursor: reactFlow.screenToFlowPosition(cursor, {snapToGrid: false}),
      [MESSAGE_KEYS.position]: positionValues
    })
  }, [])

  const handleNodeDragStop: ReactFlowProps['onNodeDragStop'] = useCallback(() => {
    const localState = awareness.getLocalState()

    if (!localState) {
      return
    }

    const positionChanges = localState[MESSAGE_KEYS.position] as string[] | undefined

    if (positionChanges) {
      sharedDiagramStoreApi.getState().setNodePositions(positionChanges)
    }

    delete localState[MESSAGE_KEYS.position]
    awareness.setLocalState(localState)

  }, [])

  return {
    awareness,
    handleCursorChange,
    handleViewportChange,
    handleNodeDrag,
    handleNodeDragStop
  }
}
