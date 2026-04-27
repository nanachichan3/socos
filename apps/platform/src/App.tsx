import { useState, useEffect } from 'react';
import { isAuthenticated, clearToken, getUser, type AuthUser } from './lib/auth.js';
import Login from './pages/Login.js';
import Signup from './pages/Signup.js';
import Dashboard from './pages/Dashboard.js';

type View = 'login' | 'signup' | 'dashboard';

function App() {
  const [view, setView] = useState<View>('login');
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // Check auth status on mount
    if (isAuthenticated()) {
      setView('dashboard');
    }
    setChecked(true);
  }, []);

  function handleLoginSuccess() {
    setView('dashboard');
  }

  function handleLogout() {
    clearToken();
    setView('login');
  }

  function switchToSignup() {
    setView('signup');
  }

  function switchToLogin() {
    setView('login');
  }

  // Prevent flash of content before auth check
  if (!checked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="text-slate-500">Loading…</div>
      </div>
    );
  }

  // Authenticated → dashboard
  if (view === 'dashboard') {
    return <Dashboard onLogout={handleLogout} />;
  }

  // Unauthenticated → login or signup
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-slate-950">
      <div className="flex flex-col items-center gap-8 max-w-2xl text-center w-full">
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

        {/* Auth Form */}
        {view === 'login' ? (
          <Login onSuccess={handleLoginSuccess} onSwitch={switchToSignup} />
        ) : (
          <Signup onSuccess={handleLoginSuccess} onSwitch={switchToLogin} />
        )}

        {/* Quick Links */}
        <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
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
            target="_blank"
            rel="noopener noreferrer"
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
      </div>
    </main>
  );
}

export default App;
