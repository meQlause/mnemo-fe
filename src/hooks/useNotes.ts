import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notesService } from '@/services/notesService';
import { useNotesStore } from '@/stores/notesStore';
import type { NoteCreate } from '@/utils/types';
import { toast } from 'sonner';

export const NOTE_KEYS = {
  all: ['notes'] as const,
  list: () => [...NOTE_KEYS.all, 'list'] as const,
  search: (query: string, startTime?: string, endTime?: string) =>
    [...NOTE_KEYS.all, 'search', { query, startTime, endTime }] as const,
};

export function useNotes() {
  return useQuery({
    queryKey: NOTE_KEYS.list(),
    queryFn: () => notesService.getAll(),
  });
}

export function useSearchNotes(query: string, startTime?: string, endTime?: string) {
  const isSearchActive = !!(query.trim() || startTime || endTime);

  return useQuery({
    queryKey: NOTE_KEYS.search(query, startTime, endTime),
    queryFn: () => notesService.search(query, startTime, endTime),
    enabled: isSearchActive,
  });
}

export function useCreateNote() {
  const queryClient = useQueryClient();
  const selectNote = useNotesStore((s) => s.selectNote);

  return useMutation({
    mutationFn: (payload: NoteCreate) => notesService.create(payload),
    onSuccess: (newNote) => {
      queryClient.invalidateQueries({ queryKey: NOTE_KEYS.all });
      selectNote(newNote);
      toast.success('Note created');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create note: ${error.message}`);
    },
  });
}

export function useUpdateNote() {
  const queryClient = useQueryClient();
  const selectNote = useNotesStore((s) => s.selectNote);

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Partial<NoteCreate> }) =>
      notesService.update(id, payload),
    onSuccess: (updatedNote) => {
      queryClient.invalidateQueries({ queryKey: NOTE_KEYS.all });
      selectNote(updatedNote);
      // TODO: This section could be improved with Optimistic Updates
      toast.success('Note updated');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update note: ${error.message}`);
    },
  });
}

export function useDeleteNote() {
  const queryClient = useQueryClient();
  const selectNote = useNotesStore((s) => s.selectNote);

  return useMutation({
    mutationFn: (id: number) => notesService.delete(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: NOTE_KEYS.all });
      const currentSelected = useNotesStore.getState().selectedNote;
      if (currentSelected?.id === id) {
        selectNote(null);
      }
      toast.success('Note deleted');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete note: ${error.message}`);
    },
  });
}
