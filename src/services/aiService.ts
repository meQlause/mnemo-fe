import { apiStreamSSE } from './apiClient';
import type { AISummary } from '@/utils/types';

export async function analyzeNote(
  content: string,
  callbacks: {
    onSummaryChunk: (text: string) => void;
    onTagsChunk: (tags: string[]) => void;
    onSentimentChunk: (text: string) => void;
    onDone: (result: AISummary) => void;
    onError?: (err: Error) => void;
  }
): Promise<void> {
  const aggregated: AISummary = {
    summary: '',
    tags: [],
    sentiment: 'neutral',
    sentimentScore: 0.5,
  };

  await apiStreamSSE(
    '/notes/analyze',
    {
      onMessage: (data) => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.summary !== undefined) {
            aggregated.summary = parsed.summary;
            callbacks.onSummaryChunk(parsed.summary);
          }
          if (parsed.tags !== undefined) {
            aggregated.tags = parsed.tags;
            callbacks.onTagsChunk(parsed.tags);
          }
          if (parsed.sentiment !== undefined) {
            aggregated.sentiment = parsed.sentiment;
            callbacks.onSentimentChunk(parsed.sentiment);
          }
        } catch (e) {
          console.debug('Failed to parse analysis JSON', data, e);
        }
      },
      onError: callbacks.onError,
    },
    {
      method: 'POST',
      body: JSON.stringify({ content }),
    }
  );

  callbacks.onDone(aggregated);
}

export async function streamChatResponse(
  message: string,
  callbacks: {
    history: Array<{ role: string; content: string; context_content?: string }>;
    onChunk: (partial: string) => void;
    onStatus?: (status: string) => void;
    onContext?: (context: { id: number; title: string }[]) => void;
    onContextContent?: (content: string) => void;
    onError?: (err: Error) => void;
  }
): Promise<void> {
  let fullResponse = '';
  await apiStreamSSE(
    '/notes/chat',
    {
      onMessage: (data) => {
        if (data.startsWith('status:')) {
          if (callbacks.onStatus) {
            callbacks.onStatus(data.replace('status:', '').trim());
          }
        } else if (data.startsWith('context:')) {
          if (callbacks.onContext) {
            try {
              const context = JSON.parse(data.replace('context:', '').trim());
              callbacks.onContext(context);
            } catch (e) {
              console.error('Failed to parse context', e);
            }
          }
        } else if (data.startsWith('context_content:')) {
          if (callbacks.onContextContent) {
            try {
              const content = JSON.parse(data.replace('context_content:', '').trim());
              callbacks.onContextContent(content);
            } catch (e) {
              console.error('Failed to parse context content', e);
            }
          }
        } else {
          fullResponse += data;
          callbacks.onChunk(fullResponse);
        }
      },
      onError: callbacks.onError,
    },
    {
      method: 'POST',
      body: JSON.stringify({
        question: message,
        history: callbacks.history.map(m => ({
          role: m.role,
          content: m.content,
          context_content: m.context_content
        })),
      }),
    }
  );
}

export async function suggestTitle(
  content: string,
  onChunk: (partial: string) => void,
  onError?: (err: Error) => void
): Promise<void> {
  let fullTitle = '';
  await apiStreamSSE(
    '/notes/generate-title',
    {
      onMessage: (data) => {
        fullTitle += data;
        onChunk(fullTitle);
      },
      onError,
    },
    {
      method: 'POST',
      body: JSON.stringify({ content }),
    }
  );
}

export async function generateRandomNote(
  onChunk: (partial: string) => void,
  onError?: (err: Error) => void
): Promise<void> {
  let fullContent = '';
  await apiStreamSSE(
    '/notes/generate-random',
    {
      onMessage: (data) => {
        fullContent += data;
        onChunk(fullContent);
      },
      onError,
    },
    {
      method: 'POST',
      body: JSON.stringify({}),
    }
  );
}
