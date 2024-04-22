import {XYPosition} from "@xyflow/react";
import {StateCreator} from "zustand";
import {UsePlaygroundStore} from "@/stores/usePlaygroundStore.ts";
import {MemoEnum} from "@/enums/playground.ts";
import {MemoNode} from "@/types/memo-node";
import {ICMemo} from "@/types/data/db-model-interfaces";
import {useAuthStore} from "@/stores/useAuthStore.ts";


interface MemoStoreState {
  memos: MemoNode[]
  showMemos: boolean
}

interface MemoStoreActions {
  resetMemoStore: () => void
  memoOnDragAdd: (position: XYPosition) => void
  setShowMemos: (showMemos: boolean) => void
  onBeforeMemosDelete: (memos: MemoNode[]) => Promise<boolean>
}

export type MemoStore = MemoStoreState & MemoStoreActions

const initialState: MemoStoreState = {
  memos: [],
  showMemos: true
}

export const memoStore: StateCreator<UsePlaygroundStore, [], [], MemoStore> = ((set, get) => ({
  ...initialState,

  memoOnDragAdd: (position) => {
    const state = get()
    const data: ICMemo = {
      position,
      color: "#ffe86a",
      content: "",
      userId: useAuthStore.getState().user.id,
      erdId: state.id
    }

    state.playground.memo(MemoEnum.add, data)
  },
  setShowMemos: (showMemos) => set({showMemos}),

  onBeforeMemosDelete: (memos) => new Promise((resolve) => {
    const entityName = memos.length > 1 ? "memos" : "memo"
    set(state => ({
      confirmModal: {
        ...state.confirmModal,
        opened: true,
        message: `Are you sure you want to delete ${memos.length} ${entityName}?`,
        onConfirm: (callback) => {
          state.playground.memo(MemoEnum.delete, memos.map(memo => memo.id))
          if (callback) {
            callback()
          }
          resolve(true)
        },
        onCancel: (callback) => {
          resolve(false)
          if (callback) {
            callback()
          }
        }
      }
    }))
  }),

  resetMemoStore: () => set(initialState),

}))
