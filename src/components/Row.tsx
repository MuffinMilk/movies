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
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number, item: Movie | Show } | null>(null);

  useEffect(() => {
    const handleClickOutside = () => setContextMenu(null);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  const handleClick = (direction: 'left' | 'right') => {
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
    <div className="mb-6 relative group">
      <div className="flex items-center justify-between mb-4 px-1">
        <h2 className="text-xl font-bold text-white tracking-tight">
          {title}
        </h2>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => handleClick('left')}
            className="bg-[#1a1a1a] hover:bg-[#2a2a2a] border border-white/5 p-1.5 rounded-full text-gray-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button 
            onClick={() => handleClick('right')}
            className="bg-[#1a1a1a] hover:bg-[#2a2a2a] border border-white/5 p-1.5 rounded-full text-gray-400 hover:text-white transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="relative">
        {/* Scrollable Row */}
        <div 
          ref={rowRef}
          className="flex items-center gap-3 overflow-x-auto scrollbar-hide pb-4 snap-x"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {items.map((item, index) => {
            const isMovie = 'title' in item;
            return (
              <div 
                key={`${isMovie ? 'movie' : 'tv'}-${item.id}-${index}`} 
                className="w-[130px] sm:w-[155px] md:w-[175px] lg:w-[185px] flex-none snap-start"
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
