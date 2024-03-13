import {usePlaygroundStore} from "@/stores/usePlaygroundStore.ts";
import {Edge} from "@xyflow/react";

export const relationService = () => {

  function onAdd(data: Edge) {
    usePlaygroundStore.setState(cur => ({relations: [...cur.relations, data]}))
  }

  function onDelete(id: string) {
    usePlaygroundStore.setState(cur => ({relations: cur.relations.filter(t => t.id !== id)}))
  }

  return {
    onAdd,
    onDelete,
  }

}
