import {createStore} from "zustand";
import {paneStore} from "@/stores/playground/paneStore.ts";
import {entityStore} from "@/stores/playground/entityStore.ts";
import {relationStore} from "@/stores/playground/relationStore.ts";
import {flowStore} from "@/stores/playground/flowStore.ts";
import {memoStore} from "@/stores/playground/memoStore.ts";
import {erdStore} from "@/stores/playground/erdStore.ts";
import {PlaygroundService} from "@/services/multiplayer/playground-service.ts";

// import types
import type {MemoStore} from "@/stores/playground/memoStore.ts";
import type {FlowStore} from "@/stores/playground/flowStore.ts";
import type {RelationStore} from "@/stores/playground/relationStore.ts";
import type {EntityStore} from "@/stores/playground/entityStore.ts";
import type {PaneStore} from "@/stores/playground/paneStore.ts";
import type {ErdStore} from "@/stores/playground/erdStore.ts";



export interface PlaygroundStoreState {
  playground: PlaygroundService;
  connected: boolean;
}

interface PlaygroundStoreAction {}

type PlaygroundState = PlaygroundStoreState & PlaygroundStoreAction

export type PlaygroundStore =
  PlaygroundState
  & PaneStore
  & EntityStore
  & RelationStore
  & FlowStore
  & MemoStore
  & ErdStore

const initialState: PlaygroundStoreState = {
  playground: null as any,
  connected: false,
}

export const createPlaygroundStore = () => createStore<PlaygroundStore>()((...a) => ({
  ...initialState,
  ...paneStore(...a),
  ...entityStore(...a),
  ...relationStore(...a),
  ...flowStore(...a),
  ...memoStore(...a),
  ...erdStore(...a),
}))
