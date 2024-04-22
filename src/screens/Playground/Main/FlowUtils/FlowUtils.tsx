import {memo} from "react";
import {Background, BackgroundVariant} from "@xyflow/react";
import Minimap from "@/screens/Playground/Main/FlowUtils/Minimap.tsx";

const FlowUtils = memo(() => {

  return (
    <>
      <Minimap/>
      <Background variant={BackgroundVariant.Dots} gap={20} size={1}/>
    </>
  )
})

export default FlowUtils
