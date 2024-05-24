import type {MemoNodeData} from "@/types/memo-node";
import {ServiceArgs} from "@/services/multiplayer/multiplayer";

export type MemoWebsocketPatch = {
  memoId: string,
  key: keyof MemoNodeData,
  value: any
}

export const memoService = ({store}: ServiceArgs) => {
  const set = store.setState

  function onPatch({memoId, key, value}: MemoWebsocketPatch) {
    set(cur => ({
      nodes: cur.nodes.map(memo => memo.id === memoId ? {
        ...memo,
        data: {...memo.data, [key]: value}
      } : memo)
    }))
  }

  return {
    onPatch,
  }

}
