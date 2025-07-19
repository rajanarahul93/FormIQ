import { create } from "zustand";
import { FormData } from "@/types/form";

interface HistoryState {
  past: FormData[];
  present: FormData | null;
  future: FormData[];
}

interface HistoryStore extends HistoryState {
  canUndo: boolean;
  canRedo: boolean;
  saveState: (state: FormData) => void;
  undo: () => FormData | null;
  redo: () => FormData | null;
  clearHistory: () => void;
}

const HISTORY_LIMIT = 50;

export const useHistoryStore = create<HistoryStore>((set, get) => ({
  past: [],
  present: null,
  future: [],
  canUndo: false,
  canRedo: false,

  saveState: (state) => {
    const { past, present } = get();

    if (!present) {
      set({
        present: state,
        canUndo: false,
        canRedo: false,
      });
      return;
    }

    // Don't save if state hasn't changed
    if (JSON.stringify(present) === JSON.stringify(state)) {
      return;
    }

    const newPast = [present, ...past].slice(0, HISTORY_LIMIT);

    set({
      past: newPast,
      present: state,
      future: [], // Clear future when new state is saved
      canUndo: true,
      canRedo: false,
    });
  },

  undo: () => {
    const { past, present, future } = get();

    if (past.length === 0 || !present) return null;

    const [previous, ...newPast] = past;
    const newFuture = [present, ...future];

    set({
      past: newPast,
      present: previous,
      future: newFuture,
      canUndo: newPast.length > 0,
      canRedo: true,
    });

    return previous;
  },

  redo: () => {
    const { past, present, future } = get();

    if (future.length === 0 || !present) return null;

    const [next, ...newFuture] = future;
    const newPast = [present, ...past];

    set({
      past: newPast,
      present: next,
      future: newFuture,
      canUndo: true,
      canRedo: newFuture.length > 0,
    });

    return next;
  },

  clearHistory: () => {
    set({
      past: [],
      present: null,
      future: [],
      canUndo: false,
      canRedo: false,
    });
  },
}));