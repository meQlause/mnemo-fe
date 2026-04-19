import { useState } from 'react';
import { Plus, Search, Filter, X, Calendar } from 'lucide-react';
import { NoteCard } from '@/components/molecules/NoteCard';
import { Button } from '@/components/atoms/Button';
import { Spinner } from '@/components/atoms/Spinner';
import { useNotesStore } from '@/stores/notesStore';
import { useNotes, useSearchNotes } from '@/hooks/useNotes';
import type { Note } from '@/utils/types';
import { cn } from '@/utils/cn';

interface NotesListProps {
  onCreateNew: () => void;
  onNoteSelect?: () => void;
}

export function NotesList({ onCreateNew, onNoteSelect }: NotesListProps) {
  const selectedNote = useNotesStore((s) => s.selectedNote);
  const selectNote = useNotesStore((s) => s.selectNote);

  const [query, setQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const isSearchActive = !!(query.trim() || startDate || endDate);

  // Queries
  const { data: allNotes = [], isLoading: isLoadingAll, error: errorAll } = useNotes();
  const {
    data: searchResults,
    isLoading: isLoadingSearch,
    error: errorSearch,
  } = useSearchNotes(
    query,
    startDate ? `${startDate}T00:00:00` : undefined,
    endDate ? `${endDate}T23:59:59` : undefined
  );

  const notes = isSearchActive ? (searchResults ?? []) : allNotes;
  const isLoading = isSearchActive ? isLoadingSearch : isLoadingAll;
  const error = (isSearchActive ? errorSearch : errorAll) as Error | null;

  const handleSelect = (note: Note) => {
    selectNote(note);
    onNoteSelect?.();
  };

  const setShorthand = (period: 'week' | 'month' | 'year') => {
    const start = new Date();
    const end = new Date();

    if (period === 'week') {
      start.setDate(start.getDate() - 14);
      end.setDate(end.getDate() - 7);
    } else if (period === 'month') {
      start.setMonth(start.getMonth() - 2);
      end.setMonth(end.getMonth() - 1);
    } else if (period === 'year') {
      start.setFullYear(start.getFullYear() - 2);
      end.setFullYear(end.getFullYear() - 1);
    }

    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(end.toISOString().split('T')[0]);
    setIsFilterOpen(true);
  };

  const clearFilters = () => {
    setQuery('');
    setStartDate('');
    setEndDate('');
    setIsFilterOpen(false);
  };

  const hasActiveFilters = !!(startDate || endDate);

  return (
    <div className="flex flex-col h-full bg-[--color-paper-warm]/30">
      {/* Header */}
      <div className="px-4 pt-5 pb-3 border-b border-[--color-border-soft] bg-[--color-paper-warm]/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-[--color-ink] flex items-center gap-2">
            Notes{' '}
            <span className="text-[--color-ink-mute] font-normal font-mono text-[10px] bg-[--color-paper-mid] px-1.5 py-0.5 rounded-full">
              {notes.length}
            </span>
          </h2>
          <Button variant="primary" size="sm" onClick={onCreateNew} className="h-7 px-2.5">
            <Plus className="w-3.5 h-3.5" />
            New
          </Button>
        </div>

        <div className="flex flex-col gap-2">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[--color-ink-mute] group-focus-within:text-[--color-ink] transition-colors" />
            <input
              type="text"
              placeholder="Search notes…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-9 pr-10 py-2 text-xs bg-[--color-paper] border border-[--color-border-soft]
                rounded-[--radius-md] text-[--color-ink] placeholder:text-[--color-ink-mute]
                focus:outline-none focus:border-[--color-ink-mute] focus:ring-1 focus:ring-[--color-border]
                transition-all duration-150"
            />
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={cn(
                'absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded transition-colors',
                isFilterOpen || hasActiveFilters
                  ? 'text-[--color-accent] bg-[--color-accent]/10'
                  : 'text-[--color-ink-mute] hover:bg-[--color-paper-mid]'
              )}
              title="Toggle filters"
            >
              <Filter className="w-3 h-3" />
            </button>
          </div>

          {/* Quick Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
            <button
              onClick={() => setShorthand('week')}
              className="text-[10px] px-2 py-0.5 rounded-full border border-[--color-border-soft] text-[--color-ink-soft] hover:bg-[--color-paper-mid] whitespace-nowrap transition-colors"
            >
              Last Week
            </button>
            <button
              onClick={() => setShorthand('month')}
              className="text-[10px] px-2 py-0.5 rounded-full border border-[--color-border-soft] text-[--color-ink-soft] hover:bg-[--color-paper-mid] whitespace-nowrap transition-colors"
            >
              Last Month
            </button>
            <button
              onClick={() => setShorthand('year')}
              className="text-[10px] px-2 py-0.5 rounded-full border border-[--color-border-soft] text-[--color-ink-soft] hover:bg-[--color-paper-mid] whitespace-nowrap transition-colors"
            >
              Last Year
            </button>
            {(query || hasActiveFilters) && (
              <button
                onClick={clearFilters}
                className="text-[10px] px-2 py-0.5 rounded-full border border-[--color-crimson]/20 text-[--color-crimson] hover:bg-[--color-crimson]/10 whitespace-nowrap transition-colors flex items-center gap-1"
              >
                <X className="w-2 h-2" />
                Clear
              </button>
            )}
          </div>

          {/* Expanded Filters */}
          {isFilterOpen && (
            <div className="flex flex-col gap-2 p-2 bg-[--color-paper-mid]/30 rounded-[--radius-md] border border-[--color-border-soft] animate-in slide-in-from-top-1 duration-200">
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-medium text-[--color-ink-mute] uppercase tracking-wider">
                    From
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-2 top-1/2 -translate-y-1/2 w-2.5 h-2.5 text-[--color-ink-mute]" />
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full pl-6 pr-2 py-1 text-[10px] bg-[--color-paper] border border-[--color-border-soft] rounded focus:outline-none focus:border-[--color-ink-mute]"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-medium text-[--color-ink-mute] uppercase tracking-wider">
                    To
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-2 top-1/2 -translate-y-1/2 w-2.5 h-2.5 text-[--color-ink-mute]" />
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full pl-6 pr-2 py-1 text-[10px] bg-[--color-paper] border border-[--color-border-soft] rounded focus:outline-none focus:border-[--color-ink-mute]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto overscroll-contain px-2 py-2">
        {isLoading && (
          <div className="flex justify-center py-8">
            <Spinner size="sm" />
          </div>
        )}

        {!isLoading && error && (
          <div className="text-center py-10 px-4 animate-in fade-in">
            <p className="text-sm text-[--color-crimson] mb-4">{error.message}</p>
            <Button variant="secondary" size="sm" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        )}

        {!isLoading && !error && notes.length === 0 && (
          <div className="text-center py-10 px-4">
            <p className="text-sm text-[--color-ink-mute]">
              {query || hasActiveFilters ? 'No notes match your search.' : 'No notes yet.'}
            </p>
            {!query && !hasActiveFilters && (
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
