import {StateCreator} from "zustand";
import {Viewport} from "@xyflow/react";
import {UsePlaygroundStore} from "@/stores/usePlaygroundStore.ts";
import type {Player} from "@/types/playground";
import type {ITools} from "@/types/entity-node";

interface PaneStoreState {
  tool: ITools;
  minimap: boolean;
  viewport: Viewport | null;
  confirmModal: {
    opened: boolean
    message: string
    open: () => void
    close: () => void
    onConfirm: (callback?: () => void) => void
    onCancel?: (callback?: () => void) => void
  },
  subscribedTo: null | string,
  subscribers: string[],
  players: Player[]
}

interface PaneStoreAction {
  setTool: (tool: ITools) => void
  setMinimap: (minimap: boolean) => void
  setViewport: (viewport: Viewport) => void
  resetPaneStore: () => void
}

export type PaneStore = PaneStoreState & PaneStoreAction

const initialStore: Omit<PaneStoreState, 'confirmModal'> = {
  tool: "hand-grab",
  minimap: JSON.parse(localStorage.getItem("minimap") || "true"),
  viewport: null,
  subscribedTo: null,
  subscribers: [],
  players: [],
}

export const paneStore: StateCreator<UsePlaygroundStore, [], [], PaneStore> = ((set, get) => ({
  ...initialStore,

  confirmModal: {
    opened: false,
    message: "",
    open: () => set(state => ({confirmModal: {...state.confirmModal, opened: true}})),
    close: () => set(state => ({confirmModal: {...state.confirmModal, opened: false}})),
    onConfirm: () => {
    },
  },

  //Actions
  setTool: (tool) => set({tool}),

  /**
   * Sets the minimap and saves it to local storage.
   *
   * @param {type} minimap - the minimap to be set
   * @return {type} undefined
   */
  setMinimap: (minimap) => {
    set({minimap})
    localStorage.setItem("minimap", JSON.stringify(minimap))
  },

  setViewport: (viewport) => {
    const state = get()

    state.playground.reactFlow.setViewport(viewport)
  },

  // Reset store
  resetPaneStore: () => set(initialStore)
}))
