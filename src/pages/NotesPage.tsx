import { AppLayout } from '@/components/templates/AppLayout';
import { NotesFeature } from '@/features/notes/NotesFeature';

export function NotesPage() {
  return (
    <AppLayout>
      <NotesFeature />
    </AppLayout>
  );
}
