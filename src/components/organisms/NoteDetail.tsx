import { formatDate } from '@/utils/date';
import { Badge } from '@/components/atoms/Badge';
import { AIPanel } from '@/components/molecules/AIPanel';
import { useNoteAI } from '@/hooks/useNoteAI';
import { Trash2, Pencil, Check, X } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Textarea } from '@/components/atoms/Textarea';
import { ConfirmDialog } from '@/components/molecules/ConfirmDialog';
import { useNotesStore } from '@/stores/notesStore';
import { useState } from 'react';
import { toast } from 'sonner';
import type { Note } from '@/utils/types';

interface NoteDetailProps {
  note: Note;
}

export function NoteDetail({ note }: NoteDetailProps) {
  const { state, analyze } = useNoteAI(
    note.content,
    {
      summary: note.summary,
      tags: note.tags,
      sentiment: note.sentiment,
    },
    note.id
  );

  const editNote = useNotesStore((s) => s.editNote);
  const deleteNote = useNotesStore((s) => s.deleteNote);

  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(note.title);
  const [editedContent, setEditedContent] = useState(note.content);
  const [isSaving, setIsSaving] = useState(false);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [prevNote, setPrevNote] = useState(note);
  if (note !== prevNote) {
    setPrevNote(note);
    setEditedTitle(note.title);
    setEditedContent(note.content);
  }

  const handleSave = async () => {
    if (!editedContent.trim()) {
      toast.error('Content cannot be empty');
      return;
    }

    setIsSaving(true);
    try {
      await editNote(note.id, {
        title: editedTitle.trim(),
        content: editedContent.trim(),
      });
      setIsEditing(false);
      toast.success('Note updated');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update note');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteNote(note.id);
      toast.success('Note deleted');
      setIsDeleteDialogOpen(false);
    } catch {
      toast.error('Failed to delete note');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="flex-1 px-8 py-8 max-w-3xl mx-auto w-full">
        {/* Header Actions */}
        <div className="flex justify-end gap-2 mb-4">
          {!isEditing ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="text-[--color-ink-mute]"
              >
                <Pencil className="w-3.5 h-3.5 mr-1.5" />
                Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsDeleteDialogOpen(true)}
                className="text-[--color-crimson]"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                Delete
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsEditing(false)}
                disabled={isSaving}
              >
                <X className="w-3.5 h-3.5 mr-1.5" />
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave} loading={isSaving}>
                <Check className="w-3.5 h-3.5 mr-1.5" />
                Save Changes
              </Button>
            </>
          )}
        </div>

        {/* Note Body */}
        <div className="mb-8">
          {isEditing ? (
            <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-top-2">
              <Input
                label="Title"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                placeholder="Note title..."
              />
              <Textarea
                label="Content"
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                placeholder="Write something..."
                rows={15}
              />
            </div>
          ) : (
            <div className="animate-in fade-in">
              <h1 className="font-serif text-3xl text-[--color-ink] leading-tight mb-2">
                {note.title || 'Untitled'}
              </h1>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 mb-8 group/metadata">
                <div className="flex ml-1.5 items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[--color-accent] hidden sm:block" />
                  <span className="text-xs text-[--color-ink-mute] font-mono whitespace-nowrap uppercase tracking-widest">
                    {formatDate(note.created_at)}
                  </span>
                </div>

                {note.tags && note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {note.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="default"
                        className="text-[10px] uppercase tracking-wider"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              <div className="prose prose-sm max-w-none">
                <p className="text-[--color-ink-soft] leading-relaxed whitespace-pre-wrap font-sans text-sm">
                  {note.content}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* AI Panel */}
        {!isEditing && (
          <AIPanel
            state={state}
            onAnalyze={() => analyze(note.id)}
            hasContent={note.content.trim().length > 0}
          />
        )}
      </div>

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Delete Note"
        description="Are you sure you want to delete this note? This action cannot be undone."
        confirmText="Delete Note"
      />
    </div>
  );
}
