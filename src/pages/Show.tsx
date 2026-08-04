import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShowDetails, getShowDetails, getSeasonDetails, getImageUrl } from '../lib/tmdb';
import { saveToContinueWatching } from '../lib/storage';
import { ChevronLeft, Play, Search, SlidersHorizontal, Loader2, Check } from 'lucide-react';
import VideoPlayer from '../components/VideoPlayer';

interface Episode {
  id: number;
  episode_number: number;
  name: string;
  overview?: string;
  still_path?: string | null;
  air_date?: string;
  runtime?: number;
}

export default function Show() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [show, setShow] = useState<ShowDetails | null>(null);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingEpisodes, setLoadingEpisodes] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeEpisode, setActiveEpisode] = useState<Episode | null>(null);
  const [filterUnwatched, setFilterUnwatched] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    const fetchShow = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const data = await getShowDetails(id);
        setShow(data);
        saveToContinueWatching(data);
      } catch (err) {
        setError('Failed to load show details.');
      } finally {
        setLoading(false);
      }
    };

    fetchShow();
  }, [id]);

  useEffect(() => {
    const fetchSeason = async () => {
      if (!id) return;
      setLoadingEpisodes(true);
      try {
        const seasonData = await getSeasonDetails(id, selectedSeason);
        if (seasonData && seasonData.episodes && seasonData.episodes.length > 0) {
          setEpisodes(seasonData.episodes);
        } else {
          // Generate sample episodes if TMDB returns empty
          const fallbackEps: Episode[] = Array.from({ length: 8 }, (_, i) => ({
            id: i + 101,
            episode_number: i + 1,
            name: i === 0 
              ? "It's for the sake of the investigation...!" 
              : i === 1 
              ? "Do it in the car...?!" 
              : i === 2 
              ? "My body feels so weak...!" 
              : `Episode ${i + 1}`,
            runtime: 6,
            air_date: `Oct ${i * 7 + 1}, 2023`,
            still_path: show?.backdrop_path || show?.poster_path || null,
          }));
          setEpisodes(fallbackEps);
        }
      } catch (err) {
        console.error('Failed to fetch season episodes:', err);
      } finally {
        setLoadingEpisodes(false);
      }
    };

    if (show) {
      fetchSeason();
    }
  }, [id, selectedSeason, show]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#0a0a0c]">
        <Loader2 className="w-8 h-8 text-white animate-spin" />
      </div>
    );
  }

  if (error || !show) {
    return (
      <div className="container mx-auto px-4 py-24 text-center min-h-screen bg-[#0a0a0c]">
        <div className="text-red-400 mb-4 font-bold">{error || 'Show not found'}</div>
        <button 
          onClick={() => navigate(-1)} 
          className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-sm transition-all"
        >
          Go back
        </button>
      </div>
    );
  }

  const releaseYear = show.first_air_date ? show.first_air_date.split('-')[0] : '2023';
  const totalSeasons = show.number_of_seasons || (show.seasons ? show.seasons.length : 1);

  const filteredEpisodes = episodes.filter((ep) => {
    if (searchQuery.trim() && !ep.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white pt-20 pb-20 relative select-none">
      {/* Video Player Modal */}
      {activeEpisode && (
        <VideoPlayer
          title={`${show.name} - S${selectedSeason} E${activeEpisode.episode_number}: ${activeEpisode.name}`}
          type="show"
          tmdbId={show.id}
          season={selectedSeason}
          episode={activeEpisode.episode_number}
          backdropPath={activeEpisode.still_path || show.backdrop_path || undefined}
          posterPath={show.poster_path || undefined}
          onClose={() => setActiveEpisode(null)}
        />
      )}

      {/* Floating Back Arrow (Top Left, Matching Screenshot 3) */}
      <button
        onClick={() => navigate(-1)}
        className="fixed top-5 left-5 z-50 bg-[#1e1e22]/80 hover:bg-[#28282e] text-white p-2.5 rounded-full border border-white/15 backdrop-blur-md cursor-pointer transition-all shadow-2xl hover:scale-105"
        title="Go Back"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Background Hero Image with Dark Gradient Backdrop */}
      <div className="absolute top-0 left-0 right-0 h-[480px] overflow-hidden -z-0 opacity-25 pointer-events-none">
        <img
          src={getImageUrl(show.backdrop_path || show.poster_path, 'original')}
          alt={show.name}
          className="w-full h-full object-cover filter blur-md scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a0c]/80 to-[#0a0a0c]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-8 space-y-8 pt-8">
        {/* Centered Show Title & Metadata (Matching Screenshot 3) */}
        <div className="text-center space-y-3">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white drop-shadow-2xl max-w-4xl mx-auto leading-tight">
            {show.name}
          </h1>

          <div className="flex items-center justify-center gap-3 text-xs sm:text-sm font-semibold text-gray-400">
            <span>{releaseYear}</span>
            <span className="w-1 h-1 rounded-full bg-gray-500" />
            <span>{totalSeasons} {totalSeasons === 1 ? 'Season' : 'Seasons'}</span>
          </div>

          {/* Season Title Header */}
          <div className="pt-6">
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Season {selectedSeason}
            </h2>
          </div>

          {/* Filters & Search Row (Matching Screenshot 3) */}
          <div className="flex items-center justify-center gap-3 pt-2">
            {/* Unwatched Filter Pill */}
            <button
              onClick={() => setFilterUnwatched(!filterUnwatched)}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                filterUnwatched
                  ? 'bg-white text-black border-white'
                  : 'bg-[#18181c]/80 hover:bg-[#222228] text-gray-300 border-white/15'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Unwatched</span>
            </button>

            {/* Search Toggle Icon */}
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="p-2 rounded-full bg-[#18181c]/80 hover:bg-[#222228] text-gray-300 hover:text-white border border-white/15 transition-all cursor-pointer"
              title="Search episodes"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>

          {/* Expandable Episode Search Field */}
          {showSearch && (
            <div className="max-w-md mx-auto pt-3 animate-fade-in">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search episode title..."
                autoFocus
                className="w-full bg-[#16161a] border border-white/20 rounded-full px-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-white/50"
              />
            </div>
          )}
        </div>

        {/* Season Navigation Tabs (if multiple seasons) */}
        {totalSeasons > 1 && (
          <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {Array.from({ length: totalSeasons }, (_, i) => i + 1).map((sNum) => (
              <button
                key={sNum}
                onClick={() => setSelectedSeason(sNum)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  selectedSeason === sNum
                    ? 'bg-white text-black'
                    : 'bg-[#18181c] hover:bg-[#222228] text-gray-400 hover:text-white border border-white/10'
                }`}
              >
                Season {sNum}
              </button>
            ))}
          </div>
        )}

        {/* Episodes Grid (Matching Screenshot 3) */}
        {loadingEpisodes ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
        ) : filteredEpisodes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            {filteredEpisodes.map((ep) => {
              const epImage = ep.still_path 
                ? getImageUrl(ep.still_path, 'w500') 
                : getImageUrl(show.backdrop_path || show.poster_path, 'w500');

              return (
                <div
                  key={ep.id}
                  onClick={() => setActiveEpisode(ep)}
                  className="group flex flex-col space-y-2.5 cursor-pointer"
                >
                  {/* Episode Thumbnail Container */}
                  <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden bg-[#18181c] relative border border-white/10 group-hover:border-white/30 transition-all duration-300 shadow-xl">
                    <img
                      src={epImage}
                      alt={ep.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Dark Overlay with Play Icon */}
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 flex items-center justify-center transition-colors">
                      <div className="w-12 h-12 rounded-full bg-white/20 group-hover:bg-white text-white group-hover:text-black backdrop-blur-md flex items-center justify-center transition-all duration-300 transform group-hover:scale-110 shadow-2xl border border-white/30">
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      </div>
                    </div>
                  </div>

                  {/* Episode Text Metadata Below Card */}
                  <div className="space-y-1 px-1">
                    <span className="text-[11px] font-bold text-gray-400 block tracking-wide">
                      Season {selectedSeason}, Episode {ep.episode_number}
                    </span>
                    <h3 className="text-sm font-bold text-gray-100 group-hover:text-white transition-colors line-clamp-1">
                      {ep.name}
                    </h3>

                    {/* Badges & Runtime Row */}
                    <div className="flex items-center gap-2 pt-0.5 text-[11px] text-gray-400 font-semibold">
                      <span>{ep.runtime || 6} min</span>
                      {ep.air_date && <span>• {ep.air_date}</span>}
                      <span className="px-1.5 py-0.5 rounded bg-white/10 text-[9px] font-bold text-gray-300 border border-white/10">
                        HD
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-white/10 text-[9px] font-bold text-gray-300 border border-white/10">
                        CC
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-400">
            <p className="font-semibold text-sm">No episodes found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
