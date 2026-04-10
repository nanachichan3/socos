'use client';

import { useState, useEffect, useCallback } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────

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
  birthday: string | null;
  email: string | null;
  phone: string | null;
}

interface Reminder {
  id: string;
  title: string;
  type: string;
  scheduledAt: string;
  contact: { id: string; firstName: string; lastName: string | null };
}

interface Stats {
  totalContacts: number;
  totalInteractions: number;
  xpProgress: number;
  xpNeeded: number;
  levelName: string;
}

interface NewContactForm {
  firstName: string;
  lastName: string;
  company: string;
  jobTitle: string;
  labels: string;
  email: string;
  phone: string;
  birthday: string;
}

// ─── API Helpers ─────────────────────────────────────────────────────────────

async function apiFetch(path: string, token: string, opts: RequestInit = {}) {
  const res = await fetch(path, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...opts.headers,
    },
  });
  if (!res.ok) throw new Error(`${path} → ${res.status}`);
  return res.json();
}

// ─── SVG Icons ───────────────────────────────────────────────────────────────

function Icon({ name, filled, className = '' }: { name: string; filled?: boolean; className?: string }) {
  const icons: Record<string, string> = {
    dashboard: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
    group: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
    calendar: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
    military_tech: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z',
    settings: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
    lightbulb: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
    alarm: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9',
    smart_toy: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
    search: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
    add: 'M12 4v16m8-8H4',
    check: 'M5 13l4 4L19 7',
    chevron_right: 'M9 5l7 7-7 7',
    star: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z',
    cake: 'M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-9-9a3 3 0 110 6 3 3 0 010-6z',
    forum: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
    call: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z',
    local_fire_department: 'M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z',
    priority_high: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
    schedule: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
    edit: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
    logout: 'M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1',
    psychology: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
    notification_important: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9',
    favorite: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
    workspace_premium: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z',
    auto_awesome: 'M13 10V3L4 14h7v7l9-11h-7z',
    bolt: 'M13 10V3L4 14h7v7l9-11h-7z',
  };
  return (
    <svg className={`inline-block w-5 h-5${filled ? ' fill-current' : ''} ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d={icons[name] || icons.star} />
    </svg>
  );
}

// ─── Circular Health Score ───────────────────────────────────────────────────

function HealthScore({ score }: { score: number }) {
  const r = 18;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - score / 100);
  const color = score >= 70 ? '#4edea3' : score >= 40 ? '#ffb95f' : '#ffb4ab';

  return (
    <div className="relative w-10 h-10 flex-shrink-0">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 44 44">
        <circle cx="22" cy="22" r={r} fill="transparent" stroke="#2d3449" strokeWidth="4" />
        <circle
          cx="22" cy="22" r={r} fill="transparent"
          stroke={color} strokeWidth="4"
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 4px ${color}80)` }}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold" style={{ color }}>
        {score}
      </span>
    </div>
  );
}

// ─── XP Progress Bar ─────────────────────────────────────────────────────────

