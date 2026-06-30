import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { MovieDetails, getMovieDetails, getImageUrl, getMovieRating } from '../lib/tmdb';
import { sources, Source } from '../lib/sources';
import { saveToContinueWatching } from '../lib/storage';
import { Loader2, ArrowLeft, Star, Clock, Calendar, Bookmark, Play } from 'lucide-react';
import Intro from '../components/Intro';

export default function Movie() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [watchMode, setWatchMode] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  
  const [selectedSource, setSelectedSource] = useState<Source>(sources[0]);

  useEffect(() => {
    const fetchMovie = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      setShowTrailer(false);
      setShowIntro(true); // Reset intro for new movie
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

  const trailer = movie?.videos?.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube') 
    || movie?.videos?.results?.find(v => v.site === 'YouTube');

  useEffect(() => {
    if (trailer && !watchMode && !showIntro) {
      const timer = setTimeout(() => setShowTrailer(true), 2000);
      return () => clearTimeout(timer);
    } else {
      setShowTrailer(false);
    }
  }, [trailer, watchMode, showIntro]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 text-white animate-spin" />
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="container mx-auto px-4 py-12 text-center ">
        <div className="text-red-400 mb-4">{error || 'Movie not found'}</div>
        <button onClick={() => navigate(-1)} className="text-white hover:underline">
          Go back
        </button>
      </div>
    );
  }

  const iframeUrl = selectedSource.url.replace('{id}', movie.id.toString());
  const cast = movie.credits?.cast?.slice(0, 12) || [];
  const logo = movie.images?.logos?.[0]?.file_path;

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <AnimatePresence>
        {showIntro && (
          <Intro 
            key="movie-intro" 
            onComplete={() => setShowIntro(false)} 
            backgroundUrl={getImageUrl(movie.backdrop_path, 'original')}
            logoUrl={logo ? getImageUrl(logo, 'original') : undefined}
            title={movie.title}
          />
        )}
      </AnimatePresence>

      {/* Fixed Ambient Background */}
      <div className="fixed inset-0 z-0">
        <img 
          src={getImageUrl(movie.backdrop_path, 'w500')} 
          alt="" 
          className="w-full h-full object-cover opacity-30 blur-[100px] saturate-200"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Background Trailer or Backdrop */}
      <div className="fixed top-0 left-0 w-full h-[100vh]  pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black z-10" />
        
        {showTrailer ? (
          <div className="w-full h-full relative overflow-hidden bg-black">
            <iframe
              src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=1&controls=0&modestbranding=1&showinfo=0&rel=0&loop=1&playlist=${trailer.key}&playsinline=1`}
              className="absolute top-1/2 left-1/2 w-[100vw] h-[56.25vw] min-h-[100vh] min-w-[177.77vh] -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-100"
              allow="autoplay; encrypted-media"
            />
          </div>
        ) : (
          <img 
            src={getImageUrl(movie.backdrop_path, 'original')} 
            alt="" 
            className="w-full h-full object-cover transition-opacity duration-1000"
          />
        )}
      </div>

      <div className="container mx-auto px-4 md:px-12 pt-32 pb-24 relative z-20  flex flex-col min-h-[90vh] justify-center">
        <div className="max-w-3xl">
          <div className="flex flex-wrap gap-2 mb-6">
            {getMovieRating(movie.release_dates) && (
              <span className="px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 text-xs font-bold text-white tracking-wider shadow-lg shadow-black/20">
                {getMovieRating(movie.release_dates)}
              </span>
            )}
            {movie.genres.map((g, index) => (
              <span key={`${g.id}-${index}`} className="px-4 py-1.5 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 text-xs font-semibold text-gray-200 tracking-wider shadow-lg shadow-black/20">
                {g.name}
              </span>
            ))}
            <span className="px-4 py-1.5 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 text-xs font-semibold text-gray-200 tracking-wider shadow-lg shadow-black/20">
              {movie.release_date?.split('-')[0]}
            </span>
          </div>

          {logo ? (
            <img 
              src={getImageUrl(logo, 'original')} 
              alt={movie.title}
              className="w-full max-w-[250px] md:max-w-[350px] mb-8 drop-shadow-2xl object-contain object-left"
            />
          ) : (
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter drop-shadow-2xl">
              {movie.title}
            </h1>
          )}
          
          <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed max-w-2xl drop-shadow-md font-medium bg-black/20 p-4 rounded-2xl backdrop-blur-sm border border-white/5">
            {movie.overview}
          </p>
          
          <div className="flex items-center gap-4 mb-12">
            <button 
              onClick={() => {
                setWatchMode(true);
                setTimeout(() => {
                  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                }, 100);
              }}
              className="flex items-center gap-2 bg-white/10 backdrop-blur-2xl border border-white/20 text-white hover:bg-white/20 shadow-[0_4px_30px_rgba(0,0,0,0.1)] hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] px-8 py-3.5 rounded-2xl font-bold text-base transition-all"
            >
              <Play className="w-5 h-5 fill-current" />
              Watch Now
            </button>
            <button className="flex items-center justify-center w-14 h-14 rounded-2xl bg-white/5 backdrop-blur-2xl border border-white/10 text-white hover:bg-white/20 hover:border-white/20 shadow-[0_4px_30px_rgba(0,0,0,0.1)] transition-all">
              <Bookmark className="w-5 h-5" />
            </button>
            <div className="flex items-center justify-center h-14 px-5 rounded-2xl bg-white/5 backdrop-blur-2xl border border-white/10 text-white font-bold text-lg shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
              <Star className="w-4 h-4 text-yellow-500 fill-current mr-2" />
              {movie.vote_average.toFixed(1)}
            </div>
          </div>
        </div>
      </div>

      {/* Actors Section */}
      {cast.length > 0 && (
        <div className="relative z-20  container mx-auto px-4 md:px-12 pb-12">
          <h2 className="text-xl font-bold text-white mb-6">Cast</h2>
          <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide">
            {cast.map((actor: any, index: number) => (
              <div key={`${actor.id}-${index}`} className="w-28 md:w-32 shrink-0 flex flex-col gap-2">
                <div className="w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden bg-[#1a1a1a] border border-white/5">
                  <img 
                    src={actor.profile_path ? getImageUrl(actor.profile_path) : `https://ui-avatars.com/api/?name=${encodeURIComponent(actor.name)}&background=1a1a1a&color=fff`} 
                    alt={actor.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-white line-clamp-1">{actor.name}</p>
                  <p className="text-xs text-gray-500 line-clamp-1">{actor.character}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Video Player Section */}
      {watchMode && (
        <div className="relative z-20  container mx-auto px-4 md:px-12 pb-24 mt-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-2xl font-bold text-white">Stream Source</h2>
            <div className="flex items-center gap-3">
              <select 
                id="source"
                value={selectedSource.id}
                onChange={(e) => setSelectedSource(sources.find(s => s.id === e.target.value) || sources[0])}
                className="bg-white/5 backdrop-blur-md text-white border border-white/10 rounded-lg px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-white/30"
              >
                {sources.map(source => (
                  <option key={source.id} value={source.id} className="bg-[#1a1a1a]">
                    {source.name} {source.isFrench ? '(FR)' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="aspect-video w-full bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-white/20 animate-spin" />
            </div>
            <iframe
              src={iframeUrl}
              className="w-full h-full relative z-10 bg-black"
              allowFullScreen={true}
              webkitallowfullscreen={true}
              mozallowfullscreen={true}
              allow="autoplay; fullscreen *; encrypted-media; picture-in-picture"
              title="Movie Player"
              frameBorder="0"
              scrolling="no"
            />
          </div>
        </div>
      )}
    </div>
  );
}
