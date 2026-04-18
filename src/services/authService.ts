import { apiRequest } from './apiClient';
import { tokenService } from './tokenService';
import type { AuthTokens, User } from '@/utils/types';

export interface LoginPayload {
  username: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  username: string;
}

export const authService = {
  async login(payload: LoginPayload): Promise<AuthTokens> {
    const params = new URLSearchParams();
    params.append('username', payload.username);
    params.append('password', payload.password);

    const data = await apiRequest<AuthTokens>('/auth/login', {
      method: 'POST',
      body: params,
      skipAuth: true,
    });
    tokenService.setAccess(data.access_token);
    return data;
  },

  async register(payload: RegisterPayload): Promise<User> {
    const data = await apiRequest<User>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
      skipAuth: true,
    });
    return data;
  },

  async refreshTokens(): Promise<AuthTokens> {
    const data = await apiRequest<AuthTokens>('/auth/refresh', {
      method: 'POST',
      skipAuth: true,
    });
    tokenService.setAccess(data.access_token);
    return data;
  },

  async getMe(): Promise<User> {
    const data = await apiRequest<User>('/auth/me', {
      method: 'GET',
    });
    return data;
  },

  async logout(): Promise<void> {
    try {
      await apiRequest('/auth/logout', { method: 'POST' });
    } finally {
      tokenService.clear();
    }
  },
};
