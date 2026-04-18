import { create } from 'zustand';
import { notesService } from '@/services/notesService';
import type { Note, NoteCreate } from '@/utils/types';

interface NotesState {
  notes: Note[];
  selectedNote: Note | null;
  isLoading: boolean;
  error: string | null;
  fetchNotes: () => Promise<void>;
  createNote: (payload: NoteCreate) => Promise<Note>;
  createNoteStreaming: (
    payload: NoteCreate,
    callbacks: { onStatus: (s: string) => void; onError?: (e: Error) => void }
  ) => Promise<void>;
  selectNote: (note: Note | null) => void;
  updateNote: (note: Note) => void;
  editNote: (id: number, payload: Partial<NoteCreate>) => Promise<void>;
  deleteNote: (id: number) => Promise<void>;
  searchNotes: (query: string, startTime?: string, endTime?: string) => Promise<void>;
  clearError: () => void;
}

export const useNotesStore = create<NotesState>((set) => ({
  notes: [],
  selectedNote: null,
  isLoading: false,
  error: null,

  fetchNotes: async () => {
    set({ isLoading: true, error: null });
    try {
      const notes = await notesService.getAll();
      set({ notes, isLoading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Failed to fetch notes',
        isLoading: false,
      });
      throw err;
    }
  },

  createNote: async (payload) => {
    set({ error: null });
    try {
      const note = await notesService.create(payload);
      set((s) => ({ notes: [note, ...s.notes] }));
      return note;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to create note';
      set({ error: msg });
      throw err;
    }
  },

  createNoteStreaming: async (payload, callbacks) => {
    set({ error: null });
    try {
      await notesService.createStreaming(payload, {
        onStatus: callbacks.onStatus,
        onDone: (note) => {
          set((s) => ({ notes: [note, ...s.notes] }));
        },
        onError: (err) => {
          set({ error: err.message });
          if (callbacks.onError) callbacks.onError(err);
        },
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to create note';
      set({ error: msg });
      throw err;
    }
  },

  selectNote: (note) => set({ selectedNote: note }),

  updateNote: (updatedNote) => {
    set((s) => ({
      notes: s.notes.map((n) => (n.id === updatedNote.id ? updatedNote : n)),
      selectedNote: s.selectedNote?.id === updatedNote.id ? updatedNote : s.selectedNote,
    }));
  },

  editNote: async (id, payload) => {
    set({ error: null });
    try {
      const updated = await notesService.update(id, payload);
      set((s) => ({
        notes: s.notes.map((n) => (n.id === id ? updated : n)),
        selectedNote: s.selectedNote?.id === id ? updated : s.selectedNote,
      }));
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to update note' });
      throw err;
    }
  },

  deleteNote: async (id) => {
    try {
      await notesService.delete(id);
      set((s) => ({
        notes: s.notes.filter((n) => n.id !== id),
        selectedNote: s.selectedNote?.id === id ? null : s.selectedNote,
      }));
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to delete note' });
      throw err;
    }
  },

  searchNotes: async (query, startTime, endTime) => {
    if (!query.trim() && !startTime && !endTime) {
      return;
    }
    set({ isLoading: true, error: null });
    try {
      const notes = await notesService.search(query, startTime, endTime);
      set({ notes, isLoading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Search failed',
        isLoading: false,
      });
      throw err;
    }
  },

  clearError: () => set({ error: null }),
}));