function XpBar({ xp, level, xpProgress, xpNeeded }: { xp: number; level: number; xpProgress: number; xpNeeded: number }) {
  const pct = xpNeeded > 0 ? Math.min((xpProgress / xpNeeded) * 100, 100) : 0;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
        <span className="text-secondary">Level {level}</span>
        <span className="text-on-surface-variant">{xpProgress} / {xpNeeded} XP</span>
      </div>
      <div className="w-full h-1 bg-surface-container-highest rounded-full overflow-hidden">
        <div
          className="h-full bg-secondary rounded-full xp-bar-glow transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ─── Auth Form ───────────────────────────────────────────────────────────────

function AuthForm({ onLogin }: { onLogin: (token: string) => void }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('yev.rachkovan@gmail.com');
  const [password, setPassword] = useState('socos2026');
  const [name, setName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      let body: Record<string, string>;
      if (isLogin) {
        body = { email, password };
      } else {
        if (!inviteCode.trim()) {
          throw new Error('Invite code is required to create an account');
        }
        body = { email, password, name, inviteCode };
      }
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.message || 'Login failed');
      }
      const data = await res.json();
      localStorage.setItem('socos_token', data.accessToken);
      onLogin(data.accessToken);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black tracking-tighter text-primary mb-1" style={{ fontFamily: 'Manrope, sans-serif' }}>
            SOCOS
          </h1>
          <p className="text-sm text-on-surface-variant">Your relationships, leveled up.</p>
        </div>

        {/* Card */}
        <div className="bg-surface-container-low border border-outline-variant/10 rounded-2xl p-8">
          <h2 className="text-xl font-bold mb-6" style={{ fontFamily: 'Manrope' }}>
            {isLogin ? 'Welcome back' : 'Create your account'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <input
                type="text" placeholder="Your name" value={name}
                onChange={e => setName(e.target.value)} required
                className="w-full px-4 py-3 rounded-xl bg-surface-container-high border border-outline-variant/10 text-on-surface placeholder-on-surface-variant/50 focus:outline-none focus:border-primary transition-colors"
              />
            )}
            {!isLogin && (
              <div className="relative">
                <input
                  type="text" placeholder="Invite code" value={inviteCode}
                  onChange={e => setInviteCode(e.target.value)} required
                  className="w-full px-4 py-3 rounded-xl bg-surface-container-high border border-outline-variant/10 text-on-surface placeholder-on-surface-variant/50 focus:outline-none focus:border-tertiary transition-colors"
                />
                <p className="mt-1 text-[10px] text-tertiary/70">Ask Yev for an invite code to create an account</p>
              </div>
            )}
            <input
              type="email" placeholder="Email address" value={email}
              onChange={e => setEmail(e.target.value)} required
              className="w-full px-4 py-3 rounded-xl bg-surface-container-high border border-outline-variant/10 text-on-surface placeholder-on-surface-variant/50 focus:outline-none focus:border-primary transition-colors"
            />
            <input
              type="password" placeholder="Password" value={password}
              onChange={e => setPassword(e.target.value)} required
              className="w-full px-4 py-3 rounded-xl bg-surface-container-high border border-outline-variant/10 text-on-surface placeholder-on-surface-variant/50 focus:outline-none focus:border-primary transition-colors"
            />

            {error && (
              <div className="px-4 py-2 rounded-lg bg-error-container text-error text-sm">
                {error}
              </div>
            )}

            <button
              type="submit" disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-primary-container text-on-primary font-bold text-base hover:brightness-110 transition-all active:scale-[0.98] disabled:opacity-60"
            >
              {loading ? 'Signing in...' : isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <p className="text-center mt-5 text-sm text-on-surface-variant">
            {isLogin ? "Don't have an account?" : 'Already have one?'}{' '}
            <button onClick={() => setIsLogin(!isLogin)} className="text-primary font-semibold hover:underline">
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>

        <p className="text-center mt-4 text-xs text-on-surface-variant/40 uppercase tracking-widest">
          Privacy-first • Open Source • Agent Powered
        </p>
      </div>
    </div>
  );
}

// ─── Contact Card ────────────────────────────────────────────────────────────

interface ContactCardProps {
  contact: Contact;
  onClick?: () => void;
  onCall?: (contact: Contact) => void;
  onMessage?: (contact: Contact) => void;
  onReminder?: (contact: Contact) => void;
}

