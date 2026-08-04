import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  PROVIDERS, 
  getChannelMovies, 
  getChannelShows, 
  Movie, 
  Show, 
  getImageUrl 
} from '../lib/tmdb';
import MovieCard from '../components/MovieCard';
import ShowCard from '../components/ShowCard';
import Row from '../components/Row';
import MediaDetailModal from '../components/MediaDetailModal';
import { ChevronLeft, Loader2, Film, Tv, Sparkles, Play, Info } from 'lucide-react';

export default function Channel() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const provider = id ? PROVIDERS[id] : null;

  const [loading, setLoading] = useState(true);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [shows, setShows] = useState<Show[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'movies' | 'shows'>('all');
  const [selectedMedia, setSelectedMedia] = useState<Movie | Show | null>(null);

  useEffect(() => {
    const fetchChannelData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const [moviesRes, showsRes] = await Promise.all([
          getChannelMovies(id, 1),
          getChannelShows(id, 1),
        ]);
        setMovies(moviesRes);
        setShows(showsRes);
      } catch (err) {
        console.error('Failed to load channel content:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchChannelData();
  }, [id]);

  if (!provider) {
    return (
      <div className="min-h-screen bg-[#0a0a0c] text-white flex flex-col items-center justify-center p-6 text-center pt-24">
        <h1 className="text-3xl font-bold mb-4">Channel Not Found</h1>
        <button 
          onClick={() => navigate('/')} 
          className="px-6 py-2.5 bg-white text-black font-bold rounded-full transition-all hover:scale-105 cursor-pointer"
        >
          Return Home
        </button>
      </div>
    );
  }

  const heroItem = shows.length > 0 ? shows[0] : (movies.length > 0 ? movies[0] : null);

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white pt-20 pb-20 select-none">
      {/* Media Detail Modal */}
      {selectedMedia && (
        <MediaDetailModal 
          item={selectedMedia} 
          type={'title' in selectedMedia ? 'movie' : 'show'} 
          onClose={() => setSelectedMedia(null)} 
        />
      )}

      {/* Floating Back Arrow */}
      <button
        onClick={() => navigate(-1)}
        className="fixed top-5 left-5 z-50 bg-[#1e1e22]/80 hover:bg-[#28282e] text-white p-2.5 rounded-full border border-white/15 backdrop-blur-md cursor-pointer transition-all shadow-2xl hover:scale-105"
        title="Go Back"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Channel Header Banner */}
      <div className="relative w-full max-w-[1700px] mx-auto px-4 sm:px-8 pt-4 pb-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#14141a] via-[#1a1a24] to-[#101014] border border-white/10 p-6 sm:p-10 shadow-2xl">
          {/* Subtle Background Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-black/60 border border-white/20 flex items-center justify-center p-3 shadow-2xl shrink-0">
                <img
                  src={provider.logoUrl}
                  alt={provider.name}
                  referrerPolicy="no-referrer"
                  className="max-h-12 w-auto object-contain filter brightness-0 invert drop-shadow-lg"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/15 text-[10px] font-bold tracking-wider uppercase text-gray-300">
                    Channel & App
                  </span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                  {provider.name}
                </h1>
                <p className="text-gray-400 text-xs sm:text-sm max-w-xl line-clamp-2">
                  {provider.description}
                </p>
              </div>
            </div>

            {/* Filter Pill Tabs */}
            <div className="flex items-center gap-2 bg-black/40 border border-white/10 p-1.5 rounded-full backdrop-blur-md self-stretch md:self-auto justify-center">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'all'
                    ? 'bg-white text-black shadow-lg'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveTab('shows')}
                className={`flex items-center gap-1.5 px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'shows'
                    ? 'bg-white text-black shadow-lg'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Tv className="w-3.5 h-3.5" />
                <span>TV Shows</span>
              </button>
              <button
                onClick={() => setActiveTab('movies')}
                className={`flex items-center gap-1.5 px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'movies'
                    ? 'bg-white text-black shadow-lg'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Film className="w-3.5 h-3.5" />
                <span>Movies</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-32">
          <Loader2 className="w-10 h-10 text-white animate-spin" />
        </div>
      ) : (
        <div className="max-w-[1700px] mx-auto px-4 sm:px-8 space-y-10">
          {/* Featured Hero Banner for the Provider */}
          {heroItem && activeTab === 'all' && (
            <div className="relative w-full h-[400px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-black">
              <img
                src={getImageUrl(heroItem.backdrop_path || heroItem.poster_path, 'original')}
                alt={'name' in heroItem ? heroItem.name : heroItem.title}
                className="w-full h-full object-cover filter brightness-75"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-black/40 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent" />

              <div className="absolute bottom-8 left-8 right-8 z-10 max-w-2xl space-y-3">
                <span className="px-3 py-1 bg-white/20 border border-white/30 rounded-full text-[11px] font-bold text-white tracking-wider uppercase backdrop-blur-md">
                  Featured on {provider.name}
                </span>
                <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight drop-shadow-xl">
                  {'name' in heroItem ? heroItem.name : heroItem.title}
                </h2>
                <p className="text-gray-300 text-xs sm:text-sm line-clamp-2 font-medium">
                  {heroItem.overview}
                </p>
                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => setSelectedMedia(heroItem)}
                    className="flex items-center gap-2 px-6 py-2.5 bg-white hover:bg-gray-200 text-black font-extrabold text-xs sm:text-sm rounded-full transition-all shadow-xl hover:scale-105 cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-black text-black" />
                    <span>Watch Now</span>
                  </button>
                  <button
                    onClick={() => setSelectedMedia(heroItem)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs sm:text-sm rounded-full transition-all backdrop-blur-md cursor-pointer"
                  >
                    <Info className="w-4 h-4" />
                    <span>More Info</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tab Views */}
          {activeTab === 'all' && (
            <>
              {/* TV Shows Row */}
              {shows.length > 0 && (
                <div className="space-y-4">
                  <Row title={`Popular Series on ${provider.name}`} items={shows} />
                </div>
              )}

              {/* Movies Row */}
              {movies.length > 0 && (
                <div className="space-y-4">
                  <Row title={`Popular Movies on ${provider.name}`} items={movies} />
                </div>
              )}
            </>
          )}

          {activeTab === 'shows' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white tracking-tight">
                All TV Series on {provider.name}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
                {shows.map((show) => (
                  <div key={show.id}>
                    <ShowCard show={show} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'movies' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white tracking-tight">
                All Movies on {provider.name}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
                {movies.map((movie) => (
                  <div key={movie.id}>
                    <MovieCard movie={movie} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
