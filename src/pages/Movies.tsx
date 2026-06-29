import React, { useEffect, useState } from 'react';
import { getPopularMovies, Movie } from '../lib/tmdb';
import MediaGrid from '../components/MediaGrid';
import { Loader2 } from 'lucide-react';

export default function Movies() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data = await getPopularMovies(1);
        setMovies(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  const loadMore = async () => {
    if (loadingMore) return;
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const data = await getPopularMovies(nextPage);
      setMovies(prev => [...prev, ...data]);
      setPage(nextPage);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMore(false);
    }
  };

  if (loading && page === 1) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 text-white animate-spin" />
      </div>
    );
  }

  return (
    <div className="pt-20 pb-12">
      <MediaGrid items={movies} title="Popular Movies" />
      <div className="flex justify-center mt-8">
        <button 
          onClick={loadMore}
          disabled={loadingMore}
          className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition-all flex items-center gap-2"
        >
          {loadingMore && <Loader2 className="w-5 h-5 animate-spin" />}
          Load More Movies
        </button>
      </div>
    </div>
  );
}