function ContactCard({ contact, onClick, onCall, onMessage, onReminder }: ContactCardProps) {
  const initials = `${contact.firstName[0]}${contact.lastName?.[0] || ''}`.toUpperCase();
  const labelColor: Record<string, string> = {
    'Student Network': 'bg-primary/10 text-primary',
    'Monica Migration': 'bg-secondary/10 text-secondary',
  };

  return (
    <div
      className="group relative bg-surface-container-low hover:bg-surface-container-high transition-all p-5 rounded-xl border border-transparent hover:border-outline-variant/10"
    >
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-xl bg-surface-container-highest flex items-center justify-center text-primary font-bold text-sm flex-shrink-0 overflow-hidden">
          {contact.photo
            ? <img src={contact.photo} alt="" className="w-full h-full object-cover" />
            : initials
          }
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-bold text-on-surface truncate">
              {contact.firstName} {contact.lastName || ''}
            </h3>
            <HealthScore score={contact.relationshipScore} />
          </div>
          <p className="text-xs text-on-surface-variant truncate">
            {contact.jobTitle || contact.company || 'No details yet'}
          </p>
          <div className="flex gap-1 mt-1 flex-wrap">
            {contact.labels.slice(0, 2).map(label => (
              <span key={label} className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${labelColor[label] || 'bg-surface-container-high text-on-surface-variant'}`}>
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* Last contact */}
        <div className="text-right hidden md:block flex-shrink-0">
          <p className="text-[10px] text-on-surface-variant">Last contact</p>
          <p className="text-xs font-medium text-on-surface">
            {contact.lastContactedAt
              ? new Date(contact.lastContactedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
              : 'Never'}
          </p>
        </div>
      </div>

      {/* Hover quick actions */}
      <div className="absolute right-5 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
        <button 
          onClick={(e) => { e.stopPropagation(); onCall?.(contact); }}
          className="p-2 bg-surface-bright rounded-lg text-primary hover:bg-primary hover:text-on-primary transition-colors" 
          title="Call"
        >
          <Icon name="call" className="w-4 h-4" />
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); onMessage?.(contact); }}
          className="p-2 bg-surface-bright rounded-lg text-primary hover:bg-primary hover:text-on-primary transition-colors" 
          title="Message"
        >
          <Icon name="forum" className="w-4 h-4" />
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); onReminder?.(contact); }}
          className="p-2 bg-surface-bright rounded-lg text-primary hover:bg-primary hover:text-on-primary transition-colors" 
          title="Reminder"
        >
          <Icon name="alarm" className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ─── Reminder Item ───────────────────────────────────────────────────────────

function ReminderItem({ reminder }: { reminder: Reminder }) {
  const typeColors: Record<string, string> = {
    birthday: 'text-tertiary',
    follow_up: 'text-primary',
    meeting: 'text-secondary',
  };
  const iconNames: Record<string, string> = {
    birthday: 'cake',
    follow_up: 'schedule',
    meeting: 'calendar',
  };

  const daysUntil = Math.ceil((new Date(reminder.scheduledAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  return (
    <div className="flex items-start gap-3 p-3 bg-surface-container-lowest rounded-lg">
      <div className={`flex-shrink-0 w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center ${typeColors[reminder.type] || 'text-on-surface-variant'}`}>
        <Icon name={iconNames[reminder.type] || 'alarm'} className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-on-surface truncate">{reminder.title}</p>
        <p className="text-[11px] text-on-surface-variant">
          {reminder.contact.firstName} {reminder.contact.lastName}
        </p>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
          {daysUntil === 0 ? 'Today' : daysUntil === 1 ? 'Tomorrow' : `${daysUntil}d`}
        </p>
      </div>
    </div>
  );
}

// ─── Add Contact Modal ───────────────────────────────────────────────────────

interface AddContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (contact: Contact) => void;
  token: string;
}

function AddContactModal({ isOpen, onClose, onSuccess, token }: AddContactModalProps) {
  const [form, setForm] = useState<NewContactForm>({
    firstName: '',
    lastName: '',
    company: '',
    jobTitle: '',
    labels: '',
    email: '',
    phone: '',
    birthday: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName.trim()) {
      setError('First name is required');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const payload: any = {
        firstName: form.firstName,
        lastName: form.lastName || undefined,
        company: form.company || undefined,
        jobTitle: form.jobTitle || undefined,
        labels: form.labels ? form.labels.split(',').map(l => l.trim()).filter(Boolean) : [],
      };
      if (form.birthday) {
        payload.birthday = form.birthday;
      }
      const res = await apiFetch('/api/contacts', token, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      onSuccess(res);
      onClose();
      setForm({ firstName: '', lastName: '', company: '', jobTitle: '', labels: '', email: '', phone: '', birthday: '' });
    } catch (err: any) {
      setError(err.message || 'Failed to create contact');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-surface border border-outline-variant/10 rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold" style={{ fontFamily: 'Manrope' }}>Add New Contact</h2>
          <button onClick={onClose} className="p-2 hover:bg-surface-container-high rounded-lg transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1">First Name *</label>
              <input
                type="text"
                value={form.firstName}
                onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg bg-surface-container-high border border-outline-variant/10 text-sm text-on-surface focus:outline-none focus:border-primary"
                placeholder="John"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1">Last Name</label>
              <input
                type="text"
                value={form.lastName}
                onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg bg-surface-container-high border border-outline-variant/10 text-sm text-on-surface focus:outline-none focus:border-primary"
                placeholder="Doe"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1">Company</label>
            <input
              type="text"
              value={form.company}
              onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg bg-surface-container-high border border-outline-variant/10 text-sm text-on-surface focus:outline-none focus:border-primary"
              placeholder="Acme Inc"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1">Job Title</label>
            <input
              type="text"
              value={form.jobTitle}
              onChange={e => setForm(f => ({ ...f, jobTitle: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg bg-surface-container-high border border-outline-variant/10 text-sm text-on-surface focus:outline-none focus:border-primary"
              placeholder="CEO"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1">Labels (comma-separated)</label>
            <input
              type="text"
              value={form.labels}
              onChange={e => setForm(f => ({ ...f, labels: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg bg-surface-container-high border border-outline-variant/10 text-sm text-on-surface focus:outline-none focus:border-primary"
              placeholder="Friend, Networking"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1">Birthday</label>
            <input
              type="date"
              value={form.birthday}
              onChange={e => setForm(f => ({ ...f, birthday: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg bg-surface-container-high border border-outline-variant/10 text-sm text-on-surface focus:outline-none focus:border-primary"
            />
          </div>
          {error && (
            <div className="px-3 py-2 rounded-lg bg-error-container text-error text-sm">{error}</div>
          )}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 rounded-lg border border-outline-variant/10 text-sm font-semibold text-on-surface-variant hover:bg-surface-container-high transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 rounded-lg bg-gradient-to-r from-primary to-primary-container text-on-primary text-sm font-bold hover:brightness-110 transition-all disabled:opacity-60"
            >
              {loading ? 'Creating...' : 'Create Contact'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Toast Notification ───────────────────────────────────────────────────────

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const colors = {
    success: 'bg-secondary text-on-secondary',
    error: 'bg-error text-on-error',
    info: 'bg-primary text-on-primary',
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-lg ${colors[type]} font-medium text-sm animate-fade-in`}>
      {message}
    </div>
  );
}

// ─── Dashboard ───────────────────────────────────────────────────────────────

function Dashboard({ token, onLogout }: { token: string; onLogout: () => void }) {
  const [user, setUser] = useState<User | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
  };

  const handleContactCreated = (contact: Contact) => {
    setContacts(prev => [contact, ...prev]);
    showToast(`Contact "${contact.firstName}" created!`, 'success');
    fetchAll();
  };

  const handleCall = async (contact: Contact) => {
    showToast(`Calling ${contact.firstName}...`, 'info');
    try {
      console.log('[SOCOS] handleCall: contacting', contact.firstName, 'ID:', contact.id);
      await apiFetch('/api/interactions', token, {
        method: 'POST',
        body: JSON.stringify({ 
          contactId: contact.id,
          type: 'call',
          title: `Call with ${contact.firstName}` 
        }),
      });
      console.log('[SOCOS] handleCall: success for', contact.firstName);
      showToast('Call logged!', 'success');
      fetchAll();
    } catch (err) {
      console.error('[SOCOS] handleCall error:', err);
      showToast('Could not log call', 'error');
    }
  };

  const handleMessage = async (contact: Contact) => {
    showToast(`Opening message for ${contact.firstName}...`, 'info');
    try {
      console.log('[SOCOS] handleMessage: contacting', contact.firstName, 'ID:', contact.id);
      await apiFetch('/api/interactions', token, {
        method: 'POST',
        body: JSON.stringify({ 
          contactId: contact.id,
          type: 'message',
          title: `Message to ${contact.firstName}` 
        }),
      });
      console.log('[SOCOS] handleMessage: success for', contact.firstName);
      showToast('Message logged!', 'success');
      fetchAll();
    } catch (err) {
      console.error('[SOCOS] handleMessage error:', err);
      showToast('Could not log message', 'error');
    }
  };

  const handleReminder = async (contact: Contact) => {
    showToast(`Creating reminder for ${contact.firstName}...`, 'info');
    try {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      console.log('[SOCOS] handleReminder: creating for', contact.firstName, 'ID:', contact.id);
      await apiFetch('/api/reminders', token, {
        method: 'POST',
        body: JSON.stringify({
          contactId: contact.id,
          title: `Check in with ${contact.firstName}`,
          type: 'followup',
          scheduledAt: tomorrow.toISOString(),
        }),
      });
      console.log('[SOCOS] handleReminder: success for', contact.firstName);
      showToast('Reminder created!', 'success');
      fetchAll();
    } catch (err) {
      console.error('[SOCOS] handleReminder error:', err);
      showToast('Could not create reminder', 'error');
    }
  };

  const fetchAll = useCallback(async () => {
    try {
      const [statsData, contactsData, remindersData] = await Promise.all([
        apiFetch('/api/gamification/stats', token).catch(() => null),
        apiFetch('/api/contacts?limit=50', token).catch(() => null),
        apiFetch('/api/reminders/upcoming', token).catch(() => null),
      ]);
      if (statsData?.user) setUser(statsData.user);
      if (statsData?.stats) setStats(statsData.stats);
      if (contactsData?.contacts) setContacts(contactsData.contacts);
      if (remindersData?.reminders) setReminders(remindersData.reminders);
    } catch (e) {
      console.error('fetch error', e);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const filteredContacts = contacts.filter(c => {
    const q = searchQuery.toLowerCase();
    const matchQ = !q || `${c.firstName} ${c.lastName || ''} ${c.company || ''}`.toLowerCase().includes(q);
    const matchF = activeFilter === 'All' || c.labels.includes(activeFilter);
    return matchQ && matchF;
  });

  const levelName = stats?.levelName || 'Newcomer';
  const xpProgress = stats?.xpProgress ?? 0;
  const xpNeeded = stats?.xpNeeded ?? 100;

  const allLabels = Array.from(new Set(contacts.flatMap(c => c.labels))).slice(0, 5);

  return (
    <div className="flex h-screen bg-surface overflow-hidden">
      {/* ── Sidebar ─────────────────────────────────────────────── */}
      <aside className="w-64 flex-shrink-0 bg-surface border-r border-outline-variant/10 flex flex-col py-6">
        {/* Logo */}
        <div className="px-6 mb-8">
          <div className="text-xl font-black tracking-tighter text-primary" style={{ fontFamily: 'Manrope' }}>SOCOS</div>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 px-3">
          {[
            { icon: 'dashboard', label: 'Dashboard', active: true },
            { icon: 'group', label: 'Contacts', active: false },
            { icon: 'calendar', label: 'Calendar', active: false, phase2: true },
            { icon: 'military_tech', label: 'Gamification', active: false, phase2: true },
            { icon: 'settings', label: 'Settings', active: false, phase2: true },
          ].map(item => (
            <button
              key={item.label}
              onClick={() => {
                if (item.phase2) {
                  showToast(`${item.label} coming in Phase 2`, 'info');
                }
              }}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all ${
                item.active
                  ? 'bg-gradient-to-r from-primary to-primary-container text-on-primary'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
              }`}
            >
              <Icon name={item.icon} className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>

        {/* User profile */}
        <div className="mt-auto px-4 pt-4 border-t border-outline-variant/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-surface-container-high flex items-center justify-center text-primary font-bold text-sm overflow-hidden">
              {user?.name?.[0]?.toUpperCase() || '?'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm text-on-surface truncate">{user?.name || 'Loading...'}</p>
              <p className="text-[10px] text-on-surface-variant">Level {user?.level || 1} • {levelName}</p>
            </div>
          </div>

          <XpBar xp={user?.xp || 0} level={user?.level || 1} xpProgress={xpProgress} xpNeeded={xpNeeded} />

          <button
            onClick={onLogout}
            className="mt-3 w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold text-on-surface-variant hover:text-error hover:bg-surface-container-high transition-all"
          >
            <Icon name="logout" className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main Content ─────────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto hide-scrollbar p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-on-surface" style={{ fontFamily: 'Manrope' }}>
              Dashboard
            </h1>
            <p className="text-sm text-on-surface-variant mt-1">
              You have {stats?.totalContacts || 0} contacts • {reminders.length} upcoming reminders
            </p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-container text-on-primary font-bold text-sm hover:brightness-110 transition-all"
          >
            <Icon name="add" className="w-4 h-4" />
            Add Contact
          </button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Contacts', value: stats?.totalContacts || 0, icon: 'group', color: 'text-primary' },
            { label: 'Your Level', value: user?.level || 1, icon: 'star', color: 'text-tertiary' },
            { label: 'Total XP', value: user?.xp || 0, icon: 'bolt', color: 'text-secondary' },
            { label: 'Reminders', value: reminders.length, icon: 'alarm', color: 'text-primary' },
          ].map(stat => (
            <div key={stat.label} className="bg-surface-container-low border border-outline-variant/10 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className={stat.color}><Icon name={stat.icon} className="w-5 h-5" /></span>
                <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">{stat.label}</span>
              </div>
              <p className="text-3xl font-black" style={{ fontFamily: 'Manrope' }}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Search + Filter */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="relative flex-1 min-w-64 max-w-md">
            <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/50" />
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/10 text-sm text-on-surface placeholder-on-surface-variant/40 focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <div className="flex gap-1 flex-wrap">
            {['All', ...allLabels].map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  activeFilter === f
                    ? 'bg-primary text-on-primary'
                    : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Contact list */}
        <div className="space-y-2 mb-8">
          {loading ? (
            <div className="text-center py-12 text-on-surface-variant">Loading contacts...</div>
          ) : filteredContacts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-3">👥</div>
              <p className="text-on-surface-variant font-medium">No contacts found</p>
              <p className="text-xs text-on-surface-variant/60 mt-1">Add your first contact to get started</p>
            </div>
          ) : (
            filteredContacts.map(c => (
              <ContactCard 
                key={c.id} 
                contact={c} 
                onCall={handleCall}
                onMessage={handleMessage}
                onReminder={handleReminder}
              />
            ))
          )}
        </div>
      </main>

      {/* ── Right AI Sidebar ──────────────────────────────────── */}
      <aside className="w-80 flex-shrink-0 bg-surface border-l border-outline-variant/10 flex flex-col py-6 hidden xl:flex">
        <div className="px-6 mb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-secondary">AI Command Center</span>
            <Icon name="psychology" className="w-4 h-4 text-secondary" />
          </div>
          <h2 className="text-base font-extrabold tracking-tight" style={{ fontFamily: 'Manrope' }}>
            Enrichment Queue
          </h2>
          <p className="text-xs text-on-surface-variant">Active Agent: Soco-1</p>
        </div>

        <div className="flex-1 overflow-y-auto hide-scrollbar px-6 space-y-4">
          {/* AI Insight card */}
          <div className="bg-surface-container-low p-4 rounded-xl border-l-4 border-secondary">
            <div className="flex items-start gap-3">
              <Icon name="psychology" className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-secondary mb-1">AI Insights</p>
                <p className="text-[11px] text-on-surface-variant leading-relaxed">
                  You have {contacts.filter(c => c.relationshipScore < 40).length} contacts with low health scores. Consider reaching out this week.
                </p>
              </div>
            </div>
          </div>

          {/* Upcoming reminders */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-3">Upcoming Reminders</h3>
            <div className="space-y-2">
              {reminders.slice(0, 5).map(r => (
                <ReminderItem key={r.id} reminder={r} />
              ))}
              {reminders.length === 0 && (
                <p className="text-xs text-on-surface-variant/50 text-center py-4">No upcoming reminders</p>
              )}
            </div>
          </div>

          {/* Health stats */}
          <div className="bg-surface-container-low p-4 rounded-xl">
            <h3 className="text-xs font-bold text-on-surface mb-3 flex items-center gap-2">
              <Icon name="favorite" className="w-4 h-4 text-secondary" />
              Relationship Health
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="text-center p-2 bg-surface-container-highest rounded-lg">
                <p className="text-lg font-black text-secondary" style={{ fontFamily: 'Manrope' }}>
                  {contacts.filter(c => c.relationshipScore >= 70).length}
                </p>
                <p className="text-[10px] text-on-surface-variant">Active</p>
              </div>
              <div className="text-center p-2 bg-surface-container-highest rounded-lg">
                <p className="text-lg font-black text-tertiary" style={{ fontFamily: 'Manrope' }}>
                  {contacts.filter(c => c.relationshipScore < 40).length}
                </p>
                <p className="text-[10px] text-on-surface-variant">Fading</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Add Contact Modal */}
      <AddContactModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={handleContactCreated}
        token={token}
      />

      {/* Toast notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

// ─── Root ────────────────────────────────────────────────────────────────────

export default function DashboardClient() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('socos_token');
    if (saved) setToken(saved);
  }, []);

  function handleLogin(newToken: string) { setToken(newToken); }
  function handleLogout() {
    localStorage.removeItem('socos_token');
    setToken(null);
  }

  if (!token) return <AuthForm onLogin={handleLogin} />;
  return <Dashboard token={token} onLogout={handleLogout} />;
}
