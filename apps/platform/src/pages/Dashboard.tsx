import { getUser, clearToken, type AuthUser } from '../lib/auth.js';
import { api } from '../lib/api.js';

interface Props {
  onLogout: () => void;
}

export default function Dashboard({ onLogout }: Props) {
  const user = getUser();

  return (
    <div className="flex min-h-screen flex-col items-center p-24 bg-slate-950">
      <div className="w-full max-w-2xl space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-4xl">🎮</span>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                SOCOS
              </h1>
              <p className="text-sm text-slate-500">Platform Console</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
          >
            Sign out
          </button>
        </div>

        {/* User Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-2xl">
              {user?.name?.[0]?.toUpperCase() || '?'}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-100">{user?.name || 'Unknown'}</h2>
              <p className="text-sm text-slate-500">{user?.email}</p>
            </div>
          </div>
          <div className="text-xs text-slate-600 font-mono">
            User ID: {user?.id || '—'}
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 gap-4">
          <a
            href="http://localhost:3000"
            className="bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl p-6 text-left transition-colors group"
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">📱</span>
              <span className="font-semibold text-slate-200 group-hover:text-white transition-colors">Web Dashboard</span>
            </div>
            <p className="text-sm text-slate-500">Main app · Contacts · Gamification</p>
          </a>
          <a
            href="http://localhost:3001/api"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl p-6 text-left transition-colors group"
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">🔧</span>
              <span className="font-semibold text-slate-200 group-hover:text-white transition-colors">API Docs</span>
            </div>
            <p className="text-sm text-slate-500">Swagger · NestJS · Auth endpoints</p>
          </a>
        </div>

        {/* Status */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-base font-medium text-slate-300 mb-4">System Status</h3>
          <div className="space-y-3">
            {[
              ['✅', 'Backend API', 'http://localhost:3001'],
              ['✅', 'Auth System', 'JWT + bcrypt'],
              ['✅', 'Database', 'PostgreSQL + Prisma'],
              ['⏳', 'Web App', 'http://localhost:3000'],
            ].map(([icon, label, detail]) => (
              <div key={label as string} className="flex items-center gap-3">
                <span>{icon as string}</span>
                <span className="text-slate-300 font-medium">{label as string}</span>
                <span className="text-slate-600 text-sm ml-auto">{detail as string}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
