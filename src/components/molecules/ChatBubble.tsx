import { cn } from '@/utils/cn';
import { formatTime } from '@/utils/date';
import { useNotesStore } from '@/stores/notesStore';
import { useNotes } from '@/hooks/useNotes';
import { BookOpen } from 'lucide-react';
import type { ChatMessage, Note } from '@/utils/types';
import { Markdown } from '@/components/atoms/Markdown';
import { Button } from '@/components/atoms/Button';

interface ChatBubbleProps {
  message: ChatMessage;
  onSelectNote?: (id: number) => void;
  onViewNote?: (note: Partial<Note>) => void;
}

export function ChatBubble({ message, onSelectNote, onViewNote }: ChatBubbleProps) {
  const isUser = message.role === 'user';
  const selectNote = useNotesStore((s) => s.selectNote);
  const { data: notes = [] } = useNotes();

  const handleNoteClick = (id: number) => {
    const note = notes.find((n: Note | undefined) => n?.id === id);
    if (note) selectNote(note);
  };

  return (
    <div className={cn('flex gap-3 animate-fade-in', isUser ? 'flex-row-reverse' : 'flex-row')}>
      <div
        className={cn(
          'w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-xs font-medium mt-0.5',
          isUser
            ? 'bg-[--color-ink] text-[--color-paper]'
            : 'bg-[--color-accent-soft] text-[--color-accent] border border-[--color-paper-deep]'
        )}
      >
        {isUser ? 'U' : 'AI'}
      </div>

      <div className={cn('flex flex-col gap-1 max-w-[85%] sm:max-w-[75%]', isUser && 'items-end')}>
        <div
          className={cn(
            'px-4 py-3 rounded-[--radius-lg] text-sm leading-relaxed font-sans',
            isUser
              ? 'bg-[--color-ink] text-[--color-paper] rounded-tr-[--radius-sm]'
              : 'bg-[--color-surface] border border-[--color-border] text-[--color-ink] rounded-tl-[--radius-sm] shadow-[--shadow-sm]'
          )}
        >
          <div className={cn(!isUser && 'whitespace-normal')}>
            {isUser ? (
              <div className="whitespace-pre-wrap">{message.content}</div>
            ) : message.content ? (
              <Markdown content={message.content} compact />
            ) : (
              !message.status && !message.candidate_notes && (
                <span className="flex gap-1 items-center py-0.5">
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-[--color-ink-mute] animate-pulse-soft"
                    style={{ animationDelay: '0ms' }}
                  />
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-[--color-ink-mute] animate-pulse-soft"
                    style={{ animationDelay: '200ms' }}
                  />
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-[--color-ink-mute] animate-pulse-soft"
                    style={{ animationDelay: '400ms' }}
                  />
                </span>
              )
            )}
          </div>

          {!isUser && message.candidate_notes && message.candidate_notes.length > 0 && (
            <div className="mt-4 flex flex-col gap-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[--color-ink-mute] mb-1">
                Select the correct note:
              </p>
              <div className="flex flex-col gap-2">
                {message.candidate_notes.map((note, idx) => (
                  <div
                    key={`candidate-${note.id}-${idx}`}
                    className={cn(
                      "group p-3 rounded-[--radius-md] border transition-all",
                      "bg-[--color-paper] border-[--color-border-soft] hover:border-[--color-accent] hover:shadow-[--shadow-sm]",
                      "flex flex-col gap-2"
                    )}
                  >
                    <div className="flex flex-col gap-1 cursor-pointer" onClick={() => onViewNote?.(note)}>
                      <span className="font-semibold text-sm text-[--color-ink] group-hover:text-[--color-accent] transition-colors leading-tight">
                        {note.title || 'Untitled Note'}
                      </span>
                      {note.content && (
                        <span className="text-[11px] text-[--color-ink-mute] line-clamp-2 leading-relaxed">
                          {note.content.substring(0, 150)}...
                        </span>
                      )}
                    </div>
                    
                    <div className="flex gap-2 mt-1">
                      <Button 
                        size="xs" 
                        className="flex-1 text-[10px] h-7"
                        onClick={() => onSelectNote?.(note.id!)}
                      >
                        Select Note
                      </Button>
                      <Button 
                        variant="secondary" 
                        size="xs" 
                        className="flex-1 text-[10px] h-7"
                        onClick={() => onViewNote?.(note)}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!isUser && message.context && message.context.length > 0 && (
            <div className="mt-4 pt-4 border-t border-[--color-border-soft]">
              <details className="group">
                <summary className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[--color-ink-mute] cursor-pointer hover:text-[--color-ink] transition-colors list-none select-none">
                  <BookOpen className="w-3 h-3 group-open:text-[--color-accent] transition-colors" />
                  <span className="flex-1">Source Notes ({message.context.length})</span>
                  <span className="text-[8px] transform group-open:rotate-180 transition-transform">
                    ▼
                  </span>
                </summary>
                <div className="flex flex-col gap-1.5 mt-3 pl-4 border-l border-[--color-border-soft]">
                  {message.context.map((ctx, idx) => (
                    <button
                      key={`ctx-${ctx.id}-${idx}`}
                      onClick={() => handleNoteClick(ctx.id)}
                      className="text-left py-1 text-[11px] text-[--color-ink-soft] hover:text-[--color-ink] hover:underline underline-offset-2 transition-all w-fit"
                    >
                      {ctx.title || 'Untitled'}
                    </button>
                  ))}
                </div>
              </details>
            </div>
          )}

          {message.status && message.streaming && (
            <div className="flex items-center gap-2 mt-3 py-1 px-2 bg-[--color-paper-warm] rounded-[--radius-md] border border-[--color-border-soft] animate-in fade-in slide-in-from-bottom-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[--color-accent] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[--color-accent]" />
              </span>
              <span className="text-[10px] uppercase tracking-widest font-bold text-[--color-ink-soft]">
                {message.status}…
              </span>
            </div>
          )}
        </div>
        <span className="text-xs text-[--color-ink-mute] font-mono px-1">
          {formatTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
}
