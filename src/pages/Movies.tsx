import React, { useState, useEffect } from 'react';
import { getPopularMovies, Movie, getImageUrl } from '../lib/tmdb';
import { Film, Flame, Star, Ticket, Calendar, Play } from 'lucide-react';
import MediaDetailModal from '../components/MediaDetailModal';

export default function Movies() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All Movies');
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const data = await getPopularMovies();
        setMovies(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [activeCategory]);

  const categories = [
    { name: 'All Movies', icon: Film },
    { name: 'Popular', icon: Flame },
    { name: 'Top Rated', icon: Star },
    { name: 'In Theaters', icon: Ticket },
    { name: 'Coming Soon', icon: Calendar },
  ];

  const genres = [
    'Action & Adventure', 'Animation', 'Comedy', 'Crime',
    'Documentary', 'Drama', 'Family', 'Fantasy', 'Horror',
    'Mystery', 'Romance', 'Sci-Fi', 'Thriller'
  ];

  return (
    <div className="min-h-screen pt-24 px-4 sm:px-8 pb-12 max-w-[1800px] mx-auto flex flex-col md:flex-row gap-8">
      {/* Detail Modal */}
      {selectedMovie && (
        <MediaDetailModal 
          item={selectedMovie} 
          type="movie" 
          onClose={() => setSelectedMovie(null)} 
        />
      )}

      {/* Left Filter Sidebar (Screenshot 5) */}
      <div className="w-full md:w-60 shrink-0 space-y-6">
        <div className="space-y-1">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.name;
            return (
              <button
                key={cat.name}
                onClick={() => setActiveCategory(cat.name)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all ${
                  isActive 
                    ? 'bg-white/20 text-white shadow-md' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Genres List */}
        <div className="space-y-1 pt-4 border-t border-white/10">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block px-4 mb-2">
            Genres
          </span>
          {genres.map((g) => (
            <button
              key={g}
              onClick={() => setActiveCategory(g)}
              className={`w-full text-left px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeCategory === g ? 'text-white bg-white/10' : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Wall */}
      <div className="flex-1 space-y-6">
        {/* Header Title Row */}
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">{activeCategory}</h1>
            <p className="text-xs text-gray-400 font-medium mt-1">
              A broad wall of movies worth browsing.
            </p>
          </div>
          <span className="bg-white/10 text-gray-300 font-bold text-xs px-3 py-1 rounded-full border border-white/10">
            {movies.length > 0 ? `${movies.length * 7} titles` : '140 titles'}
          </span>
        </div>

        {/* Movies Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="aspect-[2/3] bg-white/5 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {movies.map((movie) => {
              const releaseYear = movie.release_date ? movie.release_date.split('-')[0] : '2026';
              const rating = movie.vote_average ? movie.vote_average.toFixed(1) : '8.0';

              return (
                <div 
                  key={movie.id}
                  onClick={() => setSelectedMovie(movie)}
                  className="group relative cursor-pointer outline-none"
                >
                  <div className="aspect-[2/3] w-full overflow-hidden relative rounded-2xl bg-[#1a1a1a] border border-white/5 group-hover:border-white/20 transition-all shadow-lg">
                    <img 
                      src={getImageUrl(movie.poster_path)} 
                      alt={movie.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Play Hover Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                        <Play className="w-5 h-5 fill-white text-white ml-0.5" />
                      </div>
                    </div>
                  </div>

                  <div className="mt-2.5 space-y-0.5 px-0.5">
                    <h3 className="text-sm font-bold text-white group-hover:text-cyan-400 line-clamp-1 transition-colors">
                      {movie.title}
                    </h3>
                    <p className="text-xs text-gray-400 font-medium">
                      {releaseYear} · <span className="text-amber-400">★ {rating}</span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
