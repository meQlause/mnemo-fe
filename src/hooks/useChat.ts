import { useCallback } from 'react';
import { toast } from 'sonner';
import { useChatStore } from '@/stores/chatStore';
import { streamChatResponse } from '@/services/aiService';

export function useChat() {
  const { addMessage, updateMessage, setStreaming, setError, isStreaming } = useChatStore();

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isStreaming) return;

      addMessage({ role: 'user', content: text });

      const assistantMsg = addMessage({
        role: 'assistant',
        content: '',
        streaming: true,
      });

      const messages = useChatStore.getState().messages;
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
          onError: (err) => {
            throw err;
          },
        });

        updateMessage(assistantMsg.id, { streaming: false, status: '' });
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Chat failed';
        setError(msg);
        toast.error(msg);
        updateMessage(assistantMsg.id, {
          content: 'Sorry, something went wrong.',
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
