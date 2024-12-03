import {StateCreator} from "zustand";
import {Viewport} from "@xyflow/react";
import type {Client, Tools} from "@/types/diagram";
import {DiagramStore} from "@/stores/diagram-store/DiagramStore";
import {DIAGRAM} from "@/namespaces";
import {User} from "@/types/log-to/user";
import {NODE_TYPES} from "@/screens/Diagram/Main/NodeTypes";

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
  viewport: Viewport | null;
  confirmModal: ConfirmModal,
  subscribedTo: null | string,
  subscribers: string[],
  entityViewMode: DIAGRAM.ENTITY.VIEW_MODE,
  clients: Client[]
  synced: boolean
  user: User
  isMemosVisible: boolean
  isMinimapVisible: boolean;

}

interface PaneSliceAction {
  setTool: (tool: Tools) => void
  setMinimap: (minimap: boolean) => void
  setViewport: (viewport: Viewport) => void
  resetPaneStore: () => void
  setEntityViewMode: (mode: DIAGRAM.ENTITY.VIEW_MODE) => void
  toggleMemosVisibility: () => void
  setMemoVisibility: (visible: boolean) => void
  toggleMinimapVisibility: () => void
  toggleEntityViewMode: () => void
}

export type PaneSlice = PaneSliceState & PaneSliceAction

const initialStore: Omit<PaneSliceState, 'confirmModal'| 'user' | 'reactflow'> = {
  tool: "hand-grab",
  isMinimapVisible: JSON.parse(localStorage.getItem("isMinimapVisible") || "true"),
  viewport: null,
  subscribedTo: null,
  subscribers: [],
  clients: [],
  entityViewMode: DIAGRAM.ENTITY.VIEW_MODE.EDITOR,
  synced: false,
  isMemosVisible: true
 }

export const paneSlice: (user: User) => StateCreator<DiagramStore, [], [], PaneSlice> = (user) => ((set) => ({
  ...initialStore,
  user,
  confirmModal: {
    opened: false,
    message: "",
    open: () => set(state => ({confirmModal: {...state.confirmModal, opened: true}})),
    close: () => set(state => ({confirmModal: {...state.confirmModal, opened: false}})),
    onConfirm: () => {},
  },

  //Actions
  setTool: (tool) => set({tool}),

  setMinimap: (isMinimapVisible) => {
    set({isMinimapVisible})
    localStorage.setItem("isMinimapVisible", JSON.stringify(isMinimapVisible))
  },

  setViewport: (viewport) => set({viewport}),
  setEntityViewMode: (mode) => set({entityViewMode: mode}),
  setMemoVisibility: (isMemosVisible) => set({isMemosVisible}),
  toggleMemosVisibility: () => {
    set(state => ({
      nodes: state.nodes.map(node => {
        if (node.type !== NODE_TYPES.MEMO) {
          return node
        } else {
          return {
            ...node,
            hidden: state.isMemosVisible
          }
        }
      }),
      isMemosVisible: !state.isMemosVisible
    }))
  },
  toggleMinimapVisibility: () => {
    set(state => ({
      isMinimapVisible: !state.isMinimapVisible
    }))
  },
  toggleEntityViewMode: () => {
    set(state => ({
      entityViewMode: state.entityViewMode === DIAGRAM.ENTITY.VIEW_MODE.EDITOR ? DIAGRAM.ENTITY.VIEW_MODE.LOGICAL : DIAGRAM.ENTITY.VIEW_MODE.EDITOR
    }))
  },
  // Reset store
  resetPaneStore: () => set(initialStore)
}))
