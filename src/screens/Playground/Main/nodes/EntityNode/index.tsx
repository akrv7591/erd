import {NodeProps} from "@xyflow/react";
import React from "react";
import type {EntityNode} from "@/types/entity-node";
import ThemedNode from "@/screens/Playground/Main/nodes/EntityNode/ThemedNode.tsx";

interface Props extends NodeProps<EntityNode> {
}

const EntityNode = React.memo((props: Props) => {
  return (
    <ThemedNode id={props.id} selected={props.selected || false}/>
  )
})

export default EntityNode
