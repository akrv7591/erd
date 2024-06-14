import {memo} from "react";
import { SourceHandle } from "./SourceHandle";
import { TargetHandle } from "./TargetHandle";

export const RelationsOverlay = memo(() => {
  return (
    <>
      <SourceHandle/>
      <TargetHandle/>
    </>
  )
})
