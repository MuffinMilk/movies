import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, LayoutGrid, Film, Tv, Sparkles, BookOpen, Music, Radio, Heart, Clock, FileText, ChevronLeft, ChevronRight, Play, Pause, Info } from 'lucide-react';
import CreditsModal from './CreditsModal';

export default function Sidebar({ collapsed, setCollapsed }: { collapsed: boolean; setCollapsed: (val: boolean) => void }) {
  const location = useLocation();
  const [isCreditsOpen, setIsCreditsOpen] = useState(false);

  const box1 = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Search', path: '/search', icon: Search },
  ];

  const box2 = [
    { name: 'Movies', path: '/movies', icon: Film },
    { name: 'TV Shows', path: '/shows', icon: Tv },
    { name: 'Anime', path: '/anime', icon: Sparkles },
  ];

  const box3: any[] = [];

  const isActiveMenu = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <aside className={`fixed left-0 top-0 bottom-0 bg-black/40 backdrop-blur-2xl z-50 flex flex-col transition-all duration-300 hidden md:flex border-r border-white/5 shadow-2xl ${collapsed ? 'w-20' : 'w-64'}`}>
      <div className="p-6 pb-2">
        <Link to="/" className="flex items-center gap-2 text-white overflow-hidden select-none drop-shadow-md">
          <span className="text-3xl font-black tracking-tighter whitespace-nowrap">awdrex</span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-hide">
        {/* Box 1 */}
        <div className="bg-white/5 rounded-xl p-2 space-y-1">
          {box1.map((link) => {
            const isActive = isActiveMenu(link.path);
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-semibold text-[13px] ${
                  isActive ? 'bg-white/10 text-white shadow-sm' : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
                title={collapsed ? link.name : undefined}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                {!collapsed && <span className="opacity-90">{link.name}</span>}
              </Link>
            );
          })}
        </div>

        {/* Box 2 */}
        <div className="bg-white/5 rounded-xl p-2 space-y-1">
          {!collapsed && <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 px-3 pt-2">Media</div>}
          {box2.map((link) => {
            const isActive = isActiveMenu(link.path);
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-semibold text-[13px] ${
                  isActive ? 'bg-white/10 text-white shadow-sm' : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
                title={collapsed ? link.name : undefined}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                {!collapsed && <span className="opacity-90">{link.name}</span>}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="p-4 mt-auto">
        <button
          onClick={() => setIsCreditsOpen(true)}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-semibold text-[13px] text-gray-400 hover:text-white hover:bg-white/5`}
          title={collapsed ? 'Credits' : undefined}
        >
          <Info className="w-4 h-4 shrink-0" />
          {!collapsed && <span className="opacity-90">Credits</span>}
        </button>
      </div>

      <button 
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-xl rounded-md border border-white/10 p-1 text-gray-400 hover:text-white z-50 hover:bg-white/20 transition-all shadow-lg"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      <CreditsModal isOpen={isCreditsOpen} onClose={() => setIsCreditsOpen(false)} />
    </aside>
  );
}
