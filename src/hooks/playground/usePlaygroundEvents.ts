import {usePlaygroundStore} from "@/stores/usePlaygroundStore.ts";
import {ReactFlowProps, useReactFlow} from "@xyflow/react";
import {Player} from "@/enums/playground.ts";
import {useCallback, useEffect} from "react";

export const usePlaygroundEvents = () => {
  const playground = usePlaygroundStore(state => state.playground)
  const subscribers = usePlaygroundStore(state => state.subscribers)
  const subscribedTo = usePlaygroundStore(state => state.subscribedTo)
  const viewport = usePlaygroundStore(state => state.viewport)
  const nodeOnDragAdd = usePlaygroundStore(state => state.nodeOnDragAdd)
  const reactFlow = useReactFlow()

  useEffect(() => {
    if (viewport && subscribedTo) {
      reactFlow.setViewport(viewport)
    }
  }, [viewport, subscribedTo])

  useEffect(() => {
    if (subscribers.length > 0) {
      playground.player(Player.viewpointChange, reactFlow.getViewport())
    }
  })

  const handleMouseChange = useCallback((pos: {x: number, y: number} | null) => {
    playground.player(
      Player.mouseChange,
      pos ?reactFlow.screenToFlowPosition(pos, {snapToGrid: false}): pos)
  }, [reactFlow])

  const onDragOver: ReactFlowProps['onDragOver'] = (e: any) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }

  const onNodeDrag: ReactFlowProps['onNodeDrag'] = (e) => handleMouseChange({x: e.clientX, y: e.clientY})


  const onMouseLeave: ReactFlowProps['onMouseLeave'] = () => handleMouseChange(null)
  const onMouseMove: ReactFlowProps['onMouseMove'] = (e) => handleMouseChange({x: e.clientX, y: e.clientY})
  const onMove: ReactFlowProps['onMove'] = (e, viewport) => {
    if (subscribers.length > 0) {
      playground.player(Player.viewpointChange, viewport)
    }

    if (e instanceof MouseEvent) {
      handleMouseChange({x: e.clientX, y: e.clientY})
    }
  }

  const onClick: ReactFlowProps['onClick'] = () => {
    if (subscribedTo) {
      playground.player(Player.unsubscribe, subscribedTo)
    }
  }

  const onDrop: ReactFlowProps['onDrop'] = nodeOnDragAdd({reactFlowInstance: reactFlow})

  const onNodeDoubleClick: ReactFlowProps['onNodeDoubleClick'] = (_, node) => reactFlow.fitView({
    nodes: [node],
    duration: 500
  })

  return {
    onDragOver,
    onNodeDrag,
    onMouseLeave,
    onMouseMove,
    onMove,
    onNodeDoubleClick,
    onClick,
    onDrop
  }
}
