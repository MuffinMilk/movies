import React, { useEffect, useState } from 'react';
import { getAnime, Show } from '../lib/tmdb';
import MediaGrid from '../components/MediaGrid';
import { Loader2 } from 'lucide-react';

export default function Anime() {
  const [anime, setAnime] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnime = async () => {
      try {
        const data = await getAnime(1);
        setAnime(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnime();
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
      <MediaGrid items={anime} title="Anime" />
    </div>
  );
}
