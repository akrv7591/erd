import {memo, useCallback} from "react";
import {useOnViewportChange, Viewport} from "@xyflow/react";
import {useDiagramStore} from "@/hooks";
import { SOCKET } from "@/namespaces";

export const ViewportChangeHandler = memo(() => {
  const subscribers = useDiagramStore(state => state.subscribers)
  const socket = useDiagramStore(state => state.socket)


  const handleViewportChange = useCallback((viewport: Viewport) => {
    if (!subscribers.length) {
      return
    }

    socket.io.emit(SOCKET.USER.VIEWPORT_CHANGE, viewport)
  }, [subscribers, socket])
  useOnViewportChange({onChange: handleViewportChange})

  return null
})
