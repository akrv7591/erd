import {useMemo} from "react";
import {NODE_TYPES} from "@/screens/Playground/Main/NodeTypes";
import {useDiagramStore} from "@/contexts/DiagramContext.ts";
import {EntityNode, NodeType} from "@/providers/shared-diagram-store-provider/type.ts";

function entityNodeFilter(node: NodeType): node is EntityNode {
  return node.type === NODE_TYPES.ENTITY
}

export const useEntities = () => {
  const nodes = useDiagramStore(state => state.nodes)
  return useMemo(() => {
    return nodes.filter(entityNodeFilter)
  }, [nodes])
}
