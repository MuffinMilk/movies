import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Search, Home, Tv, Film, Star, 
  Compass, PlaySquare, Calendar, Grid, Map,
  X, User
} from 'lucide-react';

interface LeftDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LeftDrawer({ isOpen, onClose }: LeftDrawerProps) {
  const location = useLocation();
  const [activeProfile, setActiveProfile] = useState<{ name: string; avatarText: string } | null>(() => {
    const saved = localStorage.getItem('dulo_active_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return { name: 'Default', avatarText: 'D' };
      }
    }
    return { name: 'Default', avatarText: 'D' };
  });

  useEffect(() => {
    const handleProfileChange = () => {
      const saved = localStorage.getItem('dulo_active_profile');
      if (saved) {
        try {
          setActiveProfile(JSON.parse(saved));
        } catch {}
      }
    };
    window.addEventListener('storage', handleProfileChange);
    const interval = setInterval(handleProfileChange, 1000);
    return () => {
      window.removeEventListener('storage', handleProfileChange);
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity"
        />
      )}

      {/* Drawer */}
      <div 
        className={`fixed top-4 left-4 bottom-4 w-64 bg-[#141414] border border-white/10 rounded-3xl z-50 flex flex-col justify-between p-4 shadow-2xl transition-transform duration-300 ease-out overflow-y-auto scrollbar-hide ${
          isOpen ? 'translate-x-0' : '-translate-x-[calc(100%+20px)]'
        }`}
      >
        <div className="space-y-6">
          {/* Header Profile / Logo */}
          <div className="flex items-center justify-between px-2 pt-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 text-white flex items-center justify-center font-bold text-base shadow-md border border-white/20">
                {activeProfile?.avatarText || 'D'}
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-white text-base tracking-tight">
                  {activeProfile?.name || 'Default'}
                </span>
                <span className="text-[11px] text-gray-400 font-medium">Profile</span>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Main Navigation */}
          <div className="space-y-1">
            {[
              { name: 'Search', path: '/search', icon: Search },
              { name: 'Home', path: '/', icon: Home },
              { name: 'Live', path: '/live', icon: Tv },
              { name: 'Movies', path: '/movies', icon: Film },
              { name: 'Shows', path: '/shows', icon: Tv },
              { name: 'Anime', path: '/anime', icon: Star },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={onClose}
                  className={`flex items-center gap-3.5 px-4 py-2.5 rounded-2xl font-bold text-sm transition-all ${
                    isActive 
                      ? 'bg-white/20 text-white shadow-sm' 
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* More Section */}
          <div className="pt-2 border-t border-white/10 space-y-1">
            <span className="px-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-2">
              More
            </span>
            {[
              { name: 'Discover', path: '/search', icon: Compass },
              { name: 'Shorts', path: '/', icon: PlaySquare },
              { name: 'Calendar', path: '/', icon: Calendar },
              { name: 'Genres', path: '/movies', icon: Grid },
              { name: 'Roadmap', path: '/', icon: Map },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={onClose}
                  className="flex items-center gap-3.5 px-4 py-2.5 rounded-2xl font-bold text-sm text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Channels & Apps Quick Nav */}
          <div className="pt-2 border-t border-white/10 space-y-2">
            <span className="px-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
              Channels & Apps
            </span>
            <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/5 border border-white/5 hover:border-white/20 transition-all">
              <span className="text-xs font-black text-red-500 uppercase tracking-widest">NETFLIX</span>
              <span className="text-xs font-bold text-white">Netflix</span>
            </div>
          </div>
        </div>

        {/* Bottom Sign In Button */}
        <div className="pt-4 border-t border-white/10">
          <Link
            to="/library"
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-sm rounded-2xl transition-all border border-white/10"
          >
            <User className="w-4 h-4" />
            <span>Sign in</span>
          </Link>
        </div>
      </div>
    </>
  );
}
