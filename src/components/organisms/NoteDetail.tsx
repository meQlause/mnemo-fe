import { formatDate } from '@/utils/date';
import { Badge } from '@/components/atoms/Badge';
import { AIPanel } from '@/components/molecules/AIPanel';
import { useNoteAI } from '@/hooks/useNoteAI';
import { Trash2, Pencil, Check, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { ConfirmDialog } from '@/components/molecules/ConfirmDialog';
import { useState } from 'react';
import { toast } from 'sonner';
import type { Note } from '@/utils/types';
import { Markdown } from '@/components/atoms/Markdown';
import { RichTextEditor } from '@/components/molecules/RichTextEditor';
import { useUpdateNote, useDeleteNote } from '@/hooks/useNotes';
import { cn } from '@/utils/cn';

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

  const updateMutation = useUpdateNote();
  const deleteMutation = useDeleteNote();

  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(note.title);
  const [editedContent, setEditedContent] = useState(note.content);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [showEventDetails, setShowEventDetails] = useState(false);

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

    updateMutation.mutate(
      {
        id: note.id,
        payload: {
          title: editedTitle.trim(),
          content: editedContent.trim(),
        },
      },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      }
    );
  };

  const handleDelete = async () => {
    deleteMutation.mutate(note.id, {
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
      },
    });
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto overscroll-contain">
      <div className="flex-1 px-5 sm:px-8 py-8 max-w-4xl mx-auto w-full">
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
                disabled={updateMutation.isPending}
              >
                <X className="w-3.5 h-3.5 mr-1.5" />
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave} loading={updateMutation.isPending}>
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
              <RichTextEditor
                content={editedContent}
                onChange={setEditedContent}
                minHeight="400px"
              />
            </div>
          ) : (
            <div className="animate-in fade-in relative">
              <h1 className="font-serif text-3xl text-[--color-ink] leading-tight mb-2">
                {note.title || 'Untitled'}
              </h1>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 mb-8 group/metadata">
                <div className="flex flex-col gap-1 sm:gap-2">
                  <div className="flex ml-1.5 items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[--color-accent] hidden sm:block" />
                    <span className="text-xs text-[--color-ink-mute] font-mono whitespace-nowrap uppercase tracking-widest">
                      {formatDate(note.created_at)}
                    </span>
                  </div>
                </div>

                {note.tags && note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1 sm:pt-0">
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

              {note.event_date && (
                <div className="absolute top-0 right-0 z-20">
                  <button
                    onClick={() => setShowEventDetails(!showEventDetails)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wider uppercase transition-all duration-300 shadow-sm border",
                      showEventDetails 
                        ? "bg-[--color-midnight] text-white border-[--color-midnight] shadow-[--shadow-md]" 
                        : "bg-white text-[--color-accent] border-[--color-accent]/20 hover:border-[--color-accent] hover:shadow-md"
                    )}
                  >
                    <Sparkles className={cn("w-3 h-3", showEventDetails ? "animate-pulse" : "")} />
                    {showEventDetails ? 'Close Insights' : 'AI Metadata'}
                  </button>

                  {showEventDetails && (
                    <div className="absolute top-10 right-0 w-80 p-5 bg-white/95 backdrop-blur-md rounded-2xl border border-[--color-border-soft] shadow-2xl animate-in fade-in slide-in-from-top-2 duration-300 z-30">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-[--color-ink-mute]">Extraction Engine</span>
                        <div className="h-px flex-1 bg-[--color-border-soft]" />
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                          note.event_confidence === 'HIGH' ? 'border-emerald-200 text-emerald-600 bg-emerald-50' : 
                          note.event_confidence === 'MEDIUM' ? 'border-amber-200 text-amber-600 bg-amber-50' : 
                          'border-slate-200 text-slate-500 bg-slate-50'
                        }`}>
                          {note.event_confidence}
                        </span>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex flex-col gap-1">
                          <span className="text-[9px] uppercase tracking-tighter text-[--color-ink-mute]">Resolved Date</span>
                          <span className="text-sm font-serif font-bold text-[--color-midnight]">{note.event_date}</span>
                        </div>

                        {note.event_reasoning && (
                          <div className="flex flex-col gap-1 pt-3 border-t border-[--color-border-soft]">
                            <span className="text-[9px] uppercase tracking-tighter text-[--color-ink-mute]">Logic & Reasoning</span>
                            <p className="text-[12px] text-slate-600 italic leading-relaxed">
                              &ldquo;{note.event_reasoning}&rdquo;
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
              <div className="prose prose-sm max-w-none swap-break-words">
                <Markdown content={note.content} />
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
        isLoading={deleteMutation.isPending}
        title="Delete Note"
        description="Are you sure you want to delete this note? This action cannot be undone."
        confirmText="Delete Note"
      />
    </div>
  );
}
