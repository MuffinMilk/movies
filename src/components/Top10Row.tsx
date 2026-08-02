import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { Movie, Show, getImageUrl } from '../lib/tmdb';

interface Top10RowProps {
  title: string;
  items: (Movie | Show)[];
}

export default function Top10Row({ title, items }: Top10RowProps) {
  const rowRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth * 0.75 : scrollLeft + clientWidth * 0.75;
      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  const top10 = items.slice(0, 10);
  if (!top10 || top10.length === 0) return null;

  return (
    <div className="mb-10 relative group">
      <div className="flex items-center justify-between mb-4 px-1">
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          {title}
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleScroll('left')}
            className="bg-[#1a1a1a] hover:bg-[#2a2a2a] border border-white/5 p-2 rounded-full text-gray-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleScroll('right')}
            className="bg-[#1a1a1a] hover:bg-[#2a2a2a] border border-white/5 p-2 rounded-full text-gray-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div
        ref={rowRef}
        className="flex items-center gap-6 overflow-x-auto scrollbar-hide pb-6 pt-2 snap-x"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {top10.map((item, index) => {
          const isMovie = 'title' in item;
          const itemTitle = isMovie ? (item as Movie).title : (item as Show).name;
          const rank = index + 1;

          return (
            <Link
              key={`${isMovie ? 'm' : 's'}-${item.id}`}
              to={`/${isMovie ? 'movie' : 'show'}/${item.id}`}
              className="group relative flex items-end flex-none snap-start cursor-pointer transition-transform duration-300 hover:scale-105"
            >
              {/* Giant Rank Number */}
              <div 
                className="select-none font-black text-8xl md:text-9xl leading-none text-transparent tracking-tighter -mr-8 z-0 transition-colors duration-300 group-hover:text-white/10"
                style={{
                  WebkitTextStroke: '2px rgba(255, 255, 255, 0.25)',
                  fontFamily: 'system-ui, sans-serif'
                }}
              >
                {rank}
              </div>

              {/* Poster Card */}
              <div className="w-[140px] sm:w-[170px] md:w-[190px] flex-none z-10 flex flex-col">
                <div className="aspect-[2/3] w-full rounded-2xl overflow-hidden relative bg-[#181818] border border-white/10 shadow-xl group-hover:border-white/30 transition-all">
                  <img
                    src={getImageUrl(item.poster_path)}
                    alt={itemTitle}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center pl-0.5">
                      <Play className="w-6 h-6 text-white fill-white" />
                    </div>
                  </div>
                </div>

                {/* Title below */}
                <span className="mt-2 text-xs sm:text-sm font-semibold text-gray-200 line-clamp-1 group-hover:text-white">
                  {itemTitle}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
