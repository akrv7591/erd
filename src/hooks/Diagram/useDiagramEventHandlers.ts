import {OnMove, ReactFlowProps} from "@xyflow/react";
import {useSharedDiagramStore} from "@/contexts/SharedDiagramContext.ts";
import {useDiagramStore} from "@/contexts/DiagramContext.ts";
import {useAwareness} from "@/contexts/AwarenessContext.ts";
import {DragEventHandler, MouseEventHandler, useCallback} from "react";
import {NodeType} from "@/providers/shared-diagram-store-provider/type.ts";

type ReturnType = Pick<ReactFlowProps<NodeType>,
  'onEdgesChange' |
  'onConnect' |
  'onDrop' |
  'onBeforeDelete' |
  'onNodesDelete' |
  'onNodesChange' |
  'onNodeDragStop' |
  'onNodeDrag' |
  'onMouseLeave' |
  'onMouseEnter' |
  'onMouseMove' |
  'onMove' |
  'onDragOver'
>

export const useDiagramEventHandlers = (): ReturnType => {
  // Shared Diagram store
  const onEdgesChange = useSharedDiagramStore(state => state.handleEdgeChanges)
  const onConnect = useSharedDiagramStore(state => state.setConnection)
  const onDrop = useSharedDiagramStore(state => state.nodeOnDragAdd)
  const onBeforeDelete = useSharedDiagramStore(state => state.handleOnBeforeDelete)
  const onNodesDelete = useSharedDiagramStore(state => state.handleNodesDelete)

  // Local Diagram store
  const onNodesChange = useDiagramStore(state => state.handleNodeChanges)

  const {
    handleNodeDrag,
    handleNodeDragStop,
    handleCursorChange,
  } = useAwareness()

  const onNodeDragStop = handleNodeDragStop
  const onNodeDrag = handleNodeDrag

  const onMouseLeave: ReturnType['onMouseLeave'] = useCallback(() => {
    handleCursorChange(null)
  }, [handleCursorChange])

  const onMouseEnter: MouseEventHandler<HTMLDivElement> = useCallback((e) => {
    handleCursorChange({x: e.clientX, y: e.clientY})
  }, [handleCursorChange])

  const onMouseMove: MouseEventHandler<HTMLDivElement> = useCallback((e) => {
    handleCursorChange({x: e.clientX, y: e.clientY})
  }, [handleCursorChange])

  const onMove: OnMove = useCallback((e) => {
    if (e instanceof MouseEvent) {
      const position = {x: e.clientX, y: e.clientY}
      handleCursorChange(position)
    }
  }, [handleCursorChange])
  const onDragOver: DragEventHandler<HTMLDivElement> = useCallback((e) => {
    e.preventDefault();

    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'move';
    }
  }, [])

  return {
    onEdgesChange,
    onConnect,
    onDrop,
    onBeforeDelete,
    onNodesDelete,
    onNodesChange,
    onNodeDragStop,
    onNodeDrag,
    onMouseLeave,
    onMouseEnter,
    onMouseMove,
    onMove,
    onDragOver,
  }
}
