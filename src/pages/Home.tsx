import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Movie, Show, getPopularMovies, searchMovies, getPopularShows, searchShows, getImageUrl } from '../lib/tmdb';
import MovieCard from '../components/MovieCard';
import ShowCard from '../components/ShowCard';
import { Loader2, Tv, Film, Play } from 'lucide-react';

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

  const featuredItem = items.length > 0 && !query && page === 1 ? items[0] : null;
  const gridItems = featuredItem ? items.slice(1) : items;

  return (
    <div className="w-full">
      {/* Hero Section */}
      {featuredItem && (
        <div className="relative w-full h-[60vh] lg:h-[75vh] mb-12 overflow-hidden">
          <img 
            src={getImageUrl(featuredItem.backdrop_path, 'original')} 
            alt={'title' in featuredItem ? featuredItem.title : featuredItem.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent" />
          
          <div className="absolute bottom-0 left-0 w-full p-6 md:p-16 lg:p-24">
            <div className="max-w-3xl">
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 tracking-tight">
                {'title' in featuredItem ? featuredItem.title : featuredItem.name}
              </h2>
              <p className="text-gray-300 text-lg md:text-xl line-clamp-3 mb-8 max-w-2xl text-shadow-sm">
                {featuredItem.overview}
              </p>
              <Link 
                to={`/${mode}/${featuredItem.id}`} 
                className="inline-flex items-center gap-3 bg-white text-black hover:bg-gray-200 px-8 py-4 rounded-full font-bold text-lg transition-all hover:scale-105"
              >
                <Play className="w-6 h-6 fill-current" />
                Watch Now
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 pb-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <h1 className="text-3xl font-bold text-white">
            {query ? `Search Results for "${query}"` : `Trending ${mode === 'movie' ? 'Movies' : 'Shows'}`}
          </h1>
          
          <div className="flex bg-white/5 backdrop-blur-md rounded-xl p-1 border border-white/10 shadow-xl">
            <button
              onClick={() => setMode('movie')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg transition-all font-medium ${
                mode === 'movie' ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30' : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Film className="w-4 h-4" />
              Movies
            </button>
            <button
              onClick={() => setMode('tv')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg transition-all font-medium ${
                mode === 'tv' ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30' : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Tv className="w-4 h-4" />
              Shows
            </button>
          </div>
        </div>

        {loading && page === 1 ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <Loader2 className="w-10 h-10 text-purple-500 animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center text-red-400 py-12 bg-red-400/10 rounded-xl border border-red-400/20">
            {error}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center text-gray-400 py-20 bg-white/5 rounded-2xl border border-white/10">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-white mb-2">No results found</h3>
            <p>Try adjusting your search term.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
              {gridItems.map((item, index) => {
                const isLast = gridItems.length === index + 1;
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
              <div className="flex justify-center items-center py-12">
                <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
