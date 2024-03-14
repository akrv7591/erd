import {Node} from "@xyflow/react";
import {CustomNodeTypes} from "@/types/playground";
import {IMemo} from "@/types/data/db-model-interfaces";
import {StateCreator} from "zustand";
import {UsePlaygroundStore} from "@/stores/usePlaygroundStore.ts";

export type MemoNodeData = Pick<IMemo, 'color' | 'content' | 'createdAt' | 'updatedAt' | 'userId' | 'erdId'>

export type MemoNode = Node<MemoNodeData, CustomNodeTypes>

interface MemoStoreState {
  memos: MemoNode[]
}

interface MemoStoreActions {
  resetMemoStore: () => void
}

export type MemoStore = MemoStoreState & MemoStoreActions

const initialState: MemoStoreState = {
  memos: []
}

export const memoStore: StateCreator<UsePlaygroundStore, [], [], MemoStore> = ((set) => ({
  ...initialState,

  resetMemoStore: () => set(initialState),
}))
