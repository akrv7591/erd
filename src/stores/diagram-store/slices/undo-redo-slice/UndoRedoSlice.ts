import { StateCreator } from "zustand";
import { DiagramStore } from "@/stores/diagram-store";
import { BROADCAST } from "@/namespaces";

interface UndoRedoStack {
  undo: BROADCAST.DATA[];
  redo: BROADCAST.DATA[];
}

interface UndoRedoState {
  // undoRedoStacks: UndoRedoStack[];
  undoStack: UndoRedoStack[]
  redoStack: UndoRedoStack[]
  undoRedoPosition: null | number;
}

interface UndoRedoAction {
  undo: () => void;
  redo: () => void;
  pushUndo: (undo: UndoRedoStack) => void;
}

export type UndoRedoSlice = UndoRedoState & UndoRedoAction;

const initialState: UndoRedoState = {
  // undoRedoStacks: [],
  undoStack: [],
  redoStack: [],
  undoRedoPosition: null,
};

export const undoRedoSlice: StateCreator<
  DiagramStore,
  [],
  [],
  UndoRedoSlice
> = (set, get, api) => ({
  ...initialState,

  // Actions
  undo: () => {
    set(state => {
      const undoRedo = state.undoStack.pop()

      if (!undoRedo) {
        throw new Error("Undo stack is empty, undo button should be disabled")
      }

      state.applyDataChanges(undoRedo.undo);
      state.socket.broadcastData(undoRedo.undo)

      return {
        undoStack: [...state.undoStack],
        redoStack: [...state.redoStack, undoRedo]
      }
    })
  },
  redo: () => {
    set(state => {
      const undoRedo = state.redoStack.pop()

      if (!undoRedo) {
        throw new Error("Redo stack is empty, undo button should be disabled")
      }

      state.applyDataChanges(undoRedo.redo);
      state.socket.broadcastData(undoRedo.redo)

      return {
        undoStack: [...state.undoStack, undoRedo],
        redoStack: [...state.redoStack]
      }
    })
  },
  pushUndo: (undo) => {
    set((state) => ({
      undoStack: [...state.undoStack, undo]
    }));
  },
});
