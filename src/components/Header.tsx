import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Home, Tv, Film, Star, Bookmark, Search, Menu, X } from 'lucide-react';
import LeftDrawer from './LeftDrawer';
import AuthModal from './AuthModal';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Live', path: '/live', icon: Tv },
    { name: 'Movies', path: '/movies', icon: Film },
    { name: 'Shows', path: '/shows', icon: Tv },
    { name: 'Anime', path: '/anime', icon: Star },
    { name: 'Library', path: '/library', icon: Bookmark },
  ];

  return (
    <>
      {/* Left Edge Trigger Bar */}
      <div 
        onMouseEnter={() => setDrawerOpen(true)}
        onClick={() => setDrawerOpen(true)}
        className="fixed left-0 top-1/2 -translate-y-1/2 z-40 w-3 h-32 hover:w-5 bg-white/10 hover:bg-white/20 border-r border-t border-b border-white/20 rounded-r-2xl backdrop-blur-md cursor-pointer transition-all duration-300 flex items-center justify-center group shadow-2xl"
        title="Open Navigation"
      >
        <div className="w-1 h-8 rounded-full bg-white/40 group-hover:bg-white/80 transition-colors" />
      </div>

      {/* Left Drawer Side Menu */}
      <LeftDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />

      {/* Auth Modal */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />

      {/* Top Floating Pill Header (Matching Image 1) */}
      <header className="fixed top-4 left-0 right-0 z-40 flex justify-center px-2 sm:px-4 pointer-events-none">
        <div 
          className={`pointer-events-auto flex items-center justify-between gap-1 sm:gap-2 px-2.5 py-1.5 rounded-full bg-[#2f271d]/85 backdrop-blur-2xl border border-white/15 shadow-[0_10px_35px_rgba(0,0,0,0.85)] transition-all duration-300 max-w-full overflow-x-auto scrollbar-hide ${
            scrolled ? 'bg-[#1a1610]/95 border-white/20' : ''
          }`}
        >
          {/* Mobile Drawer Button */}
          <button
            onClick={() => setDrawerOpen(true)}
            className="p-1.5 rounded-full text-gray-300 hover:text-white hover:bg-white/10 sm:hidden transition-colors shrink-0"
          >
            <Menu className="w-4 h-4" />
          </button>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 sm:gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
                    isActive
                      ? 'bg-[#5c5240] text-white border border-white/25 shadow-md'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Divider */}
          <div className="w-px h-5 bg-white/20 mx-1 hidden sm:block shrink-0" />

          {/* Search & Sign In (Buttons on the Right) */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {searchOpen ? (
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search movies, shows, anime..."
                  autoFocus
                  className="w-36 sm:w-56 bg-white/15 border border-white/30 rounded-full px-3.5 py-1 text-xs text-white placeholder-gray-300 focus:outline-none focus:ring-1 focus:ring-white/50"
                />
                <button 
                  type="button" 
                  onClick={() => setSearchOpen(false)}
                  className="absolute right-2 text-gray-300 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </form>
            ) : (
              <button
                onClick={() => {
                  if (location.pathname === '/search') {
                    setSearchOpen(true);
                  } else {
                    setSearchOpen(true);
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium text-gray-200 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
              >
                <Search className="w-4 h-4 text-gray-300" />
                <span className="hidden sm:inline font-semibold">Search</span>
              </button>
            )}

            {/* User Profile / Sign In Pill (Matching Image 1) */}
            <button
              onClick={() => setAuthModalOpen(true)}
              className="flex items-center gap-2 pl-1.5 pr-3 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 transition-all text-xs sm:text-sm text-gray-100 font-medium cursor-pointer shadow-sm"
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-600 text-white flex items-center justify-center text-xs font-bold shadow-inner border border-white/20">
                D
              </div>
              <span className="hidden sm:inline text-xs font-semibold text-gray-200">Sign in</span>
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
