import { AppLayout } from '@/components/templates/AppLayout';
import { ChatFeature } from '@/features/chat/ChatFeature';

export function ChatPage() {
  return (
    <AppLayout>
      <ChatFeature />
    </AppLayout>
  );
}
