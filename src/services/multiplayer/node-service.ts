import {usePlaygroundStore} from "@/stores/usePlaygroundStore.ts";
import {Key} from "@/enums/playground.ts";
import {NodeType} from "@/types/playground";

export const makeNodeRedisKey = (erdId: string, nodeId: string) => `${Key.playgrounds}:${erdId}:${Key.nodes}:${nodeId}:${Key.position}`

export const nodeService = () => {
  const set = usePlaygroundStore.setState

  function onPatchPositions(data: {[key: string]: string}) {
    set(state => ({
      nodes: state.nodes.map(node => {
        const positionJson = data[makeNodeRedisKey(state.id, node.id)]

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

  function onDelete(id: string | string[]) {
    const filterFunction = (node: NodeType) => {
      if (Array.isArray(id)) {
        return !id.includes(node.id)
      } else {
        return node.id !== id
      }
    }
    set(state => ({nodes: state.nodes.filter(filterFunction)}))
  }

  return {
    onPatchPositions,
    onDelete
  }

}
