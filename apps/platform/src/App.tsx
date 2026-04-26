import { getSharedMessage } from '@socos/shared';

/**
 * SOCOS Platform — Desktop Admin View
 * 
 * This is the React + Vite desktop application for SOCOS CRM.
 * The main dashboard and user features are in @socos/web (Next.js).
 * This platform app provides admin/advanced features.
 * 
 * TODO (Phase 2): Implement platform-specific features:
 * - Admin dashboard with user management
 * - Bulk contact operations
 * - Export/import functionality  
 * - Team management (vaults & sharing)
 * - Analytics & insights visualization
 */

function App() {
  const sharedMessage = getSharedMessage();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-slate-950">
      <div className="flex flex-col items-center gap-8 max-w-2xl text-center">
        {/* SOCOS Branding */}
        <div className="flex flex-col items-center gap-4">
          <div className="text-6xl">🎮</div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            SOCOS
          </h1>
          <p className="text-xl text-slate-400">
            Social Operating System — Gamified, Agent-First CRM
          </p>
        </div>

        {/* Status Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 w-full space-y-6">
          <div className="flex items-center gap-3 text-slate-300">
            <span className="text-2xl">⚡</span>
            <span className="text-lg font-medium">Platform Status: In Development</span>
          </div>

          <div className="space-y-3 text-left">
            <div className="flex items-center gap-3">
              <span className="text-emerald-400">✓</span>
              <span className="text-slate-300">Backend API running (NestJS + Prisma)</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-emerald-400">✓</span>
              <span className="text-slate-300">Web app operational (Next.js dashboard)</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-amber-400">◐</span>
              <span className="text-slate-300">Platform app — Phase 2 implementation</span>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-6 space-y-3">
            <p className="text-slate-500 text-sm">
              {sharedMessage}
            </p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 gap-4 w-full">
          <a 
            href="http://localhost:3000" 
            className="bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg p-4 text-left transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">📱</span>
              <div>
                <div className="font-medium text-slate-200">Web App</div>
                <div className="text-sm text-slate-400">Main dashboard (port 3000)</div>
              </div>
            </div>
          </a>
          <a 
            href="http://localhost:3001/api" 
            className="bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg p-4 text-left transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">🔧</span>
              <div>
                <div className="font-medium text-slate-200">API Docs</div>
                <div className="text-sm text-slate-400">Swagger (port 3001)</div>
              </div>
            </div>
          </a>
        </div>

        {/* Phase 2 Features Preview */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6 w-full">
          <h3 className="text-lg font-medium text-slate-300 mb-4">Platform Features (Phase 2)</h3>
          <div className="grid grid-cols-3 gap-4 text-sm text-slate-400">
            <div className="flex flex-col items-center gap-2 p-3">
              <span className="text-2xl">👥</span>
              <span>User Management</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-3">
              <span className="text-2xl">📊</span>
              <span>Analytics</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-3">
              <span className="text-2xl">💾</span>
              <span>Export/Import</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-3">
              <span className="text-2xl">🏘️</span>
              <span>Team Vaults</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-3">
              <span className="text-2xl">🤖</span>
              <span>AI Agent Config</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-3">
              <span className="text-2xl">🔔</span>
              <span>Notifications</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default App;
