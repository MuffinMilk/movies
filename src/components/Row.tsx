import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Movie, Show } from '../lib/tmdb';
import MovieCard from './MovieCard';
import ShowCard from './ShowCard';

interface RowProps {
  title: string;
  items: (Movie | Show)[];
  onRemoveItem?: (id: number) => void;
}

export default function Row({ title, items, onRemoveItem }: RowProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [isMoved, setIsMoved] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number, item: Movie | Show } | null>(null);

  useEffect(() => {
    const handleClickOutside = () => setContextMenu(null);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  const handleClick = (direction: 'left' | 'right') => {
    setIsMoved(true);
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo = direction === 'left' 
        ? scrollLeft - clientWidth 
        : scrollLeft + clientWidth;
      
      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  if (!items || items.length === 0) return null;

  return (
    <div className="mb-8 relative group">
      <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 px-4 md:px-12 transition-colors hover:text-gray-300">
        {title}
      </h2>
      
      <div className="relative">
        {/* Left Arrow */}
        <div 
          className={`absolute top-0 bottom-0 left-0 z-40 w-12 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-black/80 ${!isMoved && 'hidden'}`}
          onClick={() => handleClick('left')}
        >
          <ChevronLeft className="w-8 h-8 text-white" />
        </div>

        {/* Scrollable Row */}
        <div 
          ref={rowRef}
          className="flex items-center gap-4 overflow-x-scroll scrollbar-hide px-4 md:px-12 pb-4 pt-2 snap-x"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {items.map((item) => {
            const isMovie = 'title' in item;
            return (
              <div 
                key={`${isMovie ? 'movie' : 'tv'}-${item.id}`} 
                className="w-[160px] md:w-[200px] lg:w-[240px] flex-none snap-start transition-transform duration-300 hover:scale-105 hover:z-50"
                onContextMenu={(e) => {
                  if (onRemoveItem) {
                    e.preventDefault();
                    setContextMenu({ x: e.clientX, y: e.clientY, item });
                  }
                }}
              >
                {isMovie ? (
                  <MovieCard movie={item as Movie} />
                ) : (
                  <ShowCard show={item as Show} />
                )}
              </div>
            );
          })}
        </div>

        {/* Right Arrow */}
        <div 
          className="absolute top-0 bottom-0 right-0 z-40 w-12 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-black/80"
          onClick={() => handleClick('right')}
        >
          <ChevronRight className="w-8 h-8 text-white" />
        </div>
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <div 
          className="fixed z-[100] bg-gray-900 border border-gray-700 rounded-lg shadow-2xl py-1 w-56 overflow-hidden"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <button 
            className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-gray-800 flex items-center gap-2 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              if (onRemoveItem) onRemoveItem(contextMenu.item.id);
              setContextMenu(null);
            }}
          >
            <X className="w-4 h-4" />
            Remove from list
          </button>
        </div>
      )}
    </div>
  );
}
