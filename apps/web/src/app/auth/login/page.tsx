'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { setToken, setUser } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // Call Next.js API route → NestJS + set httpOnly cookie
      const res = await fetch(`/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.accessToken) {
        throw new Error(data.message || 'Invalid email or password');
      }

      // Store token in localStorage for client-side auth checks
      // httpOnly cookie is set server-side by /api/auth/login route
      setToken(data.accessToken);
      setUser(data.user);

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-surface-container-low border border-outline-variant/10 rounded-2xl p-8">
      <h2
        className="text-xl font-bold mb-6 text-on-surface"
        style={{ fontFamily: 'Manrope' }}
      >
        Welcome back
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-3 rounded-xl bg-surface-container-high border border-outline-variant/10 text-on-surface placeholder-on-surface-variant/50 focus:outline-none focus:border-primary transition-colors"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-4 py-3 rounded-xl bg-surface-container-high border border-outline-variant/10 text-on-surface placeholder-on-surface-variant/50 focus:outline-none focus:border-primary transition-colors"
        />

        {error && (
          <div className="px-4 py-3 rounded-xl bg-error-container text-error text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-primary-container text-on-primary font-bold text-base hover:brightness-110 transition-all active:scale-[0.98] disabled:opacity-60"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <p className="text-center mt-5 text-sm text-on-surface-variant">
        Don&apos;t have an account?{' '}
        <Link
          href="/auth/signup"
          className="text-primary font-semibold hover:underline"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
