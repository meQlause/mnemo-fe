import { create } from 'zustand';
import type { ChatMessage } from '@/utils/types';

interface ChatState {
  messages: ChatMessage[];
  isStreaming: boolean;
  error: string | null;
  addMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => ChatMessage;
  updateMessage: (id: string, updates: Partial<ChatMessage>) => void;
  clearMessages: () => void;
  setStreaming: (v: boolean) => void;
  setError: (e: string | null) => void;
}

function genId() {
  return Math.random().toString(36).slice(2, 11);
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isStreaming: false,
  error: null,

  addMessage: (msg) => {
    const full: ChatMessage = {
      ...msg,
      id: genId(),
      timestamp: new Date().toISOString(),
    };
    set((s) => ({ messages: [...s.messages, full] }));
    return full;
  },

  updateMessage: (id, updates) =>
    set((s) => ({
      messages: s.messages.map((m) =>
        m.id === id
          ? {
              ...m,
              ...updates,
              // If updates has context, merge it or replace it? 
              // Usually, context comes all at once, so replace is fine.
            }
          : m
      ),
    })),

  clearMessages: () => set({ messages: [] }),
  setStreaming: (v) => set({ isStreaming: v }),
  setError: (e) => set({ error: e }),
}));
