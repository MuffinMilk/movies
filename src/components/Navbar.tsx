import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

export default function Navbar() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/?search=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/50 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors">
          <span className="text-2xl font-bold tracking-tight">Awdres Movies</span>
        </Link>
        
        <form onSubmit={handleSearch} className="relative w-full max-w-md hidden sm:block">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-purple-400 transition-colors">
              <Search className="h-5 w-5" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-white/10 rounded-full leading-5 bg-white/5 text-gray-100 placeholder-gray-400 focus:outline-none focus:bg-white/10 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 sm:text-sm transition-all"
              placeholder="Search for movies..."
            />
          </div>
        </form>
      </div>
    </nav>
  );
}
