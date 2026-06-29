import React, { useEffect, useState } from 'react';
import { getPopularShows, Show } from '../lib/tmdb';
import MediaGrid from '../components/MediaGrid';
import { Loader2 } from 'lucide-react';

export default function Shows() {
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 text-white animate-spin" />
      </div>
    );
  }

  return (
    <div className="pt-20">
      <MediaGrid items={shows} title="Popular TV Shows" />
    </div>
  );
}
