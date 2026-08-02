import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Play } from 'lucide-react';
import { Movie, getImageUrl } from '../lib/tmdb';

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const releaseYear = movie.release_date ? movie.release_date.split('-')[0] : '2026';

  return (
    <Link to={`/movie/${movie.id}`} className="group relative block w-full outline-none cursor-pointer">
      <div className="aspect-[2/3] w-full overflow-hidden relative rounded-2xl bg-[#1a1a1a] border border-white/5 group-hover:border-white/20 transition-all shadow-md">
        <img 
          src={getImageUrl(movie.poster_path)} 
          alt={movie.title}
          className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105 group-hover:brightness-75"
          loading="lazy"
        />
        
        {/* Hover Play Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-12 h-12 rounded-full border border-white/30 bg-white/20 backdrop-blur-md flex items-center justify-center pl-0.5 transition-transform group-hover:scale-110">
            <Play className="w-5 h-5 fill-white text-white" />
          </div>
        </div>

        {/* Rating Badge */}
        {movie.vote_average > 0 && (
          <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-full flex items-center gap-1 border border-white/10 z-10">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span className="text-white text-[11px] font-bold">{movie.vote_average.toFixed(1)}</span>
          </div>
        )}
      </div>

      <div className="mt-2.5 px-0.5">
        <h3 className="text-sm font-bold text-gray-100 group-hover:text-white line-clamp-1 transition-colors">
          {movie.title}
        </h3>
        <p className="text-xs text-gray-400 font-medium mt-0.5">
          {releaseYear}
        </p>
      </div>
    </Link>
  );
}
