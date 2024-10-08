import {memo} from "react";
import {Background, BackgroundVariant} from "@xyflow/react";
import {Icons} from "./Icons";
import {MiniMap} from "./MiniMap";
import {ConfirmModal} from "@/screens/Playground/Main/FlowUtils/ConfirmModal";
import {UserCursors} from "@/screens/Playground/Main/FlowUtils/UserCursors";
import {ViewportChangeHandler} from "./ViewportChangeHandler";

export const FlowUtils = memo(() => {
  return (
    <>
      <UserCursors/>
      <ConfirmModal/>
      <Icons/>
      <MiniMap/>
      <Background variant={BackgroundVariant.Dots} gap={20} size={1}/>
      <ViewportChangeHandler />
    </>
  )
})
