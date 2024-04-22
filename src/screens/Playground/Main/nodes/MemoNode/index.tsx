import {memo} from "react";
import ThemedNode from "@/screens/Playground/Main/nodes/MemoNode/ThemedNode.tsx";

import type {NodeProps} from "@xyflow/react";
import type {MemoNode} from "@/types/memo-node";

const MemoNode = memo((props: NodeProps<MemoNode>) => {
  return (
    <ThemedNode id={props.id}/>
  )
})

export default MemoNode
