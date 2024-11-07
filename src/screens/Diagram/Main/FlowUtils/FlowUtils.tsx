import {memo} from "react";
import {Background, BackgroundVariant} from "@xyflow/react";
import {Icons} from "./Icons";
import {MiniMap} from "./MiniMap";
import {ConfirmModal} from "@/screens/Diagram/Main/FlowUtils/ConfirmModal";
import {UserCursors} from "@/screens/Diagram/Main/FlowUtils/UserCursors";
import {ViewportChangeHandler} from "./ViewportChangeHandler";
import {FpsDebugPanel} from "@/screens/Diagram/Main/FlowUtils/FpsDebugPanel";

export const FlowUtils = memo(() => {
  return (
    <>
      {import.meta.env.DEV && (
        <FpsDebugPanel/>
      )}
      <UserCursors/>
      <ConfirmModal/>
      <Icons/>
      <MiniMap/>
      <Background variant={BackgroundVariant.Dots} gap={20} size={1}/>
      <ViewportChangeHandler />
    </>
  )
})
