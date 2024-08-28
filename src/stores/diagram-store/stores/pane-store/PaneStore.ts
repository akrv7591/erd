import {StateCreator} from "zustand";
import {Viewport} from "@xyflow/react";
import type {Client} from "@/types/playground";
import type {ITools} from "@/types/entity-node";
import {DiagramStore} from "@/stores/diagram-store/DiagramStore.ts";
import {EntityViewMode} from "@/enums/playground.ts";

export interface ConfirmModal {
  opened: boolean
  message: string
  open: () => void
  close: () => void
  onConfirm: (callback?: () => void) => void
  onCancel?: (callback?: () => void) => void
}

interface PaneStoreState {
  tool: ITools;
  minimap: boolean;
  viewport: Viewport | null;
  confirmModal: ConfirmModal,
  subscribedTo: null | string,
  subscribers: string[],
  entityViewMode: EntityViewMode,
  clients: Client[]
}

interface PaneStoreAction {
  setTool: (tool: ITools) => void
  setMinimap: (minimap: boolean) => void
  setViewport: (viewport: Viewport) => void
  resetPaneStore: () => void
  setEntityViewMode: (mode: EntityViewMode) => void
}

export type PaneStore = PaneStoreState & PaneStoreAction

const initialStore: Omit<PaneStoreState, 'confirmModal'> = {
  tool: "hand-grab",
  minimap: JSON.parse(localStorage.getItem("minimap") || "true"),
  viewport: null,
  subscribedTo: null,
  subscribers: [],
  clients: [],
  entityViewMode: EntityViewMode.EDITOR,
}

export const paneStore: StateCreator<DiagramStore, [], [], PaneStore> = ((set) => ({
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

  setMinimap: (minimap) => {
    set({minimap})
    localStorage.setItem("minimap", JSON.stringify(minimap))
  },

  setViewport: (viewport) => set({viewport}),
  setEntityViewMode: (mode) => set({entityViewMode: mode}),

  // Reset store
  resetPaneStore: () => set(initialStore)
}))
