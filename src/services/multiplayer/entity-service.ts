import {usePlaygroundStore} from "@/stores/usePlaygroundStore.ts";
import {EntityNodeData} from "@/types/entity-node";


export type EntityWebsocketPatch = {
  entityId: string,
  key: keyof EntityNodeData,
  value: any
}

export const entityService = () => {

  function onPatch(data: EntityWebsocketPatch) {
    usePlaygroundStore.setState(cur => ({
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
