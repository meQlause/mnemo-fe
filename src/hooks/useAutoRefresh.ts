import { useEffect, useRef } from 'react';
import { authService } from '@/services/authService';
import { tokenService } from '@/services/tokenService';
import { useAuthStore } from '@/stores/authStore';

const REFRESH_INTERVAL = 4 * 60 * 1000;

export function useAutoRefresh() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const logout = useAuthStore((s) => s.logout);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(async () => {
      try {
        await authService.refreshTokens();
      } catch {
        logout();
      }
    }, REFRESH_INTERVAL);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isAuthenticated, logout]);
}
