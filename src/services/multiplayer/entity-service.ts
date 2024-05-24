import {EntityNodeData} from "@/types/entity-node";
import {ServiceArgs} from "@/services/multiplayer/multiplayer";


export type EntityWebsocketPatch = {
  entityId: string,
  key: keyof EntityNodeData,
  value: any
}

export const entityService = ({store}: ServiceArgs) => {
  const set = store.setState

  function onPatch(data: EntityWebsocketPatch) {
    set(cur => ({
      nodes: cur.nodes.map(entity => entity.id === data.entityId ? {
        ...entity,
        data: {...entity.data, [data.key]: data.value}
      } : entity)
    }))
  }

  return {
    onPatch,
  }

}
