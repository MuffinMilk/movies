import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Movie, Show, getPopularMovies, searchMovies, getPopularShows, searchShows } from '../lib/tmdb';
import MovieCard from '../components/MovieCard';
import ShowCard from '../components/ShowCard';
import { Loader2, Tv, Film } from 'lucide-react';

export default function Home() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('search');
  
  const [mode, setMode] = useState<'movie' | 'tv'>('movie');
  const [items, setItems] = useState<(Movie | Show)[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useCallback((node: HTMLDivElement | null) => {
    if (loadingMore) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loadingMore, hasMore]);

  useEffect(() => {
    setItems([]);
    setPage(1);
    setHasMore(true);
  }, [query, mode]);

  useEffect(() => {
    const fetchItems = async () => {
      if (page === 1) setLoading(true);
      else setLoadingMore(true);
      setError(null);
      
      try {
        let results: (Movie | Show)[] = [];
        if (mode === 'movie') {
          results = query 
            ? await searchMovies(query, page)
            : await getPopularMovies(page);
        } else {
          results = query 
            ? await searchShows(query, page)
            : await getPopularShows(page);
        }
          
        if (results.length === 0) {
          setHasMore(false);
        } else {
          setItems(prev => {
            const newItems = results.filter(newItem => !prev.some(m => m.id === newItem.id));
            return page === 1 ? results : [...prev, ...newItems];
          });
        }
      } catch (err) {
        setError(`Failed to load ${mode === 'movie' ? 'movies' : 'shows'}. Please try again later.`);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    };

    fetchItems();
  }, [query, page, mode]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <h1 className="text-3xl font-bold text-white">
          {query ? `Search Results for "${query}"` : `Popular ${mode === 'movie' ? 'Movies' : 'Shows'}`}
        </h1>
        
        <div className="flex bg-gray-900 rounded-lg p-1 border border-white/10">
          <button
            onClick={() => setMode('movie')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
              mode === 'movie' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Film className="w-4 h-4" />
            Movies
          </button>
          <button
            onClick={() => setMode('tv')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
              mode === 'tv' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Tv className="w-4 h-4" />
            Shows
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
        </div>
      ) : error ? (
        <div className="text-center text-red-400 py-12 bg-red-400/10 rounded-lg">
          {error}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center text-gray-400 py-12">
          No {mode === 'movie' ? 'movies' : 'shows'} found. Try a different search term.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
            {items.map((item, index) => {
              const isLast = items.length === index + 1;
              const card = mode === 'movie' 
                ? <MovieCard movie={item as Movie} /> 
                : <ShowCard show={item as Show} />;

              if (isLast) {
                return (
                  <div ref={lastElementRef} key={item.id}>
                    {card}
                  </div>
                );
              } else {
                return <React.Fragment key={item.id}>{card}</React.Fragment>;
              }
            })}
          </div>
          
          {loadingMore && (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
            </div>
          )}
        </>
      )}
    </div>
  );
}
