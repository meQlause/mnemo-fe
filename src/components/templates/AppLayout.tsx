import { type ReactNode } from 'react';
import { Sidebar } from '@/components/organisms/Sidebar';
import { useAutoRefresh } from '@/hooks/useAutoRefresh';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  useAutoRefresh();

  return (
    <div className="flex h-screen overflow-hidden bg-[--color-paper]">
      <Sidebar />
      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  );
}
