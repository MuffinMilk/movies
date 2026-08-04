import React, { useState } from 'react';

interface Channel {
  id: string;
  name: string;
  logoUrl: string;
  renderVector: () => React.ReactNode;
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
      renderVector: () => (
        <span className="font-black tracking-[0.2em] text-white text-xl sm:text-2xl uppercase select-none font-sans scale-y-120">
          NETFLIX
        </span>
      ),
    },
    {
      id: 'prime',
      name: 'Prime Video',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f1/Prime_Video.svg',
      renderVector: () => (
        <div className="flex flex-col items-center justify-center leading-none text-white select-none">
          <span className="font-bold text-lg sm:text-xl tracking-tight lowercase font-sans">
            prime video
          </span>
          <svg viewBox="0 0 100 15" className="w-16 h-3 fill-white mt-0.5">
            <path d="M5,2 Q50,16 95,2 Q98,1 92,7 Q50,21 5,2 Z" />
            <path d="M88,3 L98,2 L93,9 Z" />
          </svg>
        </div>
      ),
    },
    {
      id: 'disney',
      name: 'Disney+',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Disney%2B_logo.svg',
      renderVector: () => (
        <div className="relative flex items-center justify-center text-white select-none">
          <svg viewBox="0 0 160 60" className="h-9 sm:h-11 w-auto fill-white">
            <path d="M 10 35 C 40 5, 120 5, 145 25 L 143 27 C 120 8, 40 8, 12 37 Z" />
            <text x="15" y="45" fontFamily="serif" fontSize="34" fontWeight="bold" fontStyle="italic" fill="white">
              Disney
            </text>
            <text x="125" y="42" fontFamily="sans-serif" fontSize="30" fontWeight="900" fill="white">
              +
            </text>
          </svg>
        </div>
      ),
    },
    {
      id: 'hulu',
      name: 'Hulu',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e4/Hulu_Logo.svg',
      renderVector: () => (
        <span className="font-black text-2xl sm:text-3xl text-white tracking-tighter font-sans lowercase">
          hulu
        </span>
      ),
    },
    {
      id: 'hbomax',
      name: 'HBO Max',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/17/HBO_Max_Logo.svg',
      renderVector: () => (
        <div className="flex items-center gap-1 text-white select-none">
          <span className="font-black text-xl sm:text-2xl tracking-tighter">HBO</span>
          <span className="font-bold text-lg sm:text-xl tracking-tight text-white">max</span>
          <span className="text-[9px] font-bold align-top -mt-2">TM</span>
        </div>
      ),
    },
    {
      id: 'appletv',
      name: 'Apple TV+',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/28/Apple_TV_Plus_Logo.svg',
      renderVector: () => (
        <div className="flex items-center gap-1.5 text-white select-none">
          <svg viewBox="0 0 170 170" className="w-6 h-6 fill-white">
            <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.34.13-9.14-1.9-14.4-6.1-3.23-2.63-7.16-7.25-11.8-13.84-7.26-10.23-13.01-21.82-17.27-34.78-4.26-12.96-6.38-25.26-6.38-36.91 0-15.64 3.82-28.52 11.45-38.64 7.63-10.12 17.29-15.28 28.98-15.48 4.58 0 9.77 1.15 15.58 3.44 5.8 2.29 9.8 3.44 12.01 3.44 1.9 0 5.92-1.2 12.05-3.61 6.13-2.41 11.23-3.52 15.3-3.32 12.97.66 23.23 5.48 30.79 14.46-11.58 7.02-17.25 16.73-17.02 29.13.23 9.73 3.96 17.82 11.2 24.28 7.24 6.46 15.8 10.02 25.68 10.68-2.58 7.55-6.04 15.25-10.38 23.1zm-32.06-113.8c0 7.37-2.67 14.31-8.01 20.82-5.34 6.51-11.97 10.37-19.89 11.58-.23-.89-.35-1.84-.35-2.85 0-7.37 2.8-14.51 8.4-21.42 5.6-6.91 12.38-10.74 20.35-11.48.12.9.18 1.8.18 2.7 0 .22 0 .43-.68.65z" />
          </svg>
          <span className="font-bold text-lg sm:text-xl tracking-tight">tv+</span>
        </div>
      ),
    },
    {
      id: 'paramount',
      name: 'Paramount+',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/81/Paramount%2B_logo.svg',
      renderVector: () => (
        <span className="font-serif italic font-extrabold text-xl sm:text-2xl text-white tracking-tight">
          Paramount<span className="font-sans font-black not-italic text-white">+</span>
        </span>
      ),
    },
    {
      id: 'peacock',
      name: 'Peacock',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d3/NBCUniversal_Peacock_Logo.svg',
      renderVector: () => (
        <div className="flex items-center justify-between w-full max-w-[110px] px-2 select-none">
          <span className="font-bold text-lg text-white font-sans lowercase">peacock</span>
          <div className="flex flex-col gap-0.5 items-center">
            <span className="w-2 h-2 rounded-full bg-[#FFC200]" />
            <span className="w-2 h-2 rounded-full bg-[#FF3B30]" />
            <span className="w-2 h-2 rounded-full bg-[#AF52DE]" />
            <span className="w-2 h-2 rounded-full bg-[#007AFF]" />
            <span className="w-2 h-2 rounded-full bg-[#34C759]" />
          </div>
        </div>
      ),
    },
    {
      id: 'crunchyroll',
      name: 'Crunchyroll',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Crunchyroll_Logo.svg',
      renderVector: () => (
        <div className="flex items-center gap-2 text-white select-none">
          <svg viewBox="0 0 100 100" className="w-6 h-6 fill-white">
            <path d="M50,10 A40,40 0 1,0 90,50 A20,20 0 0,1 50,30 A20,20 0 1,0 30,50 A40,40 0 0,1 50,10 Z" />
            <circle cx="50" cy="50" r="10" fill="black" />
          </svg>
          <span className="font-black text-base sm:text-lg tracking-tight font-sans">
            Crunchyroll
          </span>
        </div>
      ),
    },
    {
      id: 'amc',
      name: 'AMC+',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a2/AMC_Plus_logo.svg',
      renderVector: () => (
        <div className="border-2 border-white px-3 py-1 bg-black text-white flex items-center justify-center">
          <span className="font-black text-xl tracking-tight lowercase">amc</span>
        </div>
      ),
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
            className="group h-24 sm:h-28 bg-[#141416] hover:bg-[#1f1f24] border border-white/10 hover:border-white/30 rounded-2xl p-3 flex items-center justify-center transition-all duration-300 hover:scale-105 shadow-xl cursor-pointer relative overflow-hidden"
            title={channel.name}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-full h-full flex items-center justify-center z-10 p-1">
              {failedLogos[channel.id] ? (
                channel.renderVector()
              ) : (
                <img
                  src={channel.logoUrl}
                  alt={channel.name}
                  referrerPolicy="no-referrer"
                  onError={() => handleImageError(channel.id)}
                  className="max-h-10 sm:max-h-12 w-auto max-w-[85%] object-contain filter brightness-0 invert drop-shadow-md group-hover:scale-105 transition-all"
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



