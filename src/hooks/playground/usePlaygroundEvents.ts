import {usePlaygroundStore} from "@/stores/usePlaygroundStore.ts";
import {ReactFlowProps, useReactFlow} from "@xyflow/react";
import {PlayerEnum} from "@/enums/playground.ts";
import {useCallback, useEffect} from "react";

export const usePlaygroundEvents = () => {
  const playground = usePlaygroundStore(state => state.playground)
  const subscribers = usePlaygroundStore(state => state.subscribers)
  const subscribedTo = usePlaygroundStore(state => state.subscribedTo)
  const viewport = usePlaygroundStore(state => state.viewport)
  const nodeOnDragAdd = usePlaygroundStore(state => state.nodeOnDragAdd)
  const setZoom = usePlaygroundStore(state => state.setZoom)
  const reactFlow = useReactFlow()

  useEffect(() => {
    if (viewport && subscribedTo) {
      reactFlow.setViewport(viewport)
    }
  }, [viewport, subscribedTo])

  const handleMouseChange = useCallback((pos: { x: number, y: number } | null) => {
    if (!playground) return

    if (pos) {
      pos = reactFlow.screenToFlowPosition(pos, {snapToGrid: false})
    }

    playground.player(PlayerEnum.mouseChange, pos)

  }, [playground])

  const onDragOver: ReactFlowProps['onDragOver'] = (e: any) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }

  const onDrop: ReactFlowProps['onDrop'] = nodeOnDragAdd({reactFlowInstance: reactFlow})


  const onNodeDrag: ReactFlowProps['onNodeDrag'] = (e) => handleMouseChange({x: e.clientX, y: e.clientY})
  const onMouseLeave: ReactFlowProps['onMouseLeave'] = () => handleMouseChange(null)
  const onMouseMove: ReactFlowProps['onMouseMove'] = (e) => handleMouseChange({x: e.clientX, y: e.clientY})

  const onMove: ReactFlowProps['onMove'] = (e, viewport) => {
    if (subscribers.length > 0) {
      playground.player(PlayerEnum.viewpointChange, viewport)
    }

    if (e instanceof MouseEvent) {
      handleMouseChange({x: e.clientX, y: e.clientY})
    }

    setZoom(viewport.zoom)
  }

  const onClick: ReactFlowProps['onClick'] = () => {
    if (subscribedTo) {
      playground.player(PlayerEnum.unsubscribe, subscribedTo)
    }
  }


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
