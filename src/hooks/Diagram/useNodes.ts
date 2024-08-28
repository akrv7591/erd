import {useSharedDiagramStore} from "@/contexts/SharedDiagramContext.ts";
import {useMemo} from "react";
import {useDiagramStore} from "@/contexts/DiagramContext";
import {NodeType} from "@/providers/shared-diagram-store-provider/type.ts";

export const useNodes = () => {
  const nodes = useDiagramStore(state => state.nodes)
  const sharedNodes = useSharedDiagramStore(state => state.nodes)

  return useMemo(() => {
    return nodes.map(node => {
      return {
        ...node,
        data: sharedNodes[node.id].data
      } as NodeType
    })
  }, [nodes, sharedNodes])
}
