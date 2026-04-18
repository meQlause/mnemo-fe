import { tokenService } from './tokenService';

const BASE_URL = '/api/v1';

let isRefreshing = false;
let refreshQueue: Array<(token: string) => void> = [];

function getCsrfToken(): string | null {
  const name = 'fastapi-csrf-token=';
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return null;
}

async function refreshAccessToken(): Promise<string> {
  const res = await fetch(`${BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'X-CSRF-Token': getCsrfToken() || '',
    },
    credentials: 'include',
  });

  if (!res.ok) {
    tokenService.clear();
    throw new Error('Refresh failed');
  }

  const data = await res.json();
  tokenService.setAccess(data.access_token);
  return data.access_token;
}

async function getValidToken(): Promise<string> {
  const token = tokenService.getAccess();
  if (token) return token;

  if (isRefreshing) {
    return new Promise((resolve) => {
      refreshQueue.push(resolve);
    });
  }

  isRefreshing = true;
  try {
    const newToken = await refreshAccessToken();
    refreshQueue.forEach((cb) => cb(newToken));
    refreshQueue = [];
    return newToken;
  } finally {
    isRefreshing = false;
  }
}

interface RequestOptions extends RequestInit {
  skipAuth?: boolean;
}

interface FastApiError {
  detail: string | Array<{ msg: string; loc: string[] }>;
}

async function parseError(res: Response): Promise<string> {
  try {
    const data = (await res.json()) as FastApiError;
    if (typeof data.detail === 'string') return data.detail;
    if (Array.isArray(data.detail)) {
      return data.detail
        .map((err) => {
          const field = err.loc[err.loc.length - 1];
          return `${field.charAt(0).toUpperCase() + field.slice(1)}: ${err.msg}`;
        })
        .join('. ');
    }
    return 'An unexpected error occurred';
  } catch {
    return `Request failed with status ${res.status}`;
  }
}

export async function apiStreamSSE(
  path: string,
  callbacks: {
    onMessage: (data: string) => void;
    onError?: (err: Error) => void;
  },
  options: RequestOptions = {}
): Promise<void> {
  try {
    const { skipAuth = false, ...init } = options;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (!skipAuth) {
      const token = await getValidToken();
      headers['Authorization'] = `Bearer ${token}`;
    }

    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(init.method?.toUpperCase() || '')) {
      const csrfToken = getCsrfToken();
      if (csrfToken) headers['X-CSRF-Token'] = csrfToken;
    }

    const res = await fetch(`${BASE_URL}${path}`, { ...init, headers, credentials: 'include' });

    if (!res.ok) {
      const errorMsg = await parseError(res);
      throw new Error(errorMsg);
    }

    if (!res.body) {
      throw new Error('Response body is null');
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      const parts = buffer.split('\n\n');

      buffer = parts.pop() || '';

      for (const part of parts) {
        const lines = part.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data) {
              callbacks.onMessage(data);
            }
          }
        }
      }
    }
  } catch (err) {
    if (callbacks.onError) {
      callbacks.onError(err instanceof Error ? err : new Error(String(err)));
    } else {
      throw err;
    }
  }
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { skipAuth = false, ...init } = options;

  const defaultHeaders: Record<string, string> = {};
  if (!(init.body instanceof URLSearchParams)) {
    defaultHeaders['Content-Type'] = 'application/json';
  }

  const headers: Record<string, string> = {
    ...defaultHeaders,
    ...(init.headers as Record<string, string>),
  };

  if (!skipAuth) {
    const token = await getValidToken();
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Add CSRF token for mutations
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(init.method?.toUpperCase() || '')) {
    const csrfToken = getCsrfToken();
    if (csrfToken) headers['X-CSRF-Token'] = csrfToken;
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...init, headers, credentials: 'include' });

  if (res.status === 401 && !skipAuth) {
    tokenService.clearAccess();
    const newToken = await getValidToken();
    headers['Authorization'] = `Bearer ${newToken}`;
    
    // Retry with new token and CSRF
    const retry = await fetch(`${BASE_URL}${path}`, { ...init, headers, credentials: 'include' });
    if (!retry.ok) throw new Error(await parseError(retry));
    return retry.json();
  }

  if (!res.ok) {
    throw new Error(await parseError(res));
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}
