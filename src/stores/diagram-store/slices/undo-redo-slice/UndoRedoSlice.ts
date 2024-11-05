import {StateCreator} from "zustand";
import {DiagramStore} from "@/stores/diagram-store";

interface UndoRedoState {
  canUndo: boolean,
  canRedo: boolean,
}

interface UndoRedoAction {
  undo: () => void,
  redo: () => void,
}

export type UndoRedoSlice = UndoRedoState & UndoRedoAction;

const initialState: UndoRedoState = {
  canUndo: false,
  canRedo: false,
}

export const undoRedoSlice: StateCreator<DiagramStore, [], [], UndoRedoSlice> = () => ({
  ...initialState,

  // Actions
  undo: () => {

  },
  redo: () => {

  },

})
