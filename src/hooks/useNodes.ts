import {useDiagramStore} from "./useDiagramStore";

export const useNodes = () => {
  const nodes = useDiagramStore(state => state.nodes)
  return nodes
}
