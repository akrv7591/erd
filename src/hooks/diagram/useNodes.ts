import {useDiagramStore} from "@/hooks";

export const useNodes = () => {
  const nodes = useDiagramStore(state => state.nodes)
  return nodes
}
