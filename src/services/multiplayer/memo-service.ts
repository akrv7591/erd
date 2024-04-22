import {usePlaygroundStore} from "@/stores/usePlaygroundStore.ts";

import type {MemoNode, MemoNodeData} from "@/types/memo-node";

export type MemoWebsocketPatch = {
  memoId: string,
  key: keyof MemoNodeData,
  value: any
}

export const memoService = () => {

  function onAdd(data: MemoNode) {
    usePlaygroundStore.setState(state => ({nodes: [...state.nodes, data]}))
  }

  function onPatch({memoId, key, value}: MemoWebsocketPatch) {
    usePlaygroundStore.setState(cur => ({
      nodes: cur.nodes.map(memo => memo.id === memoId ? {
        ...memo,
        data: {...memo.data, [key]: value}
      } : memo)
    }))
  }

  return {
    onAdd,
    onPatch,
  }

}
