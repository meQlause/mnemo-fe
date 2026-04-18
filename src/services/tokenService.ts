let _accessToken: string | null = null;

const REFRESH_KEY = 'mnemo_refresh';

export const tokenService = {
  getAccess(): string | null {
    return _accessToken;
  },

  setAccess(token: string): void {
    _accessToken = token;
  },

  clearAccess(): void {
    _accessToken = null;
  },

  getRefresh(): string | null {
    return localStorage.getItem(REFRESH_KEY);
  },

  setRefresh(token: string): void {
    localStorage.setItem(REFRESH_KEY, token);
  },

  clearRefresh(): void {
    localStorage.removeItem(REFRESH_KEY);
  },

  clear(): void {
    _accessToken = null;
    localStorage.removeItem(REFRESH_KEY);
  },
};
