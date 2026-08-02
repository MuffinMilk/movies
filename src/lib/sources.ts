export interface Source {
  id: string;
  name: string;
  isFrench: boolean;
  url: string;
  tvUrl: string;
}

export const sources: Source[] = [
  { id: 'byteful', name: 'Byteful Stream', isFrench: false, url: 'https://streamprovider.byteful.me/?tmdbId={id}', tvUrl: 'https://streamprovider.byteful.me/?tmdbId={id}&season={season}&episode={episode}' },
  { id: 'vidsrcstream', name: 'VidSrc Stream HLS', isFrench: false, url: 'https://vidsrc.stream/m3u8/{id}.m3u8', tvUrl: 'https://vidsrc.stream/m3u8/{id}/{season}/{episode}.m3u8' },
  { id: 'vidlink', name: 'VidLink Embed', isFrench: false, url: 'https://vidlink.pro/movie/{id}?primaryColor=3b82f6&autoplay=true', tvUrl: 'https://vidlink.pro/tv/{id}/{season}/{episode}?primaryColor=3b82f6&autoplay=true' },
  { id: 'jellyfin', name: 'Custom Jellyfin / Local Server', isFrench: false, url: '{customUrl}', tvUrl: '{customUrl}' }
];

