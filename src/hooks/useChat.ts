import { useCallback } from 'react';
import { toast } from 'sonner';
import { useChatStore } from '@/stores/chatStore';
import { streamChatResponse } from '@/services/aiService';
import { ChatMessage } from '@/utils/types';

export function useChat() {
  const { addMessage, updateMessage, setStreaming, setError, isStreaming } = useChatStore();

  const sendMessage = useCallback(
    async (text: string, selectedNoteId?: number) => {
      if (!text.trim() || isStreaming) return;

      let assistantMsg: ChatMessage;

      if (selectedNoteId) {
        assistantMsg = addMessage({
          role: 'assistant',
          content: '',
          streaming: true,
          status: 'Directing to selected note...',
        });
      } else {
        addMessage({ role: 'user', content: text });
        assistantMsg = addMessage({
          role: 'assistant',
          content: '',
          streaming: true,
        });
      }

      const messages = useChatStore.getState().messages;

      const lastAssistantWithContext = [...messages]
        .reverse()
        .find((m) => m.role === 'assistant' && m.context_content);
      const contextContent = lastAssistantWithContext?.context_content;

      const history = messages
        .filter((m) => m.id !== assistantMsg.id)
        .map((m) => ({ 
          role: m.role, 
          content: m.content, 
          context_content: m.context_content 
        }));

      setStreaming(true);
      setError(null);

      try {
        await streamChatResponse(text, {
          history,
          selectedNoteId,
          contextContent, 
          onChunk: (content) => {
            updateMessage(assistantMsg.id, { content, status: '' });
          },
          onStatus: (status) => {
            updateMessage(assistantMsg.id, { status });
          },
          onContext: (context) => {
            updateMessage(assistantMsg.id, { context });
          },
          onContextContent: (context_content) => {
            updateMessage(assistantMsg.id, { context_content });
          },
          onSelectionRequired: (candidate_notes) => {
            updateMessage(assistantMsg.id, { 
              candidate_notes, 
              streaming: false,
              status: 'Please select a note to continue'
            });
            setStreaming(false);
          },
          onError: (err) => {
            throw err;
          },
        });

        if (useChatStore.getState().isStreaming) {
          updateMessage(assistantMsg.id, { streaming: false, status: '' });
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Chat failed';
        setError(msg);
        toast.error(msg);
        updateMessage(assistantMsg.id, {
          content: `Sorry, something went wrong: ${msg}`,
          streaming: false,
          status: '',
        });
      } finally {
        setStreaming(false);
      }
    },
    [addMessage, updateMessage, setStreaming, setError, isStreaming]
  );

  return { sendMessage, isStreaming };
}
