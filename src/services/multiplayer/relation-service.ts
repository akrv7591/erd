import {usePlaygroundStore} from "@/stores/usePlaygroundStore.ts";
import {Edge} from "reactflow";

export const relationService = () => {

  function onAdd(data: Edge) {
    usePlaygroundStore.setState(cur => ({relations: [...cur.relations, data]}))
  }

  function onDelete(data: Edge) {
    usePlaygroundStore.setState(cur => ({relations: cur.relations.filter(t => t.id !== data.id)}))
  }

  return {
    onAdd,
    onDelete,
  }

}
