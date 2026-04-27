'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import { getToken, getUser, setToken, setUser, clearAuth, logout as authLibLogout, type StoredUser } from '@/lib/auth';

// ─── Types ─────────────────────────────────────────────────────────────────

export interface AuthState {
  /** Whether auth state has been determined on mount */
  isReady: boolean;
  /** Currently-authenticated user, or null */
  user: StoredUser | null;
  /** JWT token string, or null */
  token: string | null;
  /** True while a login/signup request is in flight */
  loading: boolean;
  /** The last error message, if any */
  error: string | null;
}

export interface AuthContextValue extends AuthState {
  /** Exchange email+password for a JWT */
  login: (email: string, password: string) => Promise<void>;
  /** Create an account with invite code */
  signup: (email: string, password: string, inviteCode: string, name?: string) => Promise<void>;
  /** Clear auth state and call /api/auth/logout */
  logout: () => Promise<void>;
  /** Clear any error message */
  clearError: () => void;
}

// ─── Context ───────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

// ─── Provider ──────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();

  const [state, setState] = useState<AuthState>({
    isReady: false,
    user: null,
    token: null,
    loading: false,
    error: null,
  });

  // Hydrate from localStorage on mount
  useEffect(() => {
    const token = getToken();
    const user = getUser();
    setState((prev) => ({
      ...prev,
      isReady: true,
      token,
      user,
    }));
  }, []);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  // ── login ──────────────────────────────────────────────────────────────
  const login = useCallback(
    async (email: string, password: string) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
          credentials: 'include',
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok || !data.accessToken) {
          throw new Error(data.message || 'Invalid email or password');
        }

        setToken(data.accessToken);
        if (data.user) setUser(data.user);

        setState((prev) => ({
          ...prev,
          token: data.accessToken,
          user: data.user || null,
          loading: false,
          error: null,
        }));

        router.push('/dashboard');
      } catch (err: any) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: err.message || 'Login failed',
        }));
      }
    },
    [router],
  );

  // ── signup ─────────────────────────────────────────────────────────────
  const signup = useCallback(
    async (email: string, password: string, inviteCode: string, name?: string) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      try {
        const body: Record<string, string> = { email, password, inviteCode };
        if (name?.trim()) body.name = name.trim();

        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
          credentials: 'include',
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok || !data.accessToken) {
          throw new Error(data.message || 'Registration failed. Check your invite code.');
        }

        setToken(data.accessToken);
        if (data.user) setUser(data.user);

        setState((prev) => ({
          ...prev,
          token: data.accessToken,
          user: data.user || null,
          loading: false,
          error: null,
        }));

        router.push('/dashboard');
      } catch (err: any) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: err.message || 'Registration failed',
        }));
      }
    },
    [router],
  );

  // ── logout ─────────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    } catch {
      // Best-effort — we clear locally regardless
    }
    clearAuth();
    setState({ isReady: true, user: null, token: null, loading: false, error: null });
    router.push('/');
  }, [router]);

  const value: AuthContextValue = {
    ...state,
    login,
    signup,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}