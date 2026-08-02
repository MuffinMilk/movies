import React, { useState } from 'react';

interface Channel {
  id: string;
  name: string;
  logoUrl: string;
  fallbackText: React.ReactNode;
}

export default function ChannelsRow({ onSelectChannel }: { onSelectChannel?: (channelId: string) => void }) {
  const [failedLogos, setFailedLogos] = useState<Record<string, boolean>>({});

  const handleImageError = (id: string) => {
    setFailedLogos(prev => ({ ...prev, [id]: true }));
  };

  const channels: Channel[] = [
    {
      id: 'netflix',
      name: 'Netflix',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg',
      fallbackText: <span className="font-extrabold text-xl text-[#E50914] tracking-wider uppercase">NETFLIX</span>,
    },
    {
      id: 'prime',
      name: 'Prime Video',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f1/Prime_Video.svg',
      fallbackText: <span className="font-bold text-lg text-white">prime video</span>,
    },
    {
      id: 'disney',
      name: 'Disney+',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Disney%2B_logo.svg',
      fallbackText: <span className="font-serif italic text-2xl text-white">Disney<span className="text-cyan-400 font-sans font-bold">+</span></span>,
    },
    {
      id: 'hulu',
      name: 'Hulu',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e4/Hulu_Logo.svg',
      fallbackText: <span className="font-black text-2xl text-[#1CE783]">hulu</span>,
    },
    {
      id: 'crunchyroll',
      name: 'Crunchyroll',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Crunchyroll_Logo.svg',
      fallbackText: <span className="font-extrabold text-lg text-[#FF6B00] uppercase">crunchyroll</span>,
    },
    {
      id: 'amc',
      name: 'AMC+',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a2/AMC_Plus_logo.svg',
      fallbackText: <span className="font-black text-xl text-white">aMC<span className="text-[#00d2ff]">+</span></span>,
    },
    {
      id: 'hbomax',
      name: 'HBO Max',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/17/HBO_Max_Logo.svg',
      fallbackText: <span className="font-extrabold text-lg text-white">HBO <span className="text-purple-400">MAX</span></span>,
    },
    {
      id: 'appletv',
      name: 'Apple TV+',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/28/Apple_TV_Plus_Logo.svg',
      fallbackText: <span className="font-semibold text-lg text-white"> tv+</span>,
    },
    {
      id: 'paramount',
      name: 'Paramount+',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/81/Paramount%2B_logo.svg',
      fallbackText: <span className="font-extrabold italic text-lg text-[#0064FF]">Paramount<span className="text-white">+</span></span>,
    },
    {
      id: 'peacock',
      name: 'Peacock',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d3/NBCUniversal_Peacock_Logo.svg',
      fallbackText: <span className="font-bold text-lg text-white">peacock</span>,
    },
  ];

  return (
    <div className="mb-10">
      <h2 className="text-xl font-bold text-white tracking-tight mb-4 px-1">
        Channels & Apps
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-3">
        {channels.map((channel) => (
          <button
            key={channel.id}
            onClick={() => onSelectChannel?.(channel.id)}
            className="group h-24 sm:h-28 bg-[#141416] hover:bg-[#1f1f24] border border-white/10 hover:border-white/30 rounded-2xl p-3.5 flex items-center justify-center transition-all duration-300 hover:scale-105 shadow-xl cursor-pointer relative overflow-hidden"
            title={channel.name}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-full h-full flex items-center justify-center z-10 p-1">
              {failedLogos[channel.id] ? (
                channel.fallbackText
              ) : (
                <img
                  src={channel.logoUrl}
                  alt={channel.name}
                  onError={() => handleImageError(channel.id)}
                  className="max-h-10 sm:max-h-12 w-auto max-w-[85%] object-contain filter drop-shadow-md group-hover:brightness-110 transition-all"
                  loading="lazy"
                />
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}


