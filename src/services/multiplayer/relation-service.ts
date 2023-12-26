import {useErdDiagramStore} from "@/stores/useErdDiagramStore.ts";
import {Edge} from "reactflow";

export const relationService = () => {

  function onAdd(data: Edge) {
    useErdDiagramStore.setState(cur => ({relations: [...cur.relations, data]}))
  }

  function onDelete(data: Edge) {
    useErdDiagramStore.setState(cur => ({relations: cur.relations.filter(t => t.id !== data.id)}))
  }

  return {
    onAdd,
    onDelete,
  }

}
