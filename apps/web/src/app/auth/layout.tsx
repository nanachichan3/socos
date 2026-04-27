import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Auth - SOCOS',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/">
            <h1
              className="text-3xl font-black tracking-tighter text-primary mb-1"
              style={{ fontFamily: 'Manrope, sans-serif' }}
            >
              SOCOS
            </h1>
          </Link>
          <p className="text-sm text-on-surface-variant">Your relationships, leveled up.</p>
        </div>
        {children}
        <p className="text-center mt-6 text-xs text-on-surface-variant/40 uppercase tracking-widest">
          Privacy-first &bull; Open Source &bull; Agent Powered
        </p>
      </div>
    </div>
  );
}
