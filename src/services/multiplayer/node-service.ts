import {usePlaygroundStore} from "@/stores/usePlaygroundStore.ts";
import {Key} from "@/enums/playground.ts";
import {NodeType} from "@/types/playground";
import {NODE_TYPES} from "@/screens/Playground/Main/nodes";

export const makeNodeRedisKey = (erdId: string, type: NODE_TYPES,  nodeId: string) => `${Key.playgrounds}:${erdId}:${Key.nodes}:${type}:${nodeId}:${Key.position}`

export const nodeService = () => {
  const set = usePlaygroundStore.setState
  const state = usePlaygroundStore.getState()

  function onPatchPositions(data: {[key: string]: string}) {
    set(state => ({
      nodes: state.nodes.map(node => {
        const positionJson = data[makeNodeRedisKey(state.id, state.playground.nodesType.get(node.id)!, node.id)]

        if (positionJson) {
          return {
            ...node,
            position: JSON.parse(positionJson)
          }
        } else {
          return node
        }
      })
    }))
  }

  function onAdd(data: NodeType) {
    if (!data.type) {
      throw Error("Node type is required")
    }
    addNodesType(data.id, data.type!)
    set(state => ({nodes: [...state.nodes, data]}))
  }

  function onDelete(id: string | string[]) {
    const filterFunction = (node: NodeType) => {
      if (Array.isArray(id)) {
        id.forEach(deleteNodesType)
        return !id.includes(node.id)
      } else {
        deleteNodesType(id)
        return node.id !== id
      }
    }
    set(state => ({nodes: state.nodes.filter(filterFunction)}))
  }

  function deleteNodesType(id: string) {
    state.playground.nodesType.delete(id)
  }

  function addNodesType(id: string, type: NODE_TYPES) {
    state.playground.nodesType.set(id, type)
  }

  return {
    onPatchPositions,
    onDelete,
    onAdd,
  }

}
