import {create} from "zustand";
import {IErd} from "@/types/data/db-model-interfaces";
import {PaneStore, paneStore} from "@/stores/playground/paneStore.ts";
import {entityStore, EntityStore} from "@/stores/playground/entityStore.ts";
import {PlaygroundService} from "@/services/multiplayer/playground-service.ts";
import {relationStore, RelationStore} from "@/stores/playground/relationStore.ts";
import {flowStore, FlowStore} from "@/stores/playground/flowStore.ts";
import {websocketResponseStore, WebsocketResponseStore} from "@/stores/playground/websocketResponseStore.ts";
import {memoStore, MemoStore} from "@/stores/playground/memoStore.ts";


export interface PlaygroundStoreState extends Omit<IErd, 'entities' | 'relations' | 'users' | 'memos'> {
  playground: PlaygroundService;
  connected: boolean
}

interface PlaygroundStoreAction {
  reset: () => void
}

type PlaygroundState = PlaygroundStoreState & PlaygroundStoreAction

export type UsePlaygroundStore =
  PlaygroundState
  & PaneStore
  & EntityStore
  & RelationStore
  & FlowStore
  & MemoStore
  & WebsocketResponseStore


const initialState: PlaygroundStoreState = {
  id: "",
  createdAt: new Date(),
  updatedAt: new Date(),
  name: "",
  isPublic: false,
  description: "",
  teamId: "",
  tableNameCase: "pascal",
  columnNameCase: "camel",
  playground: null as any,
  connected: false
}

export const usePlaygroundStore = create<UsePlaygroundStore>()((...a) => ({
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

