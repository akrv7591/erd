import {Edge} from "@xyflow/react";
import {ServiceArgs} from "@/services/multiplayer/multiplayer";

export const relationService = ({store}: ServiceArgs) => {
  const set = store.setState

  function onAdd(data: Edge) {
    set(cur => ({relations: [...cur.relations, data]}))
  }

  function onDelete(id: string) {
    set(cur => ({relations: cur.relations.filter(t => t.id !== id)}))
  }

  return {
    onAdd,
    onDelete,
  }

}
