export interface Source {
  id: string;
  name: string;
  isFrench: boolean;
  url: string;
  tvUrl: string;
}

export const sources: Source[] = [
  { id: 'vidsrcvip', name: 'VidSrc VIP', isFrench: false, url: 'https://vidsrc.vip/embed/movie/{id}', tvUrl: 'https://vidsrc.vip/embed/tv/{id}/{season}/{episode}' },
  { id: 'vidlink', name: 'VidLink', isFrench: false, url: 'https://vidlink.pro/movie/{id}', tvUrl: 'https://vidlink.pro/tv/{id}/{season}/{episode}' },
  { id: 'vidsrcnet', name: 'VidSrc Net', isFrench: false, url: 'https://vidsrc.net/embed/movie/{id}', tvUrl: 'https://vidsrc.net/embed/tv/{id}/{season}/{episode}' },
  { id: 'autoembedcc', name: 'AutoEmbed', isFrench: false, url: 'https://autoembed.cc/embed/movie/{id}', tvUrl: 'https://autoembed.cc/embed/tv/{id}/{season}/{episode}' },
  { id: 'jellyfin', name: 'Custom Jellyfin / Local Server', isFrench: false, url: '{customUrl}', tvUrl: '{customUrl}' }
];
