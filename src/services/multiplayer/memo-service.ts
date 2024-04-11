import {usePlaygroundStore} from "@/stores/usePlaygroundStore.ts";

import type {MemoNode} from "@/types/memo-node";

export const memoService = () => {

  function onAdd(data: MemoNode) {
    usePlaygroundStore.setState(state => ({memos: [...state.memos, data]}))
  }

  function onPut(data: Partial<MemoNode>) {
    usePlaygroundStore.setState(state => ({memos: state.memos.map(memo => memo.id === data.id ? {...memo, ...data} : memo)}))
  }

  function onDelete(memoId: string) {
    usePlaygroundStore.setState(state => ({memos: state.memos.filter(memo => memo.id !== memoId)}))
  }

  function onPatch({memoId, key, value}: any) {
    usePlaygroundStore.setState(cur => ({
      memos: cur.memos.map(memo => memo.id === memoId ? {
        ...memo,
        data: {...memo.data, [key]: value}
      } : memo)
    }))
  }

  return {
    onAdd,
    onPut,
    onPatch,
    onDelete,
  }

}
