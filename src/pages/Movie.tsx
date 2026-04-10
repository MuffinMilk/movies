import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MovieDetails, getMovieDetails, getImageUrl } from '../lib/tmdb';
import { sources, Source } from '../lib/sources';
import { Loader2, ArrowLeft, Star, Clock, Calendar } from 'lucide-react';

export default function Movie() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedSource, setSelectedSource] = useState<Source>(sources[0]);

  useEffect(() => {
    const fetchMovie = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const data = await getMovieDetails(id);
        setMovie(data);
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
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="text-red-400 mb-4">{error || 'Movie not found'}</div>
        <button onClick={() => navigate(-1)} className="text-purple-400 hover:underline">
          Go back
        </button>
      </div>
    );
  }

  const iframeUrl = selectedSource.url.replace('{id}', movie.id.toString());

  return (
    <div className="min-h-screen bg-black">
      {/* Backdrop */}
      <div className="absolute top-0 left-0 w-full h-[60vh] opacity-30 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black z-10" />
        <img 
          src={getImageUrl(movie.backdrop_path, 'original')} 
          alt="" 
          className="w-full h-full object-cover"
        />
      </div>

      <div className="container mx-auto px-4 py-8 relative z-20">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        <div className="flex flex-col md:flex-row gap-8 mb-12">
          <div className="w-48 md:w-64 shrink-0 mx-auto md:mx-0">
            <img 
              src={getImageUrl(movie.poster_path)} 
              alt={movie.title}
              className="w-full rounded-xl shadow-2xl shadow-purple-500/10"
            />
          </div>
          
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{movie.title}</h1>
            {movie.tagline && (
              <p className="text-xl text-purple-400 italic mb-6">{movie.tagline}</p>
            )}
            
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-300 mb-6">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="text-white font-medium">{movie.vote_average.toFixed(1)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-400" />
                <span>{movie.runtime} min</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gray-400" />
                <span>{new Date(movie.release_date).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {movie.genres.map(g => (
                <span key={g.id} className="px-3 py-1 rounded-full bg-white/10 text-sm text-gray-200">
                  {g.name}
                </span>
              ))}
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold text-white mb-2">Overview</h3>
              <p className="text-gray-300 leading-relaxed max-w-3xl">
                {movie.overview}
              </p>
            </div>
          </div>
        </div>

        {/* Video Player Section */}
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <h2 className="text-2xl font-bold text-white">Watch Now</h2>
            <div className="flex items-center gap-3">
              <label htmlFor="source" className="text-sm text-gray-400">Source:</label>
              <select 
                id="source"
                value={selectedSource.id}
                onChange={(e) => setSelectedSource(sources.find(s => s.id === e.target.value) || sources[0])}
                className="bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              >
                {sources.map(source => (
                  <option key={source.id} value={source.id}>
                    {source.name} {source.isFrench ? '(FR)' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {window.self !== window.top && (
            <div className="mb-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-start gap-3">
              <div className="text-yellow-500 mt-0.5">⚠️</div>
              <div className="text-sm text-yellow-200/90">
                <strong className="block text-yellow-500 mb-1">Preview Environment Limitation</strong>
                Because you are viewing this inside the AI Studio preview, some video sources will show a <span className="text-red-400 font-mono bg-red-400/10 px-1 rounded">Sandboxing is not allowed!</span> error. 
                <br/>
                To fix this and watch the movie, please click the <strong>"Open in new tab"</strong> button (↗️) in the top right corner of this preview window.
              </div>
            </div>
          )}
          
          <div className="aspect-video w-full bg-gray-900 rounded-xl overflow-hidden shadow-2xl border border-white/5">
            <iframe
              src={iframeUrl}
              className="w-full h-full"
              allowFullScreen={true}
              webkitallowfullscreen="true"
              mozallowfullscreen="true"
              allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
              title="Movie Player"
              frameBorder="0"
              scrolling="no"
            />
          </div>
          <p className="text-center text-sm text-gray-500 mt-4">
            If the video doesn't load or shows ads, try selecting a different source from the dropdown above.
            For the best experience, use an ad-blocker like uBlock Origin.
          </p>
        </div>
      </div>
    </div>
  );
}
