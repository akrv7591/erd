import {XYPosition} from "@xyflow/react";
import {StateCreator} from "zustand";
import {SharedDiagramStore} from "../SharedDiagramStore.ts";
import {MemoNode} from "@/types/memo-node";
import {NODE_TYPES} from "@/screens/Playground/Main/NodeTypes";
import {createId} from "@paralleldrive/cuid2";


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

export const memoStore: StateCreator<SharedDiagramStore, [], [], MemoStore> = ((set, get) => ({
  ...initialState,

  memoOnDragAdd: (position) => {
    const state = get()

    const memo: MemoNode = {
      id: createId(),
      position,
      type: NODE_TYPES.MEMO,
      data: {
        color: "#ffe86a",
        content: "",
      }
    }

    state.addNode(memo)

  },
  setShowMemos: (showMemos) => set({showMemos}),

  onBeforeMemosDelete: (memos) => new Promise((resolve) => {
    const entityName = memos.length > 1 ? "memos" : "memo"
    const state = get()

    state.setConfirmModal(
      {
        opened: true,
        message: `Are you sure you want to delete ${memos.length} ${entityName}?`,
        onConfirm: (callback) => {
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
    )
  }),

  resetMemoStore: () => set(initialState),

}))
