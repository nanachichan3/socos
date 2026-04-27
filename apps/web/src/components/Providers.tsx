'use client';

// No-op providers component since auth is handled via localStorage.
// Kept as a placeholder for future providers (analytics, etc.)
export default function Providers({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
