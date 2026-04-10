import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Movie, getPopularMovies, searchMovies } from '../lib/tmdb';
import MovieCard from '../components/MovieCard';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('search');
  
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastMovieElementRef = useCallback((node: HTMLDivElement | null) => {
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
    setMovies([]);
    setPage(1);
    setHasMore(true);
  }, [query]);

  useEffect(() => {
    const fetchMovies = async () => {
      if (page === 1) setLoading(true);
      else setLoadingMore(true);
      setError(null);
      
      try {
        const results = query 
          ? await searchMovies(query, page)
          : await getPopularMovies(page);
          
        if (results.length === 0) {
          setHasMore(false);
        } else {
          setMovies(prev => {
            // Filter out duplicates just in case
            const newMovies = results.filter(newMovie => !prev.some(m => m.id === newMovie.id));
            return page === 1 ? results : [...prev, ...newMovies];
          });
        }
      } catch (err) {
        setError('Failed to load movies. Please try again later.');
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    };

    fetchMovies();
  }, [query, page]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-8">
        {query ? `Search Results for "${query}"` : 'Popular Movies'}
      </h1>

      {loading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
        </div>
      ) : error ? (
        <div className="text-center text-red-400 py-12 bg-red-400/10 rounded-lg">
          {error}
        </div>
      ) : movies.length === 0 ? (
        <div className="text-center text-gray-400 py-12">
          No movies found. Try a different search term.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
            {movies.map((movie, index) => {
              if (movies.length === index + 1) {
                return (
                  <div ref={lastMovieElementRef} key={movie.id}>
                    <MovieCard movie={movie} />
                  </div>
                );
              } else {
                return <MovieCard key={movie.id} movie={movie} />;
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
