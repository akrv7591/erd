import {memo} from "react";
import {useOnViewportChange} from "@xyflow/react";
import {useAwareness} from "@/contexts/AwarenessContext.ts";

export const ViewportChangeHandler = memo(() => {
  const {handleViewportChange} = useAwareness()

  useOnViewportChange({onChange: handleViewportChange})

  return null
})
