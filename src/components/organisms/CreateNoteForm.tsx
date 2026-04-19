import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { RichTextEditor } from '@/components/molecules/RichTextEditor';
import { useNotesStore } from '@/stores/notesStore';
import { suggestTitle, generateRandomNote } from '@/services/aiService';
import { notesService } from '@/services/notesService';
import { useQueryClient } from '@tanstack/react-query';
import { NOTE_KEYS } from '@/hooks/useNotes';
import { X, Loader2, Sparkles, Wand2 } from 'lucide-react';

interface CreateNoteFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function CreateNoteForm({ onSuccess, onCancel }: CreateNoteFormProps) {
  const queryClient = useQueryClient();
  const selectNote = useNotesStore((s) => s.selectNote);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [isTitleLoading, setIsTitleLoading] = useState(false);
  const [isGeneratingNote, setIsGeneratingNote] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const handleSuggestTitle = async () => {
    if (!content.trim() || isTitleLoading) {
      toast.error('Please add some content first');
      return;
    }

    setIsTitleLoading(true);
    setTitle('');

    try {
      await suggestTitle(
        content.trim(),
        (chunk) => {
          setTitle(chunk);
        },
        (err) => {
          toast.error(err.message || 'Failed to suggest title');
          setIsTitleLoading(false);
        }
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to suggest title');
    } finally {
      setIsTitleLoading(false);
    }
  };

  const handleGenerateRandomNote = async () => {
    if (isGeneratingNote) return;

    setIsGeneratingNote(true);
    setContent('');
    setTitle('');

    try {
      await generateRandomNote(
        (chunk) => {
          setContent(chunk);
        },
        (err) => {
          toast.error(err.message || 'Failed to generate random note');
          setIsGeneratingNote(false);
        }
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to generate random note');
    } finally {
      setIsGeneratingNote(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    setStatus('Initializing');

    try {
      await notesService.createStreaming(
        { title: title.trim(), content: content.trim() },
        {
          onStatus: (msg) => setStatus(msg),
          onDone: (note) => {
            queryClient.invalidateQueries({ queryKey: NOTE_KEYS.all });
            selectNote(note);
            toast.success('Note created');
            onSuccess();
          },
          onError: (err) => {
            toast.error(err.message || 'Failed to create note');
            setLoading(false);
            setStatus(null);
          },
        }
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to create note');
      setLoading(false);
      setStatus(null);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto overscroll-contain">
      <div className="px-5 sm:px-8 py-8 max-w-4xl mx-auto w-full flex-1">
        <div className="flex items-center justify-between mb-6 relative">
          <h2 className="font-serif text-2xl text-[--color-ink] w-full text-center sm:text-left">
            New note
          </h2>
          <button
            onClick={onCancel}
            className="absolute right-0 sm:relative w-8 h-8 flex items-center justify-center rounded-full hover:bg-[--color-paper-mid] transition-colors"
          >
            <X className="w-4 h-4 text-[--color-ink-mute]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="relative group">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-[--color-ink-soft] uppercase tracking-wider">
                Title
              </label>
              <button
                type="button"
                onClick={handleSuggestTitle}
                disabled={!content.trim() || isTitleLoading || loading}
                className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold text-[--color-accent] hover:text-[--color-accent-bright] disabled:opacity-50 transition-colors"
              >
                {isTitleLoading ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Sparkles className="w-3 h-3" />
                )}
                Suggest Title
              </button>
            </div>
            <Input
              placeholder="Give your note a title…"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-[--color-ink-soft] uppercase tracking-wider">
                Content
              </label>
              <button
                type="button"
                onClick={handleGenerateRandomNote}
                disabled={isGeneratingNote || loading}
                className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold text-[--color-accent] hover:text-[--color-emerald] disabled:opacity-50 transition-colors"
              >
                {isGeneratingNote ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Wand2 className="w-3 h-3" />
                )}
                Auto-generate Random Note
              </button>
            </div>
            <RichTextEditor
              content={content}
              onChange={setContent}
              placeholder="Start writing…"
              minHeight="350px"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-3">
              <Button type="submit" loading={loading} disabled={!content.trim()}>
                Save note
              </Button>
              <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>
                Cancel
              </Button>
            </div>

            {loading && status && (
              <div className="flex items-center gap-2 text-sm text-[--color-accent] font-medium animate-in fade-in slide-in-from-right-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span className="capitalize">{status}...</span>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
