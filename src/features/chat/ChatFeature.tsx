import { ChatWindow } from '@/components/organisms/ChatWindow';
import { useNotes } from '@/hooks/useNotes';

export function ChatFeature() {
  useNotes();

  return (
    <div className="h-full flex flex-col">
      <ChatWindow />
    </div>
  );
}
