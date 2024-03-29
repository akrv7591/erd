import {Node, NodeChange, XYPosition} from "@xyflow/react";
import {CustomNodeTypes} from "@/types/playground";
import {IMemo} from "@/types/data/db-model-interfaces";
import {StateCreator} from "zustand";
import {UsePlaygroundStore} from "@/stores/usePlaygroundStore.ts";
import {MemoEnum} from "@/enums/playground.ts";

export type MemoNodeData = Pick<IMemo, 'color' | 'content' | 'createdAt' | 'updatedAt' | 'userId' | 'erdId'>

export type MemoNode = Node<MemoNodeData, CustomNodeTypes>

interface MemoStoreState {
  memos: MemoNode[]
  showMemos: boolean
}

interface MemoStoreActions {
  resetMemoStore: () => void
  memoOnDragAdd: (position: XYPosition) => void
  onMemoNodeChange: (node: NodeChange<MemoNode>) => void
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
    const data = {
      position,
      data: {
        color: "#ffe86a",
        content: "",
        userId: "",
        erdId: state.id
      }
    }

    state.playground.memo(MemoEnum.add, data)
  },

  onMemoNodeChange: (node) => {
    const state = get()
    switch (node.type) {
      case "add":
        break
      case "replace":
        console.log(node)

        state.playground.memo(MemoEnum.put, {
          id: node.item.id,
          position: node.item.position,
        })
        break
      case "position":
        const {position} = state.memos.find(memo => memo.id === node.id)!

        if (node.position && position !== node.position) {
          state.playground.memo(MemoEnum.put, {id: node.id, position: node.position})
        }
        break
      case "remove":
        state.playground.memo(MemoEnum.delete, node.id)
        break
      default:
    }
  },
  setShowMemos: (showMemos) => set({showMemos}),
  resetMemoStore: () => set(initialState),

  onBeforeMemosDelete: (memos) =>  new Promise((resolve) => {
    const entityName = memos.length > 1 ? "memos" : "memo"
    set({
      confirmModal: {
        ...get().confirmModal,
        opened: true,
        message: `Are you sure you want to delete ${memos.length} ${entityName}?`,
        onConfirm: (callback) => {
          resolve(true)
          if (callback) {
            callback()
          }
        },
        onCancel: (callback) => {
          resolve(false)
          if (callback) {
            callback()
          }
        }
      }
    })
  })
}))
