import React, { useState } from 'react';
import { ArrowLeft, Server } from 'lucide-react';

interface VideoPlayerProps {
  title: string;
  type?: 'movie' | 'show';
  tmdbId?: string | number;
  season?: number;
  episode?: number;
  backdropPath?: string;
  posterPath?: string;
  videoUrl?: string;
  onClose: () => void;
}

const PROVIDERS = [
  { 
    name: 'VidSrc CC', 
    url: (id: string | number, type?: string, season?: number, episode?: number) => 
      type === 'show' || season 
        ? `https://vidsrc.cc/v2/embed/tv/${id}/${season || 1}/${episode || 1}`
        : `https://vidsrc.cc/v2/embed/movie/${id}`
  },
  { 
    name: 'VidSrc XYZ', 
    url: (id: string | number, type?: string, season?: number, episode?: number) => 
      type === 'show' || season 
        ? `https://vidsrc.xyz/embed/tv?tmdb=${id}&season=${season || 1}&episode=${episode || 1}`
        : `https://vidsrc.xyz/embed/movie?tmdb=${id}`
  },
  { 
    name: 'VidLink', 
    url: (id: string | number, type?: string, season?: number, episode?: number) => 
      type === 'show' || season 
        ? `https://vidlink.pro/tv/${id}/${season || 1}/${episode || 1}?primaryColor=3b82f6`
        : `https://vidlink.pro/movie/${id}?primaryColor=3b82f6`
  },
];

export default function VideoPlayer({ 
  title, 
  type = 'movie', 
  tmdbId = 1, 
  season = 1, 
  episode = 1, 
  videoUrl, 
  onClose 
}: VideoPlayerProps) {
  const [currentProviderIndex, setCurrentProviderIndex] = useState(0);

  const activeId = tmdbId || 1;
  const currentProvider = PROVIDERS[currentProviderIndex];
  const srcUrl = videoUrl || currentProvider.url(activeId, type, season, episode);

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col w-full h-full">
      {/* TOP HEADER */}
      <div className="flex items-center justify-between p-4 bg-black/90 border-b border-neutral-800 z-10">
        <div className="flex items-center gap-3">
          <button 
            onClick={onClose}
            className="p-2 hover:bg-neutral-800 rounded-full transition-colors text-white"
          >
            <ArrowLeft className="w-6 h-6"/>
          </button>
          <div>
            <h2 className="text-white font-semibold text-lg">{title}</h2>
            <span className="text-xs text-neutral-400 uppercase">
              {type === 'show' ? `S${season} E${episode}` : 'MOVIE'}
            </span>
          </div>
        </div>

        {/* SERVER SELECTOR */}
        <div className="flex items-center gap-2">
          <Server className="w-4 h-4 text-neutral-400"/>
          <select 
            value={currentProviderIndex}
            onChange={(e) => setCurrentProviderIndex(Number(e.target.value))}
            className="bg-neutral-800 text-white text-sm px-3 py-1.5 rounded-lg border border-neutral-700 focus:outline-none cursor-pointer"
          >
            {PROVIDERS.map((provider, index) => (
              <option key={provider.name} value={index}>
                SERVER: {provider.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* IFRAME PLAYER */}
      <div className="relative flex-1 w-full h-full bg-black">
        <iframe
          key={`${currentProviderIndex}-${activeId}-${season}-${episode}`}
          src={srcUrl}
          className="w-full h-full border-0"
          allowFullScreen
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          referrerPolicy="origin"
          title={title}
        />
      </div>
    </div>
  );
}
