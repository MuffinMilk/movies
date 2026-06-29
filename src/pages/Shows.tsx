import React, { useEffect, useState } from 'react';
import { getPopularShows, Show } from '../lib/tmdb';
import MediaGrid from '../components/MediaGrid';
import { Loader2 } from 'lucide-react';

export default function Shows() {
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    const fetchShows = async () => {
      try {
        const data = await getPopularShows(1);
        setShows(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchShows();
  }, []);

  const loadMore = async () => {
    if (loadingMore) return;
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const data = await getPopularShows(nextPage);
      setShows(prev => [...prev, ...data]);
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
      <MediaGrid items={shows} title="Popular TV Shows" />
      <div className="flex justify-center mt-8">
        <button 
          onClick={loadMore}
          disabled={loadingMore}
          className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition-all flex items-center gap-2"
        >
          {loadingMore && <Loader2 className="w-5 h-5 animate-spin" />}
          Load More Shows
        </button>
      </div>
    </div>
  );
}
