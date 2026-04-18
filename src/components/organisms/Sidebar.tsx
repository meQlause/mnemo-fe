import { NavLink, useNavigate } from 'react-router-dom';
import { FileText, MessageSquare, LogOut } from 'lucide-react';
import { Logo } from '@/components/atoms/Logo';
import { useAuthStore } from '@/stores/authStore';
import { cn } from '@/utils/cn';

interface SidebarProps {
  className?: string;
}

const navItems = [
  { to: '/notes', icon: FileText, label: 'Notes' },
  { to: '/chat', icon: MessageSquare, label: 'Chat' },
];

export function Sidebar({ className }: SidebarProps) {
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside
      className={cn(
        'flex flex-col w-14 shrink-0 bg-[--color-paper-warm] border-r border-[--color-border]',
        'h-screen sticky top-0 items-center',
        className
      )}
    >
      {/* Brand */}
      <div className="py-5 w-full flex justify-center border-b border-[--color-border-soft]">
        <Logo size="sm" />
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 flex flex-col gap-2 w-full px-2">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            title={label}
            className={({ isActive }) =>
              cn(
                'flex items-center justify-center h-10 w-10 rounded-[--radius-md]',
                'transition-all duration-150',
                isActive
                  ? 'bg-[--color-ink] text-[--color-paper]'
                  : 'text-[--color-ink-soft] hover:bg-[--color-paper-mid]'
              )
            }
          >
            <Icon className="w-5 h-5" />
          </NavLink>
        ))}
      </nav>

      {/* User footer */}
      <div className="py-4 flex flex-col gap-3 w-full px-2 border-t border-[--color-border-soft] items-center">
        {user && (
          <div 
            className="w-8 h-8 rounded-full bg-[--color-ink-mute] text-[--color-paper] flex items-center justify-center text-xs font-bold uppercase cursor-default"
            title={user.username ?? user.email}
          >
            {(user.username?.[0] || user.email?.[0] || '?').toUpperCase()}
          </div>
        )}
        <button
          onClick={handleLogout}
          title="Sign out"
          className="flex items-center justify-center w-10 h-10 rounded-[--radius-md]
            text-[--color-ink-soft] hover:bg-[--color-paper-mid]
            hover:text-[--color-crimson] transition-all duration-150"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
}
