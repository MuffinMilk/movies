import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Play } from 'lucide-react';
import { Movie, getImageUrl } from '../lib/tmdb';

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <Link to={`/movie/${movie.id}`} className="group relative block w-full outline-none">
      <div className="aspect-[2/3] w-full overflow-hidden relative rounded-xl bg-[#1a1a1a]">
        <img 
          src={getImageUrl(movie.poster_path)} 
          alt={movie.title}
          className="w-full h-full object-cover transition-all duration-300 group-hover:brightness-50"
          loading="lazy"
        />
        
        {/* Hover Play Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-14 h-14 rounded-full border border-white/30 bg-white/10 backdrop-blur-md flex items-center justify-center pl-1 transition-transform group-hover:scale-110">
             <Play className="w-6 h-6 fill-white text-white" />
          </div>
        </div>

        {/* Rating Badge */}
        <div className="absolute top-2 left-2 bg-black/80 backdrop-blur-md px-1.5 py-0.5 rounded flex items-center gap-1 border border-white/5 z-10">
          <Star className="w-3 h-3 fill-green-500 text-green-500" />
          <span className="text-white text-xs font-bold">{movie.vote_average.toFixed(1)}</span>
        </div>
      </div>
    </Link>
  );
}
