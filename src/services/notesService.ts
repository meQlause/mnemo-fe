import { apiRequest, apiStreamSSE } from './apiClient';
import type { Note, NoteCreate } from '@/utils/types';

export const notesService = {
  async getAll(): Promise<Note[]> {
    return apiRequest<Note[]>('/notes/');
  },

  async getById(id: number): Promise<Note> {
    return apiRequest<Note>(`/notes/${id}`);
  },

  async create(payload: NoteCreate): Promise<Note> {
    return apiRequest<Note>('/notes/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async createStreaming(
    payload: NoteCreate,
    callbacks: {
      onStatus: (status: string) => void;
      onDone: (note: Note) => void;
      onError?: (err: Error) => void;
    }
  ): Promise<void> {
    await apiStreamSSE(
      '/notes/',
      {
        onMessage: (data) => {
          if (data.startsWith('status:')) {
            callbacks.onStatus(data.replace('status:', '').trim());
          } else {
            try {
              const note = JSON.parse(data);
              if (note.id) {
                callbacks.onDone(note);
              }
            } catch (e) {
              console.debug('Failed to parse final note JSON', data, e);
            }
          }
        },
        onError: callbacks.onError,
      },
      {
        method: 'POST',
        body: JSON.stringify(payload),
      }
    );
  },

  async update(id: number, payload: Partial<NoteCreate>): Promise<Note> {
    return apiRequest<Note>(`/notes/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  async saveAnalysis(noteId: number, analysis: Partial<Note>): Promise<Note> {
    return apiRequest<Note>(`/notes/${noteId}/analysis`, {
      method: 'POST',
      body: JSON.stringify(analysis),
    });
  },

  async delete(id: number): Promise<void> {
    return apiRequest<void>(`/notes/${id}`, { method: 'DELETE' });
  },

  async chat(message: string, noteIds?: string[]): Promise<{ answer: string }> {
    return apiRequest<{ answer: string }>('/notes/chat', {
      method: 'POST',
      body: JSON.stringify({ message, note_ids: noteIds }),
    });
  },

  async search(query: string): Promise<Note[]> {
    return apiRequest<Note[]>(`/notes/search?query=${encodeURIComponent(query)}`);
  },
};
