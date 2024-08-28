import {useSharedDiagramStore} from "@/contexts/SharedDiagramContext.ts";
import {useMemo} from "react";
import {objValuesToArray} from "@/utility/ObjectUtils.ts";

export const useEdges = () => {
  const edges = useSharedDiagramStore(state => state.edges)
  return useMemo(() => {
    return objValuesToArray(edges)
  }, [edges])
}
