import { useState } from 'react';
import { NotesList } from '@/components/organisms/NotesList';
import { NoteDetail } from '@/components/organisms/NoteDetail';
import { CreateNoteForm } from '@/components/organisms/CreateNoteForm';
import { useNotesStore } from '@/stores/notesStore';
import { FileText, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { cn } from '@/utils/cn';

type View = 'detail' | 'create' | 'empty';

export function NotesFeature() {
  const selectedNote = useNotesStore((s) => s.selectedNote);
  const selectNote = useNotesStore((s) => s.selectNote);
  const [view, setView] = useState<View>('empty');
  const [isListVisible, setIsListVisible] = useState(true);

  const handleNoteSelect = () => {
    if (window.innerWidth < 768) {
      setIsListVisible(false);
    }
  };

  const handleCreateNew = () => {
    selectNote(null);
    setView('create');
    if (window.innerWidth < 768) {
      setIsListVisible(false);
    }
  };

  const handleCreateSuccess = () => {
    setView('empty');
  };

  const handleCreateCancel = () => {
    setView(selectedNote ? 'detail' : 'empty');
  };

  const currentView: View = view === 'create' ? 'create' : selectedNote ? 'detail' : 'empty';

  return (
    <div className="flex h-full relative">
      {/* Notes sidebar list */}
      <div
        className={cn(
          'shrink-0 border-[--color-border] h-full overflow-hidden transition-all duration-300 ease-in-out',
          isListVisible ? 'w-80 border-r opacity-100' : 'w-0 border-r-0 opacity-0'
        )}
      >
        <div className="w-80 h-full">
          <NotesList onCreateNew={handleCreateNew} onNoteSelect={handleNoteSelect} />
        </div>
      </div>

      {/* Main content panel */}
      <div className="flex-1 h-full overflow-hidden relative">
        <button
          onClick={() => setIsListVisible(!isListVisible)}
          className={cn(
            'absolute top-5 left-0.5 z-20 flex items-center justify-center w-8 h-8 rounded-[--radius-md]',
            'text-[--color-ink-soft] bg-[--color-paper]/80 backdrop-blur-sm border border-[--color-border-soft]',
            'hover:bg-[--color-paper-mid] hover:text-[--color-ink] transition-all'
          )}
          title={isListVisible ? 'Hide notes list' : 'Show notes list'}
        >
          {isListVisible ? (
            <PanelLeftClose className="w-4 h-4" />
          ) : (
            <PanelLeftOpen className="w-4 h-4" />
          )}
        </button>
        {currentView === 'create' && (
          <CreateNoteForm onSuccess={handleCreateSuccess} onCancel={handleCreateCancel} />
        )}

        {currentView === 'detail' && selectedNote && <NoteDetail note={selectedNote} />}

        {currentView === 'empty' && (
          <div className="flex flex-col items-center justify-center h-full text-center px-8">
            <div className="w-16 h-16 rounded-2xl bg-[--color-paper-warm] border border-[--color-border] flex items-center justify-center mb-5">
              <FileText className="w-7 h-7 text-[--color-ink-mute]" />
            </div>
            <h3 className="font-serif text-2xl text-[--color-ink] mb-2">Select a note</h3>
            <p className="text-sm text-[--color-ink-mute] max-w-xs leading-relaxed">
              Choose a note from the list or create a new one to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
