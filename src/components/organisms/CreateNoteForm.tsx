import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Textarea } from '@/components/atoms/Textarea';
import { useNotesStore } from '@/stores/notesStore';
import { suggestTitle } from '@/services/aiService';
import { X, Loader2, Sparkles } from 'lucide-react';

interface CreateNoteFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function CreateNoteForm({ onSuccess, onCancel }: CreateNoteFormProps) {
  const createNoteStreaming = useNotesStore((s) => s.createNoteStreaming);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [isTitleLoading, setIsTitleLoading] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    setLoading(true);
    setStatus('Initializing');
    
    try {
      await createNoteStreaming(
        { title: title.trim(), content: content.trim() },
        {
          onStatus: (msg) => setStatus(msg),
          onError: (err) => {
            toast.error(err.message || 'Failed to create note');
            setLoading(false);
            setStatus(null);
          }
        }
      );
      toast.success('Note created');
      onSuccess();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to create note');
      setLoading(false);
      setStatus(null);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="px-8 py-8 max-w-2xl mx-auto w-full flex-1">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-2xl text-[--color-ink]">New note</h2>
          <button
            onClick={onCancel}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[--color-paper-mid] transition-colors"
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

          <Textarea
            label="Content"
            placeholder="Start writing…"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={12}
            required
          />
          
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
