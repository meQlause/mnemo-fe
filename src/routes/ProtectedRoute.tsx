import { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { tokenService } from '@/services/tokenService';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const hasRefreshToken = Boolean(tokenService.getRefresh());

  if (!isAuthenticated && !hasRefreshToken) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
