/**
 * NextAuth Route Handler - Stub
 *
 * SOCOS now uses JWT auth via localStorage instead of NextAuth sessions.
 * This route handler is kept as a stub to prevent 404s on NextAuth URLs.
 * All auth flows:
 *   - Login:  POST /api/auth/login  → NestJS /auth/login
 *   - Signup: POST /api/auth/register → NestJS /auth/register
 *   - Token stored in localStorage by login/signup pages
 *   - Dashboard reads token via getToken() helper
 *   - API calls include Authorization: Bearer <token> header
 */
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ error: 'Not implemented' }, { status: 404 });
}

export async function POST() {
  return NextResponse.json({ error: 'Not implemented' }, { status: 404 });
}
