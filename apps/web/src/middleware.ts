import { NextResponse } from 'next/server';

// Middleware is now a no-op since auth is handled client-side via localStorage.
// DashboardClient checks for token presence and redirects if missing.
export function middleware() {
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
