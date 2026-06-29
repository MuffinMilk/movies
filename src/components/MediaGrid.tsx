import React from 'react';
import { Link } from 'react-router-dom';
import { Movie, Show, getImageUrl } from '../lib/tmdb';
import { Play, Star } from 'lucide-react';

interface MediaGridProps {
  items: (Movie | Show)[];
  title: string;
}

export default function MediaGrid({ items, title }: MediaGridProps) {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-white mb-6 pl-2 border-l-4 border-white/20">{title}</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {items.map((item) => {
          const isMovie = 'title' in item;
          const displayTitle = isMovie ? item.title : item.name;
          const date = isMovie ? item.release_date : item.first_air_date;
          const year = date ? date.split('-')[0] : '';
          
          return (
            <Link
              key={item.id}
              to={`/${isMovie ? 'movie' : 'show'}/${item.id}`}
              className="group relative rounded-xl overflow-hidden bg-white/5 border border-white/5 hover:border-white/20 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              <div className="aspect-[2/3] relative">
                <img
                  src={getImageUrl(item.poster_path)}
                  alt={displayTitle}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white transform scale-50 group-hover:scale-100 transition-transform duration-300">
                    <Play className="w-5 h-5 ml-1" />
                  </div>
                </div>
                <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md border border-white/10">
                  <Star className="w-3 h-3 text-yellow-500 fill-current" />
                  <span className="text-xs font-bold text-white">{item.vote_average.toFixed(1)}</span>
                </div>
              </div>
              <div className="p-3">
                <h3 className="text-sm font-bold text-white line-clamp-1 group-hover:text-gray-300 transition-colors">
                  {displayTitle}
                </h3>
                <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                  <span>{year}</span>
                  <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                  <span>{isMovie ? 'Movie' : 'TV Show'}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
