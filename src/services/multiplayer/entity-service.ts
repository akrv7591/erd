import {usePlaygroundStore} from "@/stores/usePlaygroundStore.ts";
import {applyNodeChanges, NodeChange} from "@xyflow/react";
import {EntityNode} from "@/types/entity-node";

export const entityService = () => {

  function onAdd(data: EntityNode) {
    usePlaygroundStore.setState(state => ({entities: [...state.entities, data]}))
  }

  function onUpdate(data: NodeChange<EntityNode>) {
    usePlaygroundStore.setState(state => ({entities: applyNodeChanges<EntityNode>([data], state.entities)}))
  }

  function onMove(data: NodeChange<EntityNode>[]) {
    usePlaygroundStore.setState(state => ({entities: applyNodeChanges<EntityNode>(data, state.entities)}))
  }

  function onDelete(data: string) {
    usePlaygroundStore.setState(state => ({entities: state.entities.filter(entity => entity.id !== data)}))
  }

  function onSet({entityId, data}: any) {
    usePlaygroundStore.setState(cur => ({
      entities: cur.entities.map(entity => entity.id === entityId ? {
        ...entity,
        data: {...entity.data, ...data}
      } : entity)
    }))
  }

  return {
    onAdd,
    onUpdate,
    onDelete,
    onSet,
    onMove
  }

}
