export interface Source {
  id: string;
  name: string;
  isFrench: boolean;
  url: string;
  tvUrl: string;
}

export const sources: Source[] = [
  { id: 'vidsrcxyz', name: 'VidSrc XYZ', isFrench: false, url: 'https://vidsrc.xyz/embed/movie?tmdb={id}', tvUrl: 'https://vidsrc.xyz/embed/tv?tmdb={id}&season={season}&episode={episode}' },
  { id: 'vidsrccc', name: 'VidSrc CC', isFrench: false, url: 'https://vidsrc.cc/v2/embed/movie/{id}', tvUrl: 'https://vidsrc.cc/v2/embed/tv/{id}/{season}/{episode}' },
  { id: 'vidsrcme', name: 'VidSrc ME', isFrench: false, url: 'https://vidsrc.me/embed/movie?tmdb={id}', tvUrl: 'https://vidsrc.me/embed/tv?tmdb={id}&season={season}&episode={episode}' },
  { id: '2embed', name: '2Embed', isFrench: false, url: 'https://www.2embed.cc/embed/{id}', tvUrl: 'https://www.2embed.cc/embedtv/{id}&s={season}&e={episode}' },
  { id: 'jellyfin', name: 'Custom Jellyfin / Local Server', isFrench: false, url: '{customUrl}', tvUrl: '{customUrl}' }
];
