import {memo} from "react";
import {Background, BackgroundVariant} from "@xyflow/react";
import {ConfirmModal} from "./ConfirmModal";
import {Icons} from "./Icons";
import {MiniMap} from "./MiniMap";

export const FlowUtils = memo(() => {
  return (
    <>
      <ConfirmModal/>
      <Icons/>
      <MiniMap/>
      <Background variant={BackgroundVariant.Dots} gap={20} size={1}/>
    </>
  )
})
