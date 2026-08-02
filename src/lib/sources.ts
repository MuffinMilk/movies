export interface Source {
  id: string;
  name: string;
  isFrench: boolean;
  url: string;
  tvUrl: string;
}

export const sources: Source[] = [
  { 
    id: 'vidsrcstream', 
    name: 'VidSrc Stream HLS', 
    isFrench: false, 
    url: 'https://corsproxy.io/?url=https%3A%2F%2Fvidsrc.stream%2Fm3u8%2F{id}.m3u8', 
    tvUrl: 'https://corsproxy.io/?url=https%3A%2F%2Fvidsrc.stream%2Fm3u8%2F{id}%2F{season}%2F{episode}.m3u8' 
  },
  { 
    id: 'byteful', 
    name: 'Byteful Stream HLS', 
    isFrench: false, 
    url: 'https://api.allorigins.win/raw?url=https%3A%2F%2Fstream.byteful.me%2Fhls%2F{id}.m3u8', 
    tvUrl: 'https://api.allorigins.win/raw?url=https%3A%2F%2Fstream.byteful.me%2Fhls%2F{id}%2F{season}%2F{episode}.m3u8' 
  },
  { id: 'vidlink', name: 'VidLink Embed', isFrench: false, url: 'https://vidlink.pro/movie/{id}?primaryColor=3b82f6&autoplay=true', tvUrl: 'https://vidlink.pro/tv/{id}/{season}/{episode}?primaryColor=3b82f6&autoplay=true' },
  { id: 'jellyfin', name: 'Custom Jellyfin / Local Server', isFrench: false, url: '{customUrl}', tvUrl: '{customUrl}' }
];

