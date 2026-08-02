import React, { useState, useEffect } from 'react';
import { Star, Flame, Trophy, Tv, Calendar, Search as SearchIcon, Play, Film, Sparkles } from 'lucide-react';
import MediaDetailModal from '../components/MediaDetailModal';
import { getAllAnimeAllPages, getAnimeMovies, Show, Movie, getImageUrl } from '../lib/tmdb';

export default function Anime() {
  const [activeCategory, setActiveCategory] = useState('All Anime');
  const [searchQuery, setSearchQuery] = useState('');
  const [animeList, setAnimeList] = useState<(Show | Movie)[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnime, setSelectedAnime] = useState<Show | Movie | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchAnimeData = async () => {
      setLoading(true);
      try {
        let items: (Show | Movie)[] = [];
        if (activeCategory === 'Movies') {
          items = await getAnimeMovies(1);
        } else if (activeCategory === 'All Anime') {
          items = await getAllAnimeAllPages(5, activeCategory);
        } else {
          items = await getAllAnimeAllPages(3, activeCategory);
        }
        if (isMounted) {
          setAnimeList(items);
        }
      } catch (err) {
        console.error('Error fetching anime:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchAnimeData();
    return () => { isMounted = false; };
  }, [activeCategory]);

  const categories = [
    { name: 'All Anime', icon: Star },
    { name: 'Trending', icon: Flame },
    { name: 'Top Rated', icon: Trophy },
    { name: 'Airing Now', icon: Tv },
    { name: 'Movies', icon: Film },
    { name: 'Upcoming', icon: Calendar },
  ];

  const genres = [
    'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy',
    'Romance', 'Sci-Fi', 'Slice of Life', 'Sports', 'Supernatural'
  ];

  const filtered = animeList.filter((a) => {
    const title = 'name' in a ? a.name : a.title;
    return title.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="min-h-screen pt-24 px-4 sm:px-8 pb-12 max-w-[1800px] mx-auto flex flex-col md:flex-row gap-8">
      {/* Detail Modal */}
      {selectedAnime && (
        <MediaDetailModal 
          item={selectedAnime} 
          type={'name' in selectedAnime ? 'show' : 'movie'} 
          onClose={() => setSelectedAnime(null)} 
        />
      )}

      {/* Left Filter Sidebar */}
      <div className="w-full md:w-60 shrink-0 space-y-6">
        <div className="space-y-1">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.name;
            return (
              <button
                key={cat.name}
                onClick={() => setActiveCategory(cat.name)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                  isActive 
                    ? 'bg-white/20 text-white shadow-md border border-white/20' 
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
              className={`w-full text-left px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeCategory === g ? 'text-white bg-white/15 border border-white/10' : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 space-y-6">
        {/* Top Title & Search Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">{activeCategory}</h1>
              <span className="bg-white/10 text-cyan-300 font-bold text-xs px-3 py-1 rounded-full border border-white/10">
                {filtered.length} anime titles
              </span>
            </div>
            <p className="text-xs text-gray-400 font-medium mt-1">
              {activeCategory === 'All Anime' ? 'Browsing the complete catalog of popular anime series.' : `Showing ${activeCategory} anime titles.`}
            </p>
          </div>

          {/* Search Anime Input Box */}
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search anime..."
              className="w-full bg-[#181818] border border-white/10 rounded-2xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 transition-all shadow-md"
            />
            <SearchIcon className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Anime Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 18 }).map((_, i) => (
              <div key={i} className="aspect-[2/3] bg-white/5 rounded-2xl animate-pulse border border-white/5" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center space-y-3 bg-white/5 rounded-3xl border border-white/10">
            <Sparkles className="w-10 h-10 text-gray-500 mx-auto" />
            <p className="text-lg font-bold text-white">No anime found</p>
            <p className="text-xs text-gray-400">Try searching with a different keyword or selecting another category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filtered.map((anime) => {
              const name = 'name' in anime ? anime.name : anime.title;
              const year = ('first_air_date' in anime && anime.first_air_date) 
                ? anime.first_air_date.split('-')[0] 
                : ('release_date' in anime && anime.release_date) ? anime.release_date.split('-')[0] : '2023';
              const rating = anime.vote_average ? anime.vote_average.toFixed(1) : '8.5';
              const posterUrl = getImageUrl(anime.poster_path);

              return (
                <div 
                  key={anime.id}
                  onClick={() => setSelectedAnime(anime)}
                  className="group relative cursor-pointer outline-none"
                >
                  <div className="aspect-[2/3] w-full overflow-hidden relative rounded-2xl bg-[#1a1a1a] border border-white/5 group-hover:border-white/30 transition-all shadow-lg">
                    <img 
                      src={posterUrl} 
                      alt={name}
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=500&q=80';
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Play Hover Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-2xl">
                        <Play className="w-5 h-5 fill-white text-white ml-0.5" />
                      </div>
                    </div>
                  </div>

                  <div className="mt-2.5 px-0.5">
                    <h3 className="text-sm font-bold text-white group-hover:text-cyan-400 line-clamp-1 transition-colors">
                      {name}
                    </h3>
                    <p className="text-xs text-gray-400 font-medium mt-0.5">
                      {year} · <span className="text-amber-400 font-semibold">★ {rating}</span>
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
