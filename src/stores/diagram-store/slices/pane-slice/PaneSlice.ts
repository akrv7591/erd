import {StateCreator} from "zustand";
import {Viewport} from "@xyflow/react";
import type {Client, Tools} from "@/types/diagram";
import {DiagramStore} from "@/stores/diagram-store/DiagramStore";
import {LOG_TO} from "@/types/log-to";
import {DIAGRAM} from "@/namespaces";

export interface ConfirmModal {
  opened: boolean
  message: string
  open: () => void
  close: () => void
  onConfirm: (callback?: () => void) => void
  onCancel?: (callback?: () => void) => void
}

interface PaneSliceState {
  tool: Tools;
  minimap: boolean;
  viewport: Viewport | null;
  confirmModal: ConfirmModal,
  subscribedTo: null | string,
  subscribers: string[],
  entityViewMode: DIAGRAM.ENTITY.VIEW_MODE,
  clients: Client[]
  memo: boolean
  synced: boolean
  user: LOG_TO.UserInfo
}

interface PaneSliceAction {
  setTool: (tool: Tools) => void
  setMinimap: (minimap: boolean) => void
  setViewport: (viewport: Viewport) => void
  resetPaneStore: () => void
  setEntityViewMode: (mode: DIAGRAM.ENTITY.VIEW_MODE) => void
  setMemo: (memo: boolean) => void
}

export type PaneSlice = PaneSliceState & PaneSliceAction

const initialStore: Omit<PaneSliceState, 'confirmModal'> = {
  tool: "hand-grab",
  minimap: JSON.parse(localStorage.getItem("minimap") || "true"),
  viewport: null,
  subscribedTo: null,
  subscribers: [],
  clients: [],
  entityViewMode: DIAGRAM.ENTITY.VIEW_MODE.EDITOR,
  memo: true,
  synced: false,
  user: {} as LOG_TO.UserInfo
}

export const paneSlice: StateCreator<DiagramStore, [], [], PaneSlice> = ((set) => ({
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
  setMemo: (memo) => set({memo}),

  // Reset store
  resetPaneStore: () => set(initialStore)
}))
