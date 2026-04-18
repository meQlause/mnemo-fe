import { create } from 'zustand';
import type { Note } from '@/utils/types';

interface NotesState {
  selectedNote: Note | null;
  selectNote: (note: Note | null) => void;
}

export const useNotesStore = create<NotesState>((set) => ({
  selectedNote: null,
  selectNote: (note) => set({ selectedNote: note }),
}));
