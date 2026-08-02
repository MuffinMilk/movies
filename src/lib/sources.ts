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
    url: '/api/proxy?url=' + encodeURIComponent('https://vidsrc.stream/m3u8/{id}.m3u8'), 
    tvUrl: '/api/proxy?url=' + encodeURIComponent('https://vidsrc.stream/m3u8/{id}/{season}/{episode}.m3u8') 
  },
  { 
    id: 'byteful', 
    name: 'Byteful Stream HLS', 
    isFrench: false, 
    url: '/api/proxy?url=' + encodeURIComponent('https://stream.byteful.me/hls/{id}.m3u8'), 
    tvUrl: '/api/proxy?url=' + encodeURIComponent('https://stream.byteful.me/hls/{id}/{season}/{episode}.m3u8') 
  },
  { id: 'vidlink', name: 'VidLink Embed', isFrench: false, url: 'https://vidlink.pro/movie/{id}?primaryColor=3b82f6&autoplay=true', tvUrl: 'https://vidlink.pro/tv/{id}/{season}/{episode}?primaryColor=3b82f6&autoplay=true' },
  { id: 'jellyfin', name: 'Custom Jellyfin / Local Server', isFrench: false, url: '{customUrl}', tvUrl: '{customUrl}' }
];

