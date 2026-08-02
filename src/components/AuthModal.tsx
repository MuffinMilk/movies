import React, { useState } from 'react';
import { X, Mail, Lock, User, Check, Sparkles } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [signedIn, setSignedIn] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSignedIn(true);
    setTimeout(() => {
      onClose();
      setSignedIn(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-[#18181b] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl text-white">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {signedIn ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Check className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold">Successfully Signed In!</h3>
            <p className="text-sm text-gray-400">Welcome back to your stream account.</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-lg shadow-md">
                D
              </div>
              <div>
                <h2 className="text-xl font-bold">{isSignUp ? 'Create Account' : 'Welcome Back'}</h2>
                <p className="text-xs text-gray-400">Sign in to save watchlists & favorites</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Full Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full bg-[#27272a] border border-white/10 rounded-2xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
                    />
                    <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full bg-[#27272a] border border-white/10 rounded-2xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Password</label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#27272a] border border-white/10 rounded-2xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-sm hover:opacity-90 transition-opacity shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 mt-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isSignUp ? 'Create Free Account' : 'Sign In'}</span>
              </button>
            </form>

            <div className="text-center pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-xs text-cyan-400 hover:underline font-medium"
              >
                {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
