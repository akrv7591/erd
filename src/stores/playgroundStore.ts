import {createStore} from "zustand";
import {paneStore} from "@/stores/playground/paneStore.ts";
import {entityStore} from "@/stores/playground/entityStore.ts";
import {PlaygroundService} from "@/services/multiplayer/playground-service.ts";
import {relationStore} from "@/stores/playground/relationStore.ts";
import {flowStore} from "@/stores/playground/flowStore.ts";
import {websocketResponseStore} from "@/stores/playground/websocketResponseStore.ts";
import {memoStore} from "@/stores/playground/memoStore.ts";

// import types
import type {IErd} from "@/types/data/db-model-interfaces";
import type {MemoStore} from "@/stores/playground/memoStore.ts";
import type {FlowStore} from "@/stores/playground/flowStore.ts";
import type {RelationStore} from "@/stores/playground/relationStore.ts";
import type {EntityStore} from "@/stores/playground/entityStore.ts";
import type {PaneStore} from "@/stores/playground/paneStore.ts";
import type {WebsocketResponseStore} from "@/stores/playground/websocketResponseStore.ts";



export interface PlaygroundStoreState extends Omit<IErd, 'entities' | 'relations' | 'users' | 'memos'> {
  playground: PlaygroundService;
  connected: boolean;
}

interface PlaygroundStoreAction {
  reset: () => void
}

type PlaygroundState = PlaygroundStoreState & PlaygroundStoreAction

export type PlaygroundStore =
  PlaygroundState
  & PaneStore
  & EntityStore
  & RelationStore
  & FlowStore
  & MemoStore
  & WebsocketResponseStore


const initialState: PlaygroundStoreState = {
  id: "",
  createdAt: "",
  updatedAt: "",
  name: "",
  isPublic: false,
  description: "",
  teamId: "",
  tableNameCase: "pascal",
  columnNameCase: "camel",
  playground: null as any,
  connected: false,
}

// export const usePlaygroundStore = create<PlaygroundStore>()((...a) => ({
//   ...initialState,
//   ...paneStore(...a),
//   ...entityStore(...a),
//   ...relationStore(...a),
//   ...flowStore(...a),
//   ...memoStore(...a),
//   ...websocketResponseStore(...a),
//
//   reset: () => {
//     const state = a[1]();
//     state.resetEntityStore();
//     state.resetRelationStore();
//     state.resetPaneStore();
//     state.resetMemoStore();
//   },
// }))

export const createPlaygroundStore = () => createStore<PlaygroundStore>()((...a) => ({
  ...initialState,
  ...paneStore(...a),
  ...entityStore(...a),
  ...relationStore(...a),
  ...flowStore(...a),
  ...memoStore(...a),
  ...websocketResponseStore(...a),

  reset: () => {
    const state = a[1]();
    state.resetEntityStore();
    state.resetRelationStore();
    state.resetPaneStore();
    state.resetMemoStore();
  },
}))
