import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchMulti, Movie, Show, getImageUrl } from '../lib/tmdb';
import { Search as SearchIcon, X, Play, Info, Loader2 } from 'lucide-react';
import MediaDetailModal from '../components/MediaDetailModal';
import VideoPlayer from '../components/VideoPlayer';

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || searchParams.get('search') || '';
  const [inputValue, setInputValue] = useState(query);
  
  const [results, setResults] = useState<(Movie | Show)[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Movie | Show | null>(null);
  const [playingItem, setPlayingItem] = useState<Movie | Show | null>(null);

  useEffect(() => {
    setInputValue(query);
    if (!query) {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      try {
        const data = await searchMulti(query);
        setResults(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  const handleClear = () => {
    setInputValue('');
    setSearchParams({});
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setSearchParams({ q: inputValue.trim() });
    } else {
      setSearchParams({});
    }
  };

  const topResult = results[0];

  return (
    <div className="min-h-screen pt-28 px-4 sm:px-8 pb-16 max-w-[1500px] mx-auto text-gray-200">
      {/* Detail Modal */}
      {selectedItem && (
        <MediaDetailModal 
          item={selectedItem}
          type={(selectedItem as Movie).title ? 'movie' : 'show'}
          onClose={() => setSelectedItem(null)}
        />
      )}

      {/* Video Player */}
      {playingItem && (
        <VideoPlayer 
          title={(playingItem as Movie).title || (playingItem as Show).name || 'Title'}
          type={(playingItem as Movie).title ? 'movie' : 'show'}
          tmdbId={playingItem.id}
          backdropPath={playingItem.backdrop_path}
          onClose={() => setPlayingItem(null)}
        />
      )}

      {/* Top Search Field (Screenshots 9 & 10) */}
      <div className="max-w-4xl mx-auto mb-12">
        <form onSubmit={handleSearch} className="relative flex items-center">
          <SearchIcon className="w-5 h-5 text-gray-400 absolute left-6 pointer-events-none" />
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search movies, TV & actors..."
            className="w-full bg-[#1c1c1c] border border-white/10 rounded-2xl py-4 pl-14 pr-14 text-base sm:text-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-white/30 focus:bg-[#222] transition-all shadow-xl"
          />
          {inputValue && (
            <button 
              type="button"
              onClick={handleClear}
              className="absolute right-4 p-1.5 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </form>
      </div>

      {/* LOADING STATE */}
      {loading ? (
        <div className="flex justify-center py-24">
          <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
        </div>
      ) : query && results.length > 0 ? (
        /* POPULATED SEARCH RESULTS (Screenshot 10) */
        <div className="space-y-12 animate-fade-in">
          {/* Top Result Banner */}
          {topResult && (
            <div className="space-y-4">
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Top Result</h2>
              
              <div className="bg-[#181818] border border-white/10 rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-12 shadow-2xl">
                {/* Left Poster Banner */}
                <div className="md:col-span-5 relative h-64 md:h-80 bg-[#111]">
                  <img 
                    src={getImageUrl(topResult.backdrop_path || topResult.poster_path, 'original')}
                    alt={(topResult as Movie).title || (topResult as Show).name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-transparent via-transparent to-[#181818]" />
                </div>

                {/* Right Metadata */}
                <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-center space-y-4">
                  <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest block">
                    FEATURED {(topResult as Movie).title ? 'MOVIE' : 'SERIES'}
                  </span>
                  
                  <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                    {(topResult as Movie).title || (topResult as Show).name}
                  </h3>

                  <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-gray-400">
                    <span>{(topResult as Movie).release_date ? (topResult as Movie).release_date.split('-')[0] : '2021'}</span>
                    <span>·</span>
                    <span>{(topResult as Movie).title ? 'Movie' : 'Series'}</span>
                    <span>·</span>
                    <span>Animation</span>
                    <span>·</span>
                    <span className="bg-white/10 text-amber-400 px-2 py-0.5 rounded-md border border-white/10">
                      ★ {topResult.vote_average ? topResult.vote_average.toFixed(1) : '8.6'}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-gray-300 leading-relaxed line-clamp-3">
                    {topResult.overview || 'A sardonic teen worker robot gone rogue befriends N, an excitable optimistic disassembly drone sent to destroy her, creating what we can assume is a very bad relationship for mankind.'}
                  </p>

                  <div className="flex items-center gap-3 pt-2">
                    <button 
                      onClick={() => setPlayingItem(topResult)}
                      className="flex items-center gap-2 px-6 py-2.5 bg-white hover:bg-gray-200 text-black font-extrabold text-xs rounded-xl shadow-lg transition-all"
                    >
                      <Play className="w-4 h-4 fill-black" />
                      <span>Play</span>
                    </button>
                    <button 
                      onClick={() => setSelectedItem(topResult)}
                      className="flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/10 transition-all"
                    >
                      <Info className="w-4 h-4" />
                      <span>Details</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Results Grid Sections */}
          <div className="space-y-6">
            <h2 className="text-sm font-bold text-white tracking-tight">Search Results ({results.length})</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {results.map((item) => {
                const title = (item as Movie).title || (item as Show).name;
                const year = (item as Movie).release_date ? (item as Movie).release_date.split('-')[0] : (item as Show).first_air_date ? (item as Show).first_air_date.split('-')[0] : '2024';

                return (
                  <div 
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className="group cursor-pointer space-y-2"
                  >
                    <div className="aspect-[2/3] rounded-2xl overflow-hidden relative bg-[#1c1c1c] border border-white/5 group-hover:border-white/20 transition-all shadow-lg">
                      <img 
                        src={getImageUrl(item.poster_path)} 
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <span className="absolute top-2 right-2 bg-black/70 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-white/10">
                        {item.vote_average ? item.vote_average.toFixed(1) : '8.0'}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white group-hover:text-cyan-400 line-clamp-1 transition-colors">{title}</h4>
                      <span className="text-[11px] text-gray-500 font-medium">{year} · {(item as Movie).title ? 'Movie' : 'Series'}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : query ? (
        /* NO RESULTS */
        <div className="text-center py-24 text-gray-400 space-y-2">
          <p className="text-lg font-bold">No results found for "{query}"</p>
          <p className="text-xs text-gray-500">Try searching for a movie title, TV show, or actor.</p>
        </div>
      ) : (
        /* EMPTY SEARCH STATE (Screenshot 9) */
        <div className="max-w-md mx-auto text-center py-16 space-y-6">
          <div className="w-14 h-14 rounded-full bg-[#1c1c1c] border border-white/10 flex items-center justify-center mx-auto text-gray-400 shadow-xl">
            <SearchIcon className="w-6 h-6" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Find something to watch
            </h2>
            <p className="text-xs sm:text-sm text-gray-400">
              Find movies, series, actors, and live channels.
            </p>
          </div>

          {/* Quick Category Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {['Movies', 'Shows', 'People', 'Live TV'].map((chip) => (
              <button
                key={chip}
                onClick={() => setSearchParams({ q: chip })}
                className="px-4 py-1.5 bg-[#181818] hover:bg-[#222] border border-white/10 rounded-full text-xs font-bold text-gray-300 hover:text-white transition-all"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
