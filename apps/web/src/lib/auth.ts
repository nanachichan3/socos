/**
 * SOCOS Auth Utility
 *
 * Manages JWT token storage with httpOnly cookies for enhanced security.
 *
 * Token storage strategy:
 * - httpOnly cookie ("socos_token"): Used for server-side API calls; inaccessible to XSS
 * - localStorage ("socos_token"): Fallback/client-side token for auth state checks
 * - localStorage ("socos_user"): User profile data for UI
 *
 * Flow:
 * - Login: POST /api/auth/login → NestJS → set httpOnly cookie + store token in localStorage
 * - Signup: POST /api/auth/register → NestJS → set httpOnly cookie + store token in localStorage
 * - API calls: authFetch() uses httpOnly cookie via credentials: 'include'
 * - Auth checks: getToken() reads localStorage for client-side guards (dashboard redirect)
 * - Logout: clearAuth() → clears both cookies + localStorage
 */

const TOKEN_KEY = 'socos_token';
const USER_KEY = 'socos_user';
const COOKIE_NAME = 'socos_token';

export interface StoredUser {
  id: string;
  email: string;
  name: string | null;
  xp: number;
  level: number;
}

/**
 * Read token from localStorage (client-side auth checks).
 * For server-side / API calls, use authFetch() which uses the httpOnly cookie.
 */
export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
}

export function setUser(user: StoredUser): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getUser(): StoredUser | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredUser;
  } catch {
    return null;
  }
}

export function clearAuth(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

/**
 * API fetch wrapper that uses the httpOnly cookie for auth.
 * Automatically sets Authorization header if localStorage token is available.
 */
export async function authFetch(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  // Add Bearer token if available (for APIs that need it in Authorization header)
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return fetch(path, {
    ...options,
    headers,
    credentials: 'include', // Send httpOnly cookie on same-origin requests
  });
}

/**
 * Call logout API and clear all auth state.
 */
export async function logout(): Promise<void> {
  try {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
  } catch {
    // Best-effort logout
  } finally {
    clearAuth();
  }
}
