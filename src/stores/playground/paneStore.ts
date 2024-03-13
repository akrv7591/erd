import {StateCreator} from "zustand";
import {LivePlayer, ITools} from "@/types/entity-node";
import {Viewport} from "@xyflow/react";
import {UsePlaygroundStore} from "@/stores/usePlaygroundStore.ts";

interface PaneStoreState {
  tool: ITools;
  zoom: number;
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
  subscribedTo: null | LivePlayer,
  subscribers: string[],
  players: LivePlayer[]
}

interface PaneStoreAction {
  setTool: (tool: ITools) => void
  setZoom: (zoom: number) => void
  setMinimap: (minimap: boolean) => void
  setViewport: (viewport: Viewport) => void
  resetPaneStore: () => void
}

export type PaneStore = PaneStoreState & PaneStoreAction

const initialStore: Omit<PaneStoreState, 'confirmModal'> = {
  tool: "hand-grab",
  zoom: Number(localStorage.getItem("zoom")) || 0,
  minimap: JSON.parse(localStorage.getItem("minimap") || "true"),
  viewport: null,
  subscribedTo: null,
  subscribers: [],
  players: [],
}

export const paneStore: StateCreator<UsePlaygroundStore, [], [], PaneStore> = ((set) => ({
  ...initialStore,

  confirmModal: {
    opened: false,
    message: "",
    open: () => set(state => ({confirmModal: {...state.confirmModal, opened: true}})),
    close: () => set(state => ({confirmModal: {...state.confirmModal, opened: false}})),
    onConfirm: () => {},
  },

  //Actions
  setTool: (tool) => set({tool}),

  /**
   * Set the zoom level and store it in local storage.
   *
   * @param {type} zoom - The new zoom level
   * @return {type} undefined
   */
  setZoom: (zoom) => {
    set({zoom})
    localStorage.setItem("zoom", zoom.toString())
  },

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

  setViewport: (viewport) => set({viewport}),

  // Reset store
  resetPaneStore: () => set(initialStore)
}))
