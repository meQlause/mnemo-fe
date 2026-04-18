import { ChatWindow } from '@/components/organisms/ChatWindow';
import { useNotesStore } from '@/stores/notesStore';
import { useEffect } from 'react';

export function ChatFeature() {
  const fetchNotes = useNotesStore((s) => s.fetchNotes);
  const notes = useNotesStore((s) => s.notes);

  useEffect(() => {
    if (notes.length === 0) fetchNotes();
  }, [fetchNotes, notes.length]);

  return (
    <div className="h-full flex flex-col">
      <ChatWindow />
    </div>
  );
}
