import { useEffect, useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { NoteCard } from '@/components/molecules/NoteCard';
import { Button } from '@/components/atoms/Button';
import { Spinner } from '@/components/atoms/Spinner';
import { useNotesStore } from '@/stores/notesStore';
import type { Note } from '@/utils/types';

interface NotesListProps {
  onCreateNew: () => void;
  onNoteSelect?: () => void;
}

export function NotesList({ onCreateNew, onNoteSelect }: NotesListProps) {
  const { notes, selectedNote, isLoading, error, fetchNotes, searchNotes, selectNote } =
    useNotesStore();
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!query.trim()) {
      fetchNotes().catch(() => {});
      return;
    }

    const timer = setTimeout(() => {
      searchNotes(query).catch(() => {});
    }, 1000);

    return () => clearTimeout(timer);
  }, [query, fetchNotes, searchNotes]);

  const handleSelect = (note: Note) => {
    selectNote(note);
    onNoteSelect?.();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 pt-5 pb-3 border-b border-[--color-border-soft]">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-[--color-ink]">
            Notes{' '}
            <span className="text-[--color-ink-mute] font-normal font-mono">({notes.length})</span>
          </h2>
          <Button variant="primary" size="sm" onClick={onCreateNew}>
            <Plus className="w-3.5 h-3.5" />
            New
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[--color-ink-mute]" />
          <input
            type="text"
            placeholder="Search notes…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-[--color-surface] border border-[--color-border]
              rounded-[--radius-md] text-[--color-ink] placeholder:text-[--color-ink-mute]
              focus:outline-none focus:border-[--color-ink] transition-all duration-150"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-2 py-2">
        {isLoading && (
          <div className="flex justify-center py-8">
            <Spinner size="sm" />
          </div>
        )}

        {!isLoading && error && (
          <div className="text-center py-10 px-4 animate-in fade-in">
            <p className="text-sm text-[--color-crimson] mb-4">{error}</p>
            <Button variant="secondary" size="sm" onClick={() => fetchNotes()}>
              Retry
            </Button>
          </div>
        )}

        {!isLoading && !error && notes.length === 0 && (
          <div className="text-center py-10 px-4">
            <p className="text-sm text-[--color-ink-mute]">
              {query ? 'No notes match your search.' : 'No notes yet.'}
            </p>
            {!query && (
              <button
                onClick={onCreateNew}
                className="mt-2 text-xs text-[--color-accent] hover:underline"
              >
                Create your first note →
              </button>
            )}
          </div>
        )}

        <div className="flex flex-col gap-0.5">
          {notes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              selected={selectedNote?.id === note.id}
              onClick={() => handleSelect(note)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
