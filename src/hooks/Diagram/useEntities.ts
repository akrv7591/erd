import {useMemo} from "react";
import {NODE_TYPES} from "@/screens/Playground/Main/NodeTypes";
import {EntityNode, NodeType} from "@/providers/shared-diagram-store-provider/type.ts";
import {useNodes} from "@/hooks/Diagram/useNodes.ts";

function entityNodeFilter(node: NodeType): node is EntityNode {
  return node.type === NODE_TYPES.ENTITY
}

export const useEntities = () => {
  const nodes = useNodes()
  return useMemo(() => {
    return nodes.filter(entityNodeFilter)
  }, [nodes])
}
