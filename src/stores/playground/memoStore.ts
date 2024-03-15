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
}

interface MemoStoreActions {
  resetMemoStore: () => void
  memoOnDragAdd: (position: XYPosition) => void
  onMemoNodeChange: (node: NodeChange<MemoNode>) => void
}

export type MemoStore = MemoStoreState & MemoStoreActions

const initialState: MemoStoreState = {
  memos: []
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
        state.playground.memo(MemoEnum.patch, {
          id: node.item.id,
          position: node.item.position,
        })
        break
      case "position":
        const {position} = state.memos.find(memo => memo.id === node.id)!

        if (node.position && position !== node.position) {
          console.log(position)
          state.playground.memo(MemoEnum.put, {id: node.id, position: node.position})
        }
        break
      case "remove":
        state.playground.memo(MemoEnum.delete, node.id)
        break
      default:
    }
  },
  resetMemoStore: () => set(initialState),
}))
