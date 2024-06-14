import {XYPosition} from "@xyflow/react";
import {StateCreator} from "zustand";
import {PlaygroundStore} from "@/stores/playgroundStore.ts";
import {MemoEnum} from "@/enums/playground.ts";
import {MemoNode} from "@/types/memo-node";
import {NODE_TYPES} from "@/screens/Playground/Main/NodeTypes";
import {createId} from "@paralleldrive/cuid2";
import {notifications} from "@mantine/notifications";
import {NodeType} from "@/services/multiplayer/type";


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

export const memoStore: StateCreator<PlaygroundStore, [], [], MemoStore> = ((set, get) => ({
  ...initialState,

  memoOnDragAdd: (position) => {
    const state = get()

    const data: NodeType<NODE_TYPES.MEMO> = {
      id: createId(),
      position,
      type: NODE_TYPES.MEMO,
      data: {
        color: "#ffe86a",
        content: "",
      }
    }


    const memoAddResponseHandler = state.playground.handleEmitResponse({
      onError: () => {
        notifications.show({
          title: MemoEnum.add,
          message: "Failed to add memo"
        })
      },
      onSuccess: () => {
        state.addNode(data as any)
      }
    })

    state.playground.socket.emit(MemoEnum.add, {memo: data}, memoAddResponseHandler)
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
          const memoDeleteResponseHandler = state.playground.handleEmitResponse({
            onError: () => {
              notifications.show({
                title: MemoEnum.delete,
                message: "Failed to delete memo"
              })
              resolve(true)
            },
            onSuccess: () => {
              if (callback) {
                callback()
              }
              resolve(true)
            }
          })
          state.playground.socket.emit(MemoEnum.delete, {memoId: memos.map(memo => memo.id)}, memoDeleteResponseHandler)

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
