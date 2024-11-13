import {memo, useCallback} from "react";
import {useOnViewportChange} from "@xyflow/react";
import {useDiagramStoreApi} from "@/hooks";
// import {useOnViewportChange} from "@xyflow/react";
// import {useAwareness} from "@/contexts/AwarenessContext";

export const ViewportChangeHandler = memo(() => {
  const storeApi = useDiagramStoreApi()
  const handleViewportChange = useCallback(() => {
    storeApi.setState(state => ({
      clients: [...state.clients]
    }))
  }, [])
  useOnViewportChange({onChange: handleViewportChange})

  return null
})
