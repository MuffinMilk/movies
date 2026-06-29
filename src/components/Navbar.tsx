import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Menu, Bell, User } from 'lucide-react';

export default function Navbar() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Update query state if search param exists
  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('search');
    if (searchParam) setQuery(searchParam);
    else if (!location.search.includes('search')) setQuery('');
  }, [location.search]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <nav className="sticky top-0 z-40 w-full bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/5 md:pl-64">
      <div className="px-4 md:px-8 h-20 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 md:hidden">
          <button className="text-gray-400 hover:text-white transition-colors">
            <Menu className="w-6 h-6" />
          </button>
          <Link to="/" className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-teal-500" />
            Awdrex
          </Link>
        </div>
        
        <form onSubmit={handleSearch} className="relative w-full max-w-xl hidden sm:block ml-auto md:ml-0">
          <div className="relative group flex items-center">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-teal-400 transition-colors">
              <Search className="h-5 w-5" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="block w-full pl-12 pr-14 py-3 border border-white/5 rounded-2xl bg-[#141414] text-white placeholder-gray-500 focus:outline-none focus:bg-[#1a1a1a] focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/50 sm:text-sm transition-all"
              placeholder="Search for movies, TV shows..."
            />
            <button 
              type="submit" 
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </form>

        <div className="flex items-center gap-4 md:gap-6 ml-auto">
          <button className="text-gray-400 hover:text-white transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-teal-500 rounded-full"></span>
          </button>
          <button className="w-9 h-9 rounded-full bg-gradient-to-tr from-teal-500 to-emerald-400 p-0.5">
            <div className="w-full h-full bg-[#0a0a0a] rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-teal-400" />
            </div>
          </button>
        </div>
      </div>
    </nav>
  );
}
