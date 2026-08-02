export interface Source {
  id: string;
  name: string;
  isFrench: boolean;
  url: string;
  tvUrl: string;
}

export const sources: Source[] = [
  { 
    id: 'backupmp4', 
    name: 'Backup MP4 Stream (Guaranteed)', 
    isFrench: false, 
    url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', 
    tvUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' 
  },
  { 
    id: 'muxsample', 
    name: 'Sample HLS Stream (Test)', 
    isFrench: false, 
    url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', 
    tvUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' 
  },
  { 
    id: 'vidsrcstream', 
    name: 'VidSrc Stream HLS (Proxy)', 
    isFrench: false, 
    url: '/api/proxy?url=' + encodeURIComponent('https://vidsrc.stream/m3u8/{id}.m3u8'), 
    tvUrl: '/api/proxy?url=' + encodeURIComponent('https://vidsrc.stream/m3u8/{id}/{season}/{episode}.m3u8') 
  },
  { 
    id: 'byteful', 
    name: 'Byteful Stream HLS (Proxy)', 
    isFrench: false, 
    url: '/api/proxy?url=' + encodeURIComponent('https://stream.byteful.me/hls/{id}.m3u8'), 
    tvUrl: '/api/proxy?url=' + encodeURIComponent('https://stream.byteful.me/hls/{id}/{season}/{episode}.m3u8') 
  },
  { id: 'vidlink', name: 'VidLink Embed', isFrench: false, url: 'https://vidlink.pro/movie/{id}?primaryColor=3b82f6&autoplay=true', tvUrl: 'https://vidlink.pro/tv/{id}/{season}/{episode}?primaryColor=3b82f6&autoplay=true' },
  { id: 'jellyfin', name: 'Custom Jellyfin / Local Server', isFrench: false, url: '{customUrl}', tvUrl: '{customUrl}' }
];


