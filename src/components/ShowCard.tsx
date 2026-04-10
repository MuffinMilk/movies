import React from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { Show, getImageUrl } from '../lib/tmdb';

interface ShowCardProps {
  show: Show;
}

export default function ShowCard({ show }: ShowCardProps) {
  return (
    <Link to={`/show/${show.id}`} className="group relative rounded-xl overflow-hidden bg-gray-900 transition-transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-500/20">
      <div className="aspect-[2/3] w-full overflow-hidden">
        <img 
          src={getImageUrl(show.poster_path)} 
          alt={show.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
        <h3 className="text-white font-semibold text-lg line-clamp-2 mb-1">{show.name}</h3>
        <div className="flex items-center gap-2 text-sm text-gray-300">
          <span className="flex items-center gap-1 text-yellow-400">
            <Star className="w-4 h-4 fill-current" />
            {show.vote_average.toFixed(1)}
          </span>
          <span>•</span>
          <span>{show.first_air_date?.split('-')[0]}</span>
        </div>
      </div>
    </Link>
  );
}
