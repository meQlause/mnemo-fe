let _accessToken: string | null = null;

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

  clear(): void {
    _accessToken = null;
  },
};
