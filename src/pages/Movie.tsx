import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MovieDetails, getMovieDetails } from '../lib/tmdb';
import { saveToContinueWatching } from '../lib/storage';
import { Loader2 } from 'lucide-react';
import MediaDetailModal from '../components/MediaDetailModal';

export default function Movie() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovie = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const data = await getMovieDetails(id);
        setMovie(data);
        saveToContinueWatching(data);
      } catch (err) {
        setError('Failed to load movie details.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#0a0a0a]">
        <Loader2 className="w-8 h-8 text-white animate-spin" />
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="container mx-auto px-4 py-24 text-center min-h-screen bg-[#0a0a0a]">
        <div className="text-red-400 mb-4 font-bold">{error || 'Movie not found'}</div>
        <button onClick={() => navigate(-1)} className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-sm transition-all">
          Go back
        </button>
      </div>
    );
  }

  return (
    <MediaDetailModal 
      item={movie}
      type="movie"
      onClose={() => navigate(-1)}
    />
  );
}
