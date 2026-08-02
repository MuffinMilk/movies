import React, { useState, useEffect } from 'react';
import { 
  X, Play, Star, Share2, Film, MessageSquare, Eye, EyeOff,
  Facebook, Twitter, Send, Globe, Check, ExternalLink
} from 'lucide-react';
import { Movie, Show, getImageUrl, getRecommendations, getMediaLogo, getMovieDetails, getShowDetails } from '../lib/tmdb';
import VideoPlayer from './VideoPlayer';

interface MediaDetailModalProps {
  item: Movie | Show | null;
  type: 'movie' | 'show';
  onClose: () => void;
}

export default function MediaDetailModal({ item, type, onClose }: MediaDetailModalProps) {
  const [activeItem, setActiveItem] = useState<Movie | Show | null>(item);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [showTrailerModal, setShowTrailerModal] = useState(false);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [showSpoilers, setShowSpoilers] = useState(true);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setActiveItem(item);
  }, [item]);

  useEffect(() => {
    const fetchFullDetails = async () => {
      if (!activeItem) return;
      try {
        if (type === 'movie') {
          const details = await getMovieDetails(activeItem.id.toString());
          const logo = details.images?.logos?.[0]?.file_path;
          if (logo) setLogoUrl(logo);
          const trailer = details.videos?.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube')
            || details.videos?.results?.find(v => v.site === 'YouTube');
          if (trailer) setTrailerKey(trailer.key);
        } else {
          const details = await getShowDetails(activeItem.id.toString());
          const logo = details.images?.logos?.[0]?.file_path;
          if (logo) setLogoUrl(logo);
          const trailer = details.videos?.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube')
            || details.videos?.results?.find(v => v.site === 'YouTube');
          if (trailer) setTrailerKey(trailer.key);
        }
      } catch (err) {
        console.error('Failed to fetch media details/logo:', err);
      }
    };

    fetchFullDetails();
  }, [activeItem, type]);

  useEffect(() => {
    const fetchRecs = async () => {
      if (!activeItem) return;
      try {
        const data = await getRecommendations(activeItem.id, type);
        setRecommendations(data.filter(r => r.poster_path).slice(0, 6));
      } catch (err) {
        console.error(err);
      }
    };
    fetchRecs();
  }, [activeItem, type]);

  if (!activeItem) return null;

  const currentItem = activeItem;
  const title = (currentItem as Movie).title || (currentItem as Show).name || 'Title';
  const releaseYear = (currentItem as Movie).release_date 
    ? (currentItem as Movie).release_date.split('-')[0] 
    : (currentItem as Show).first_air_date 
    ? (currentItem as Show).first_air_date.split('-')[0] 
    : '2026';
  const rating = currentItem.vote_average ? currentItem.vote_average.toFixed(1) : '8.1';

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isPlayingVideo) {
    return (
      <VideoPlayer 
        title={title}
        type={type}
        tmdbId={currentItem.id}
        backdropPath={currentItem.backdrop_path || undefined}
        posterPath={currentItem.poster_path || undefined}
        onClose={() => setIsPlayingVideo(false)}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Modal Container */}
      <div className="bg-[#121212] border border-white/10 rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto scrollbar-hide shadow-2xl relative animate-scale-up text-gray-200">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-black/70 hover:bg-white/20 text-white flex items-center justify-center transition-all border border-white/15 backdrop-blur-md"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Backdrop Banner */}
        <div className="relative w-full h-80 sm:h-[420px] overflow-hidden rounded-t-3xl">
          <img 
            src={getImageUrl(currentItem.backdrop_path || currentItem.poster_path, 'original')}
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/50 to-transparent" />

          {/* Title Logo & Play Overlay */}
          <div className="absolute bottom-6 left-6 right-6 space-y-4 z-10">
            {/* Original Photo Logo or Styled Title */}
            {logoUrl ? (
              <img 
                src={getImageUrl(logoUrl, 'original')} 
                alt={title}
                className="max-h-20 sm:max-h-28 max-w-[260px] sm:max-w-[380px] object-contain object-left drop-shadow-[0_10px_20px_rgba(0,0,0,0.9)] mb-2"
              />
            ) : (
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tighter uppercase drop-shadow-2xl mb-2">
                {title}
              </h1>
            )}

            {/* Pill Action Badges Row */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button 
                onClick={() => setIsPlayingVideo(true)}
                className="flex items-center gap-2 px-6 py-2.5 bg-white hover:bg-gray-200 text-black font-extrabold text-sm rounded-full transition-all shadow-2xl hover:scale-105 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-black" />
                <span>Play</span>
              </button>

              <span className="px-3 py-1.5 bg-[#202020]/90 text-gray-200 font-bold text-xs rounded-full border border-white/10 shadow-md">
                {releaseYear}
              </span>

              <span className="px-3 py-1.5 bg-[#202020]/90 text-gray-200 font-bold text-xs rounded-full border border-white/10 shadow-md flex items-center gap-1">
                IMDb <span className="text-amber-400 font-black">{rating}</span>
              </span>

              {trailerKey && (
                <button 
                  onClick={() => setShowTrailerModal(true)}
                  className="px-3.5 py-1.5 bg-[#202020]/90 hover:bg-[#303030] text-gray-200 font-bold text-xs rounded-full border border-white/10 flex items-center gap-1.5 transition-all shadow-md"
                >
                  <Film className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Trailer</span>
                </button>
              )}

              <button 
                onClick={handleShare}
                className="px-3.5 py-1.5 bg-[#202020]/90 hover:bg-[#303030] text-gray-200 font-bold text-xs rounded-full border border-white/10 flex items-center gap-1.5 transition-all shadow-md"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Share'}</span>
              </button>
            </div>

            {/* Social Sharing Icons Row */}
            <div className="flex items-center gap-2 pt-1">
              {[
                { name: 'Facebook', icon: Facebook, href: `https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}` },
                { name: 'X', icon: Twitter, href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}` },
                { name: 'Telegram', icon: Send, href: `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}` },
                { name: 'Web', icon: Globe, href: window.location.href },
              ].map((s) => {
                const Icon = s.icon;
                return (
                  <a 
                    key={s.name} 
                    href={s.href} 
                    target="_blank" 
                    rel="noreferrer"
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white flex items-center justify-center transition-all border border-white/5"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Main Body */}
        <div className="p-6 sm:p-8 space-y-8">
          {/* Overview */}
          <div className="space-y-2">
            <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-normal">
              {currentItem.overview || 'When an unexpected and ruthless adversary strikes too close to home, an epic journey unfolds across unknown worlds in search of justice and truth.'}
            </p>
          </div>

          {/* Awdrex Ratings Box (Matches Screenshot) */}
          <div className="bg-[#181818] border border-white/10 rounded-2xl p-5 space-y-4 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4.5 h-4.5 text-cyan-400" />
                <span className="font-bold text-white text-sm tracking-wide">Awdrex Ratings</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-gray-300 block">No ratings yet</span>
                <span className="text-[10px] text-gray-500 block">0 ratings</span>
              </div>
            </div>

            <button className="px-3.5 py-1.5 bg-[#222222] hover:bg-[#2e2e2e] text-xs font-bold text-gray-200 rounded-xl transition-all border border-white/5 flex items-center gap-1.5">
              <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
              <span>Open full discussion</span>
            </button>

            {/* Spoilers Toggle & Rating Stars */}
            <div className="pt-3 border-t border-white/5 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white">Spoiler warning</span>
                  <span className="text-[10px] text-gray-400">Spoiler comments are visible by default on this browser.</span>
                </div>
                <button 
                  onClick={() => setShowSpoilers(!showSpoilers)}
                  className="flex items-center gap-1.5 px-3 py-1 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold text-gray-200 transition-colors shrink-0"
                >
                  {showSpoilers ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span>{showSpoilers ? 'Spoilers visible' : 'Spoilers hidden'}</span>
                </button>
              </div>

              {/* Star Rating Input */}
              <div className="flex items-center gap-2 pt-1">
                <span className="text-xs text-gray-400 font-semibold mr-1">Rate this:</span>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button 
                    key={star} 
                    onClick={() => setUserRating(star)}
                    className="p-1 text-gray-600 hover:text-amber-400 transition-colors"
                  >
                    <Star className={`w-5 h-5 ${star <= userRating ? 'fill-amber-400 text-amber-400' : ''}`} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Detailed Metadata Table */}
          <div className="bg-[#181818] border border-white/10 rounded-2xl overflow-hidden divide-y divide-white/5 text-xs">
            {[
              { label: 'Original language', value: 'English' },
              { label: 'Type', value: type === 'movie' ? 'Feature Film (4K HDR)' : 'TV Series (Complete)' },
              { label: 'Release date', value: releaseYear },
              { label: 'Quality', value: '4K Ultra HD (DULO AI Engine)' },
            ].map((row) => (
              <div key={row.label} className="flex justify-between p-3.5">
                <span className="text-gray-400 font-medium">{row.label}</span>
                <span className="text-white font-bold text-right">{row.value}</span>
              </div>
            ))}
          </div>

          {/* More Like This Row */}
          <div className="space-y-3">
            <h3 className="font-bold text-white text-base tracking-tight">More like this</h3>
            {recommendations.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                {recommendations.map((rec) => {
                  const recTitle = rec.title || rec.name || 'Title';
                  const matchScore = `${Math.round((rec.vote_average || 7.5) * 10)}%`;
                  return (
                    <div 
                      key={rec.id} 
                      onClick={() => {
                        setActiveItem(rec);
                        setLogoUrl(null);
                        setTrailerKey(null);
                      }}
                      className="group cursor-pointer space-y-1.5"
                    >
                      <div className="aspect-[2/3] rounded-xl overflow-hidden relative bg-[#222] border border-white/5 group-hover:border-white/20 transition-all">
                        <img 
                          src={getImageUrl(rec.poster_path)} 
                          alt={recTitle} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                        />
                        <span className="absolute bottom-1 left-1 bg-black/80 text-[10px] font-black text-emerald-400 px-1.5 py-0.5 rounded border border-white/10">
                          {matchScore}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-gray-300 group-hover:text-white line-clamp-1 block">
                        {recTitle}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-xs text-gray-500 italic py-2">Loading similar titles...</div>
            )}
          </div>
        </div>
      </div>

      {/* Trailer Modal */}
      {showTrailerModal && trailerKey && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10">
            <button 
              onClick={() => setShowTrailerModal(false)}
              className="absolute top-3 right-3 z-20 p-2 rounded-full bg-black/70 text-white hover:bg-white/20"
            >
              <X className="w-5 h-5" />
            </button>
            <iframe 
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
              title="Trailer"
              className="w-full h-full"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  );
}
