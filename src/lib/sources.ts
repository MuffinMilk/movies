export interface Source {
  id: string;
  name: string;
  isFrench: boolean;
  url: string;
  tvUrl: string;
}

export const sources: Source[] = [
  { id: 'vidsrccc_v2', name: 'VidSrc.cc (v2)', isFrench: false, url: 'https://vidsrc.cc/v2/embed/movie/{id}', tvUrl: 'https://vidsrc.cc/v2/embed/tv/{id}/{season}/{episode}' },
  { id: 'vidsrcme', name: 'VidSrc.me', isFrench: false, url: 'https://vidsrc.me/embed/movie/{id}', tvUrl: 'https://vidsrc.me/embed/tv/{id}/{season}/{episode}' },
  { id: 'vidsrcto', name: 'VidSrc.to', isFrench: false, url: 'https://vidsrc.to/embed/movie/{id}', tvUrl: 'https://vidsrc.to/embed/tv/{id}/{season}/{episode}' },
  { id: '2embed_main', name: '2Embed', isFrench: false, url: 'https://www.2embed.cc/embed/{id}', tvUrl: 'https://www.2embed.cc/embedtv/{id}&s={season}&e={episode}' },
  { id: 'autoembed_main', name: 'AutoEmbed', isFrench: false, url: 'https://player.autoembed.cc/embed/movie/{id}', tvUrl: 'https://player.autoembed.cc/embed/tv/{id}/{season}/{episode}' },
  { id: 'mapple', name: 'MappleTv', isFrench: false, url: 'https://mappletv.uk/watch/movie/{id}', tvUrl: 'https://mappletv.uk/watch/tv/{id}/{season}/{episode}' },
  { id: 'embedsu', name: 'EmbedSU', isFrench: false, url: 'https://embed.su/embed/movie/{id}', tvUrl: 'https://embed.su/embed/tv/{id}/{season}/{episode}' },
  { id: 'vidlink', name: 'VidLink', isFrench: false, url: 'https://vidlink.pro/movie/{id}', tvUrl: 'https://vidlink.pro/tv/{id}/{season}/{episode}' },
  { id: 'vidsrccx', name: 'VidSrcCX', isFrench: false, url: 'https://vidsrc.cx/embed/movie/{id}', tvUrl: 'https://vidsrc.cx/embed/tv/{id}/{season}/{episode}' },
  { id: 'dulocx', name: 'DuloCX', isFrench: false, url: 'https://dulo.cx/embed/movie/{id}', tvUrl: 'https://dulo.cx/embed/tv/{id}/{season}/{episode}' },
  { id: 'jellyfin', name: 'Custom Jellyfin / Local Server', isFrench: false, url: '{customUrl}', tvUrl: '{customUrl}' }
];
