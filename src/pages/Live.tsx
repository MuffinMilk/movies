import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Radio, Tv, Sparkles, ArrowLeft, Wrench } from 'lucide-react';

export default function Live() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white flex flex-col items-center justify-center p-6 text-center pt-24 pb-16 relative select-none overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-md w-full flex flex-col items-center space-y-6">
        {/* Animated Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600/10 border border-red-500/20 text-red-400 text-xs font-bold tracking-wider uppercase">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          <span>Live Streams</span>
        </div>

        {/* Icon Circle */}
        <div className="relative">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-[#1a1a20] to-[#252530] border border-white/10 flex items-center justify-center shadow-2xl">
            <Radio className="w-12 h-12 text-red-500" />
          </div>
          <div className="absolute -bottom-2 -right-2 w-9 h-9 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-lg border border-black">
            <Wrench className="w-4 h-4" />
          </div>
        </div>

        {/* Main Header Requested */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Still making it
          </h1>
          <p className="text-gray-400 text-sm font-medium leading-relaxed max-w-xs mx-auto">
            Live TV channels and broadcast streams are currently under active development.
          </p>
        </div>

        {/* Action Button back to Home */}
        <div className="pt-2">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-gray-200 text-black font-extrabold text-sm transition-all shadow-xl hover:scale-105 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Explore Movies & Shows</span>
          </button>
        </div>
      </div>
    </div>
  );
}
