import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { Movie, Show, getImageUrl, getMediaLogo } from '../lib/tmdb';

interface LandscapeRowProps {
  items: (Movie | Show)[];
}

function LandscapeCard({ item }: { item: Movie | Show; key?: React.Key }) {
  const isMovie = 'title' in item;
  const title = isMovie ? (item as Movie).title : (item as Show).name;
  const backdrop = item.backdrop_path || item.poster_path;
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    getMediaLogo(item.id, isMovie ? 'movie' : 'show').then((logo) => {
      if (isMounted && logo) setLogoUrl(logo);
    });
    return () => { isMounted = false; };
  }, [item.id, isMovie]);

  return (
    <Link
      to={`/${isMovie ? 'movie' : 'show'}/${item.id}`}
      className="group relative flex-none w-[190px] sm:w-[240px] md:w-[270px] aspect-[16/9] rounded-2xl overflow-hidden bg-[#181818] border border-white/10 hover:border-white/30 transition-all duration-300 hover:scale-[1.03] shadow-xl snap-start cursor-pointer"
    >
      <img
        src={getImageUrl(backdrop, 'w500')}
        alt={title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />

      <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2 z-10">
        {logoUrl ? (
          <img 
            src={getImageUrl(logoUrl, 'w500')} 
            alt={title}
            className="max-h-8 sm:max-h-10 max-w-[130px] sm:max-w-[170px] object-contain object-left drop-shadow-[0_4px_8px_rgba(0,0,0,0.95)]"
          />
        ) : (
          <span className="text-xs sm:text-sm font-extrabold text-white drop-shadow-md tracking-tight line-clamp-1 uppercase">
            {title}
          </span>
        )}
        
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <Play className="w-3.5 h-3.5 text-white fill-white ml-0.5" />
        </div>
      </div>
    </Link>
  );
}

export default function LandscapeRow({ items }: LandscapeRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth * 0.75 : scrollLeft + clientWidth * 0.75;
      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  if (!items || items.length === 0) return null;

  return (
    <div className="mb-8 relative group">
      <div className="flex items-center justify-between mb-3 px-1">
        <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
          Featured
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleScroll('left')}
            className="bg-[#1a1a1a] hover:bg-[#2a2a2a] border border-white/5 p-1.5 rounded-full text-gray-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleScroll('right')}
            className="bg-[#1a1a1a] hover:bg-[#2a2a2a] border border-white/5 p-1.5 rounded-full text-gray-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div
        ref={rowRef}
        className="flex items-center gap-3.5 overflow-x-auto scrollbar-hide pb-2 snap-x"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {items.map((item) => (
          <LandscapeCard key={`${'title' in item ? 'm' : 's'}-${item.id}`} item={item} />
        ))}
      </div>
    </div>
  );
}
