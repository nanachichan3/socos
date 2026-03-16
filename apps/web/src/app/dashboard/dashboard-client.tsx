'use client';

import { useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  xp: number;
  level: number;
}

interface Contact {
  id: string;
  firstName: string;
  lastName: string | null;
  photo: string | null;
  company: string | null;
  jobTitle: string | null;
  labels: string[];
  lastContactedAt: string | null;
  relationshipScore: number;
}

interface Reminder {
  id: string;
  title: string;
  type: string;
  scheduledAt: string;
  contact: {
    firstName: string;
    lastName: string | null;
  };
}

export default function DashboardClient() {
  const [user, setUser] = useState<User | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('socos_token');
    if (savedToken) {
      setToken(savedToken);
      fetchData(savedToken);
    } else {
      setLoading(false);
    }
  }, []);

  async function fetchData(authToken: string) {
    try {
      const headers = { Authorization: `Bearer ${authToken}` };
      
      const [userRes, contactsRes, remindersRes] = await Promise.all([
        fetch('/api/gamification/stats', { headers }),
        fetch('/api/contacts?limit=10', { headers }),
        fetch('/api/reminders/upcoming', { headers }),
      ]);

      if (userRes.ok) {
        const userData = await userRes.json();
        setUser(userData.user);
      }
      
      if (contactsRes.ok) {
        const contactsData = await contactsRes.json();
        setContacts(contactsData.contacts || []);
      }
      
      if (remindersRes.ok) {
        const remindersData = await remindersRes.json();
        setReminders(remindersData.reminders || []);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin(email: string, password: string) {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      const data = await res.json();
      localStorage.setItem('socos_token', data.accessToken);
      setToken(data.accessToken);
      fetchData(data.accessToken);
    } else {
      alert('Login failed');
    }
  }

  async function handleRegister(name: string, email: string, password: string) {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    if (res.ok) {
      handleLogin(email, password);
    } else {
      alert('Registration failed');
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }

  if (!token) {
    return <AuthForm onLogin={handleLogin} onRegister={handleRegister} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-purple-600">SOCOS</h1>
          <div className="flex items-center gap-4">
            {user && (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="font-medium">{user.name}</div>
                  <div className="text-sm text-gray-500">Level {user.level} • {user.xp} XP</div>
                </div>
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
              </div>
            )}
            <button
              onClick={() => {
                localStorage.removeItem('socos_token');
                setToken(null);
                setUser(null);
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard label="Total Contacts" value={contacts.length} icon="👥" />
          <StatCard label="Your Level" value={user?.level || 1} icon="⭐" />
          <StatCard label="Total XP" value={user?.xp || 0} icon="🎯" />
          <StatCard label="Upcoming Reminders" value={reminders.length} icon="🔔" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contacts List */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Recent Contacts</h2>
              <button className="text-purple-600 hover:text-purple-700 font-medium">
                + Add Contact
              </button>
            </div>
            <div className="space-y-3">
              {contacts.slice(0, 5).map((contact) => (
                <div key={contact.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    {contact.firstName.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">
                      {contact.firstName} {contact.lastName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {contact.jobTitle || contact.company || 'No title'}
                    </div>
                  </div>
                  <div className="text-sm text-gray-400">
                    {contact.relationshipScore}%
                  </div>
                </div>
              ))}
              {contacts.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No contacts yet. Add your first contact!
                </div>
              )}
            </div>
          </div>

          {/* Upcoming Reminders */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4">Upcoming Reminders</h2>
            <div className="space-y-3">
              {reminders.slice(0, 5).map((reminder) => (
                <div key={reminder.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    🔔
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{reminder.title}</div>
                    <div className="text-sm text-gray-500">
                      {reminder.contact.firstName} {reminder.contact.lastName}
                    </div>
                  </div>
                  <div className="text-sm text-gray-400">
                    {new Date(reminder.scheduledAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
              {reminders.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No upcoming reminders
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: number | string; icon: string }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center gap-3">
        <div className="text-2xl">{icon}</div>
        <div>
          <div className="text-2xl font-bold">{value}</div>
          <div className="text-sm text-gray-500">{label}</div>
        </div>
      </div>
    </div>
  );
}

function AuthForm({ onLogin, onRegister }: { onLogin: (e: string, p: string) => void; onRegister: (n: string, e: string, p: string) => void }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      onLogin(email, password);
    } else {
      onRegister(name, email, password);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-sm p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Welcome to SOCOS</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-purple-500 focus:outline-none"
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-purple-500 focus:outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-purple-500 focus:outline-none"
          />
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition"
          >
            {isLogin ? 'Login' : 'Create Account'}
          </button>
        </form>
        <p className="text-center mt-4 text-gray-500">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
          <button onClick={() => setIsLogin(!isLogin)} className="text-purple-600 font-medium">
            {isLogin ? 'Sign up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
}
