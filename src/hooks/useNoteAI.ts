import { useState, useCallback } from 'react';
import { analyzeNote } from '@/services/aiService';
import { notesService } from '@/services/notesService';
import { useQueryClient } from '@tanstack/react-query';
import { NOTE_KEYS } from '@/hooks/useNotes';
import type { AISummary, AIStreamState } from '@/utils/types';
import { toast } from 'sonner';

const initial: AIStreamState = {
  summary: '',
  tags: [],
  sentiment: '',
  loading: false,
  streamingField: null,
};

export function useNoteAI(
  content: string,
  initialData?: Partial<AIStreamState>,
  noteId?: number
) {
  const [state, setState] = useState<AIStreamState>(() => ({
    ...initial,
    summary: initialData?.summary || '',
    tags: initialData?.tags || [],
    sentiment: initialData?.sentiment || '',
  }));
  const [result, setResult] = useState<AISummary | null>(null);
  const queryClient = useQueryClient();

  const analyze = useCallback(
    async (noteId?: number) => {
      if (!content.trim()) return;
      setState({ ...initial, loading: true, streamingField: 'summary' });
      setResult(null);

      try {
        await analyzeNote(content, {
          onSummaryChunk: (text) =>
            setState((s) => ({ ...s, summary: text, streamingField: 'summary' })),
          onTagsChunk: (tags) => setState((s) => ({ ...s, tags, streamingField: 'tags' })),
          onSentimentChunk: (text) =>
            setState((s) => ({ ...s, sentiment: text, streamingField: 'sentiment' })),
          onDone: async (r) => {
            setResult(r);
            setState((s) => ({ ...s, loading: false, streamingField: null }));

            if (noteId) {
              try {
                await notesService.saveAnalysis(noteId, r);
                queryClient.invalidateQueries({ queryKey: NOTE_KEYS.all });
              } catch (err) {
                console.error('Failed to auto-save analysis', err);
                toast.error('Analysis finished but could not be saved to the database');
              }
            }
          },
          onError: (err) => {
            throw err;
          },
        });
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Analysis failed');
        setState((s) => ({ ...s, loading: false, streamingField: null }));
      }
    },
    [content, queryClient]
  );

  const reset = useCallback(() => {
    setState({
      ...initial,
      summary: initialData?.summary || '',
      tags: initialData?.tags || [],
      sentiment: initialData?.sentiment || '',
    });
    setResult(null);
  }, [initialData]);

  const [prevNoteId, setPrevNoteId] = useState(noteId);
  if (noteId !== prevNoteId) {
    setPrevNoteId(noteId);
    setState({
      ...initial,
      summary: initialData?.summary || '',
      tags: initialData?.tags || [],
      sentiment: initialData?.sentiment || '',
    });
    setResult(null);
  }

  return { state, result, analyze, reset };
}
