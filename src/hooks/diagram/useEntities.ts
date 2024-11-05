import {useMemo} from "react";
import {NODE_TYPES} from "@/screens/Playground/Main/NodeTypes";
import {EntityNode, NodeType} from "@/types/diagram";
import {useNodes} from "@/hooks";

function entityNodeFilter(node: NodeType): node is EntityNode {
  return node.type === NODE_TYPES.ENTITY
}

export const useEntities = () => {
  const nodes = useNodes()
  return useMemo(() => {
    return nodes.filter(entityNodeFilter)
  }, [nodes])
}
