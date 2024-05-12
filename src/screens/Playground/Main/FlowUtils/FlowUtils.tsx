import {memo} from "react";
import {Background, BackgroundVariant} from "@xyflow/react";
import Minimap from "@/screens/Playground/Main/FlowUtils/Minimap.tsx";
import ConfirmModal from "@/components/common/ConfirmModal";
import Icons from "@/screens/Playground/Main/Icons";
import ViewportActions from "@/screens/Playground/Main/FlowUtils/ViewportActions.tsx";

const FlowUtils = memo(() => {
  console.log("RENDERING FLOW UTILS")

  return (
    <>
      <ConfirmModal/>
      <Icons/>
      <Minimap/>
      <Background variant={BackgroundVariant.Dots} gap={20} size={1}/>
      <ViewportActions />
    </>
  )
})

export default FlowUtils
