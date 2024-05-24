import {memo} from "react";
import {Background, BackgroundVariant} from "@xyflow/react";
import Minimap from "@/screens/Playground/Main/FlowUtils/Minimap.tsx";
import ConfirmModal from "@/components/common/ConfirmModal";
import Icons from "@/screens/Playground/Main/Icons";

const FlowUtils = memo(() => {
  return (
    <>
      <ConfirmModal/>
      <Icons/>
      <Minimap/>
      <Background variant={BackgroundVariant.Dots} gap={20} size={1}/>
    </>
  )
})

export default FlowUtils
