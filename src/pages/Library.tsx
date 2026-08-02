import React, { useState } from 'react';
import { ArrowLeft, Clock, Bookmark, ShieldCheck, Mail, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Library() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signedIn, setSignedIn] = useState(false);

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-white flex flex-col justify-between overflow-x-hidden font-sans">
      {/* Background Cinematic Image with Gradient Overlay (Screenshot 8) */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=2000&q=80"
          alt="Cinematic Background"
          className="w-full h-full object-cover opacity-20 filter blur-sm scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/90 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-[#0a0a0a]/80" />
      </div>

      {/* Top Navigation */}
      <div className="relative z-10 pt-20 px-6 max-w-7xl mx-auto w-full flex items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-xs font-bold text-gray-200 transition-all border border-white/10 backdrop-blur-md"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </Link>
      </div>

      {/* Main Container */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center my-auto">
        {/* Left Copy & Features */}
        <div className="lg:col-span-7 space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-600 to-blue-700 flex items-center justify-center font-black text-xl text-white shadow-xl border border-cyan-400/30">
              a.
            </div>
            <span className="text-xs font-extrabold text-gray-400 uppercase tracking-widest">
              AWDREX.TV
            </span>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
              Pick up exactly where you left off.
            </h1>
            <p className="text-base sm:text-lg text-gray-300 font-normal leading-relaxed max-w-xl">
              Sign in to sync profiles, watch history, custom lists, and favorites across every screen.
            </p>
          </div>

          {/* Feature Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            {[
              { title: 'Watch history', icon: Clock },
              { title: 'Custom lists', icon: Bookmark },
              { title: 'Private profiles', icon: ShieldCheck },
            ].map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="p-4 rounded-2xl bg-[#141414]/80 border border-white/10 backdrop-blur-md flex items-center gap-3">
                  <Icon className="w-5 h-5 text-gray-400 shrink-0" />
                  <span className="text-xs font-bold text-gray-200">{f.title}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Sign-in Form Card (Screenshot 8) */}
        <div className="lg:col-span-5">
          <div className="bg-[#141414]/90 border border-white/10 rounded-3xl p-8 backdrop-blur-2xl shadow-2xl space-y-6">
            <div>
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1">
                SIGN IN
              </span>
              <h2 className="text-2xl font-black text-white tracking-tight">
                Welcome back
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                Continue with your profile and saved lists.
              </p>
            </div>

            {/* Social Logins */}
            <div className="space-y-3">
              <button 
                onClick={() => setSignedIn(true)}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white hover:bg-gray-100 text-black font-extrabold text-xs rounded-2xl transition-all shadow-md"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Continue with Google</span>
              </button>

              <button 
                onClick={() => setSignedIn(true)}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-[#5865F2] hover:bg-[#4752C4] text-white font-extrabold text-xs rounded-2xl transition-all shadow-md"
              >
                <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028z" />
                </svg>
                <span>Continue with Discord</span>
              </button>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                OR USE EMAIL
              </span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Form */}
            <form onSubmit={(e) => { e.preventDefault(); setSignedIn(true); }} className="space-y-3">
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full bg-[#1c1c1c] border border-white/10 rounded-2xl py-3 px-4 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-white/30 transition-all"
              />
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full bg-[#1c1c1c] border border-white/10 rounded-2xl py-3 px-4 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-white/30 transition-all"
              />

              <button 
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3 bg-white hover:bg-gray-200 text-black font-extrabold text-xs rounded-2xl transition-all shadow-lg"
              >
                <Mail className="w-4 h-4" />
                <span>Sign in with email</span>
              </button>
            </form>

            <p className="text-[10px] text-gray-500 text-center leading-relaxed">
              New to awdrex.tv? Sign in with Google or Discord above to get started.
            </p>
          </div>
        </div>
      </div>

      <div className="relative z-10 pb-8 text-center text-xs text-gray-600 font-medium">
        © 2026 Awdrex TV. All rights reserved.
      </div>
    </div>
  );
}
