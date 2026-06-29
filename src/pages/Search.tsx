import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchMulti, Movie, Show } from '../lib/tmdb';
import MediaGrid from '../components/MediaGrid';
import { Search as SearchIcon, Loader2 } from 'lucide-react';

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [inputValue, setInputValue] = useState(query);
  
  const [results, setResults] = useState<(Movie | Show)[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      try {
        const data = await searchMulti(query);
        setResults(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setSearchParams({ q: inputValue.trim() });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="min-h-screen pt-24 px-4 pb-12">
      <div className="container mx-auto max-w-3xl mb-12">
        <form onSubmit={handleSearch} className="relative flex items-center">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search for movies, TV shows..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-16 text-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all shadow-xl"
          />
          <button 
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all"
          >
            <SearchIcon className="w-5 h-5" />
          </button>
        </form>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-white animate-spin" />
        </div>
      ) : results.length > 0 ? (
        <MediaGrid items={results} title={`Search Results for "${query}"`} />
      ) : query ? (
        <div className="text-center py-20 text-gray-400">
          No results found for "{query}"
        </div>
      ) : (
        <div className="text-center py-20 text-gray-500">
          Search for something to get started
        </div>
      )}
    </div>
  );
}
