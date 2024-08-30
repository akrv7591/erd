import '@xyflow/react/dist/style.css';
import {Main} from "./Main";
import {useDiagramStore} from "@/contexts/DiagramContext.ts";
import LoadingBackdrop from "@/components/common/LoadingBackdrop.tsx";

export const Playground = () => {
  const synced = useDiagramStore(state => state.synced)

  if (!synced) return (
    <LoadingBackdrop />
  )

  return (
    <Main />
  )
}

