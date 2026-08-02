import React, { useState } from 'react';
import { ArrowLeft, Server, Tv, Film } from 'lucide-react';

interface VideoPlayerProps {
  title: string;
  type: 'movie' | 'show';
  tmdbId?: number | string;
  season?: number;
  episode?: number;
  backdropPath?: string;
  posterPath?: string;
  onClose: () => void;
}

const PROVIDERS = [
  {
    name: 'VidLink',
    movieUrl: (id: string | number) => `https://vidlink.pro/movie/${id}?primaryColor=3b82f6&autoplay=true`,
    tvUrl: (id: string | number, season: number, episode: number) => `https://vidlink.pro/tv/${id}/${season}/${episode}?primaryColor=3b82f6&autoplay=true`
  },
  {
    name: 'VidSrc CC',
    movieUrl: (id: string | number) => `https://vidsrc.cc/v2/embed/movie/${id}`,
    tvUrl: (id: string | number, season: number, episode: number) => `https://vidsrc.cc/v2/embed/tv/${id}/${season}/${episode}`
  },
  {
    name: 'VidSrc ME',
    movieUrl: (id: string | number) => `https://vidsrc.me/embed/movie?tmdb=${id}`,
    tvUrl: (id: string | number, season: number, episode: number) => `https://vidsrc.me/embed/tv?tmdb=${id}&season=${season}&episode=${episode}`
  },
  {
    name: '2Embed',
    movieUrl: (id: string | number) => `https://www.2embed.cc/embed/${id}`,
    tvUrl: (id: string | number, season: number, episode: number) => `https://www.2embed.cc/embedtv/${id}&s=${season}&e=${episode}`
  }
];

export default function VideoPlayer({ title, type, tmdbId, season = 1, episode = 1, onClose }: VideoPlayerProps) {
  const [currentProviderIndex, setCurrentProviderIndex] = useState(0);
  const [currentSeason, setCurrentSeason] = useState(season);
  const [currentEpisode, setCurrentEpisode] = useState(episode);

  const provider = PROVIDERS[currentProviderIndex];
  const videoUrl = tmdbId 
    ? (type === 'show' ? provider.tvUrl(tmdbId, currentSeason, currentEpisode) : provider.movieUrl(tmdbId))
    : '';

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col w-full h-full">
      {/* Header Bar */}
      <div className="flex items-center justify-between p-4 bg-neutral-900/90 border-b border-neutral-800 z-10">
        <div className="flex items-center gap-3">
          <button 
            onClick={onClose}
            className="p-2 hover:bg-neutral-800 rounded-full transition-colors text-white"
            title="Go back"
          >
            <ArrowLeft className="w-6 h-6"/>
          </button>
          <div>
            <h2 className="text-white font-semibold text-lg">{title}</h2>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase px-2 py-0.5 bg-blue-600/30 text-blue-400 rounded-md font-medium border border-blue-500/30 flex items-center gap-1">
                {type === 'show' ? <Tv className="w-3 h-3"/> : <Film className="w-3 h-3"/>}
                {type}
              </span>
              {type === 'show' && (
                <span className="text-xs text-neutral-400">
                  S{currentSeason} E{currentEpisode}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Controls: Season/Episode (if show) & Server Selector */}
        <div className="flex items-center gap-3">
          {type === 'show' && (
            <div className="flex items-center gap-2 bg-neutral-800 px-3 py-1.5 rounded-lg border border-neutral-700 text-sm text-white">
              <span className="text-neutral-400 text-xs">S</span>
              <input 
                type="number" 
                min={1} 
                max={20}
                value={currentSeason}
                onChange={(e) => setCurrentSeason(Math.max(1, Number(e.target.value)))}
                className="w-10 bg-neutral-900 text-center rounded py-0.5 text-white font-medium focus:outline-none"
              />
              <span className="text-neutral-400 text-xs">E</span>
              <input 
                type="number" 
                min={1} 
                max={50}
                value={currentEpisode}
                onChange={(e) => setCurrentEpisode(Math.max(1, Number(e.target.value)))}
                className="w-10 bg-neutral-900 text-center rounded py-0.5 text-white font-medium focus:outline-none"
              />
            </div>
          )}

          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-neutral-400"/>
            <select 
              value={currentProviderIndex}
              onChange={(e) => setCurrentProviderIndex(Number(e.target.value))}
              className="bg-neutral-800 text-white text-sm px-3 py-1.5 rounded-lg border border-neutral-700 focus:outline-none"
            >
              {PROVIDERS.map((p, index) => (
                <option key={p.name} value={index}>
                  SERVER: {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Embedded Iframe Player */}
      <div className="relative flex-1 w-full h-full bg-black">
        {videoUrl ? (
          <iframe
            key={`${currentProviderIndex}-${currentSeason}-${currentEpisode}-${tmdbId}`}
            src={videoUrl}
            className="w-full h-full border-0"
            allowFullScreen={true}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            referrerPolicy="origin"
            title={title}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-neutral-400">
            No valid TMDB ID provided for playback.
          </div>
        )}
      </div>
    </div>
  );
}
