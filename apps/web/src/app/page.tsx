import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-6xl mx-auto px-6 py-24">
          <nav className="flex justify-between items-center mb-16">
            <div className="text-2xl font-bold">SOCOS</div>
            <div className="flex gap-6 items-center">
              <Link href="/dashboard" className="hover:text-white/80 transition">Dashboard</Link>
              <Link 
                href="/dashboard" 
                className="bg-white text-purple-600 px-5 py-2 rounded-full font-medium hover:bg-white/90 transition"
              >
                Get Started
              </Link>
            </div>
          </nav>
          
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Your Relationships,<br />Leveled Up
            </h1>
            <p className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto mb-10">
              The gamified personal CRM that turns networking into a game. 
              Track contacts, log interactions, and never miss important moments.
            </p>
            <div className="flex gap-4 justify-center">
              <Link 
                href="/dashboard" 
                className="bg-white text-purple-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-white/90 transition"
              >
                Start Free
              </Link>
              <button className="border-2 border-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition">
                See Features
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16">Everything you need to nurture relationships</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-xl font-bold mb-2">Smart Contact Management</h3>
              <p className="text-gray-600">
                Track every person in your network with rich profiles, tags, and relationship scores.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm">
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-xl font-bold mb-2">Interaction Logging</h3>
              <p className="text-gray-600">
                Log calls, meetings, messages, and notes. Build a complete history of your relationships.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm">
              <div className="text-4xl mb-4">🔔</div>
              <h3 className="text-xl font-bold mb-2">Smart Reminders</h3>
              <p className="text-gray-600">
                Never forget birthdays, anniversaries, or follow-ups. Set recurring reminders that actually work.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm">
              <div className="text-4xl mb-4">⭐</div>
              <h3 className="text-xl font-bold mb-2">Gamification</h3>
              <p className="text-gray-600">
                Earn XP, level up, and unlock achievements. Making connections has never been more rewarding.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold mb-2">Insights & Analytics</h3>
              <p className="text-gray-600">
                Understand your networking patterns. See who you&apos;ve been neglecting and where to focus.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-bold mb-2">Private & Secure</h3>
              <p className="text-gray-600">
                Your data stays yours. Built with privacy first, encrypted, and under your control.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Simple, Free Pricing</h2>
          <p className="text-xl text-gray-600 mb-12">
            SOCOS is free while in beta. Build your network without any cost.
          </p>
          
          <div className="bg-gradient-to-br from-violet-600 to-indigo-700 text-white p-12 rounded-3xl">
            <div className="text-6xl font-bold mb-4">$0</div>
            <div className="text-xl mb-8">Free during beta</div>
            <ul className="text-left max-w-md mx-auto space-y-4 mb-8">
              <li className="flex items-center gap-3">
                <span>✅</span> Unlimited contacts
              </li>
              <li className="flex items-center gap-3">
                <span>✅</span> Interaction logging
              </li>
              <li className="flex items-center gap-3">
                <span>✅</span> Smart reminders
              </li>
              <li className="flex items-center gap-3">
                <span>✅</span> Gamification & achievements
              </li>
              <li className="flex items-center gap-3">
                <span>✅</span> Priority support
              </li>
            </ul>
            <Link 
              href="/dashboard" 
              className="inline-block bg-white text-purple-600 px-10 py-4 rounded-full font-bold text-lg hover:bg-white/90 transition"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to level up your network?</h2>
          <p className="text-xl text-gray-400 mb-10">
            Join thousands of professionals who are building stronger relationships with SOCOS.
          </p>
          <Link 
            href="/dashboard" 
            className="inline-block bg-violet-600 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-violet-700 transition"
          >
            Start Building Your Network
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-950 text-gray-500">
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
          <div className="text-xl font-bold">SOCOS</div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition">Privacy</a>
            <a href="#" className="hover:text-white transition">Terms</a>
            <a href="#" className="hover:text-white transition">Contact</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
