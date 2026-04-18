import { cn } from '@/utils/cn';
import { formatRelative } from '@/utils/date';
import type { Note } from '@/utils/types';

interface NoteCardProps {
  note: Note;
  selected?: boolean;
  onClick: () => void;
}

/**
 * Strips common markdown syntax for a cleaner plain-text preview
 */
function stripMarkdown(text: string, maxLen = 120): string {
  if (!text) return '';
  return text
    .replace(/```[\s\S]*?```/g, '[code]') // Replace code blocks
    .replace(/#{1,6}\s+/g, '') // Remove headings
    .replace(/(\*\*|__)(.*?)\1/g, '$2') // Remove bold
    .replace(/(\*|_)(.*?)\1/g, '$2') // Remove italic
    .replace(/`([^`]+)`/g, '$1') // Remove inline code
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links
    .replace(/^[-*+]\s+/gm, '') // Remove bullet points
    .replace(/^\d+\.\s+/gm, '') // Remove numbered lists
    .replace(/^>\s+/gm, '') // Remove blockquotes
    .replace(/\n+/g, ' ') // Replace newlines with spaces
    .trim()
    .slice(0, maxLen);
}

export function NoteCard({ note, selected, onClick }: NoteCardProps) {
  const preview = stripMarkdown(note.content, 110);

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full text-left px-4 py-3.5 rounded-[--radius-lg]',
        'border transition-all duration-150 cursor-pointer',
        'hover:bg-[--color-paper-warm]',
        selected
          ? 'bg-[--color-paper-warm] border-[--color-paper-deep] shadow-[--shadow-sm]'
          : 'bg-transparent border-transparent'
      )}
    >
      <div className="flex items-start justify-between gap-2 mb-1">
        <h3
          className={cn(
            'text-sm font-medium leading-snug line-clamp-1 flex-1',
            selected ? 'text-[--color-ink]' : 'text-[--color-ink-soft]'
          )}
        >
          {note.title || 'Untitled'}
        </h3>
        <span className="text-xs text-[--color-ink-mute] shrink-0 mt-0.5 font-mono">
          {formatRelative(note.updated_at)}
        </span>
      </div>
      <p className="text-xs text-[--color-ink-mute] line-clamp-2 leading-relaxed">
        {preview || '—'}
      </p>
      {note.tags && note.tags.length > 0 && (
        <p className="mt-2 text-[10px] text-[--color-ink-mute] font-mono tracking-tight uppercase line-clamp-1">
          {note.tags.slice(0, 3).join(' • ')}
        </p>
      )}
    </button>
  );
}
