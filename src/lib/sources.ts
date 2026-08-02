export interface Source {
  id: string;
  name: string;
  isFrench: boolean;
  url: string;
  tvUrl: string;
}

export const sources: Source[] = [
  { id: 'vidsrcin', name: 'VidSrc IN', isFrench: false, url: 'https://vidsrc.in/embed/movie/{id}', tvUrl: 'https://vidsrc.in/embed/tv/{id}/{season}/{episode}' },
  { id: 'vidsrcpm', name: 'VidSrc PM', isFrench: false, url: 'https://vidsrc.pm/embed/movie/{id}', tvUrl: 'https://vidsrc.pm/embed/tv/{id}/{season}/{episode}' },
  { id: 'embedsu', name: 'EmbedSU', isFrench: false, url: 'https://embed.su/embed/movie/{id}', tvUrl: 'https://embed.su/embed/tv/{id}/{season}/{episode}' },
  { id: 'vidsrcxyz', name: 'VidSrc XYZ', isFrench: false, url: 'https://vidsrc.xyz/embed/movie?tmdb={id}', tvUrl: 'https://vidsrc.xyz/embed/tv?tmdb={id}&season={season}&episode={episode}' },
  { id: 'jellyfin', name: 'Custom Jellyfin / Local Server', isFrench: false, url: '{customUrl}', tvUrl: '{customUrl}' }
];
