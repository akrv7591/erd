import {useMemo} from "react";
import {NODE_TYPES} from "@/screens/Diagram/Main/NodeTypes";
import {EntityNode, NodeType} from "@/types/diagram";
import {useNodes} from "./useNodes";

function entityNodeFilter(node: NodeType): node is EntityNode {
  return node.type === NODE_TYPES.ENTITY
}

export const useEntities = () => {
  const nodes = useNodes()
  return useMemo(() => {
    return nodes.filter(entityNodeFilter)
  }, [nodes])
}
