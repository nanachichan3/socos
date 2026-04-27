// API client for SOCOS Platform → NestJS backend

import { getToken } from './auth';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({ message: res.statusText }));

  if (!res.ok) {
    throw new ApiError(res.status, data.message || data.error || 'Request failed');
  }

  return data as T;
}

export const api = {
  get: <T = unknown>(path: string) => apiFetch<T>(path),
  post: <T = unknown>(path: string, body: unknown) =>
    apiFetch<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  put: <T = unknown>(path: string, body: unknown) =>
    apiFetch<T>(path, { method: 'PUT', body: JSON.stringify(body) }),
  delete: <T = unknown>(path: string) =>
    apiFetch<T>(path, { method: 'DELETE' }),
};

export interface LoginResponse {
  accessToken: string;
  user: { id: string; email: string; name?: string };
}

export interface RegisterResponse {
  accessToken: string;
  user: { id: string; email: string; name?: string };
}

export const authApi = {
  login: (email: string, password: string) =>
    api.post<LoginResponse>('/auth/login', { email, password }),
  register: (email: string, password: string, name: string, inviteCode: string) =>
    api.post<RegisterResponse>('/auth/register', { email, password, name, inviteCode }),
};
