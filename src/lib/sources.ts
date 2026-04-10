export interface Source {
  id: string;
  name: string;
  isFrench: boolean;
  url: string;
}

export const sources: Source[] = [
  { id: 'mapple', name: 'MappleTv', isFrench: false, url: 'https://mappletv.uk/watch/movie/{id}' },
  { id: 'pstream', name: 'P-Stream', isFrench: false, url: 'https://iframe.pstream.mov/media/tmdb-movie-{id}' },
  { id: 'multiembed', name: 'MultiEmbed', isFrench: false, url: 'https://multiembed.mov/?video_id={id}&tmdb=1' },
  { id: 'moviesapi', name: 'MoviesAPI', isFrench: false, url: 'https://moviesapi.club/movie/{id}' },
  { id: 'embedsu', name: 'EmbedSU', isFrench: false, url: 'https://embed.su/embed/movie/{id}' },
  { id: 'hexa', name: 'Hexa', isFrench: false, url: 'https://hexa.watch/watch/movie/{id}' },
  { id: 'vidlink', name: 'VidLink', isFrench: false, url: 'https://vidlink.pro/movie/{id}' },
  { id: 'vidsrcXyz', name: 'VidSrcXyz', isFrench: false, url: 'https://vidsrc.xyz/embed/movie/{id}' },
  { id: 'vidsrcrip', name: 'VidSrcRIP', isFrench: false, url: 'https://vidsrc.rip/embed/movie/{id}' },
  { id: 'vidsrcsu', name: 'VidSrcSU', isFrench: false, url: 'https://vidsrc.su/embed/movie/{id}' },
  { id: 'vidsrcvip', name: 'VidSrcVIP', isFrench: false, url: 'https://vidsrc.vip/embed/movie/{id}' },
  { id: '2embed', name: '2Embed', isFrench: false, url: 'https://www.2embed.cc/embed/{id}' },
  { id: '123embed', name: '123Embed', isFrench: false, url: 'https://play2.123embed.net/movie/{id}' },
  { id: '111movies', name: '111Movies', isFrench: false, url: 'https://111movies.com/movie/{id}' },
  { id: 'smashystream', name: 'SmashyStream', isFrench: false, url: 'https://player.smashy.stream/movie/{id}' },
  { id: 'autoembed', name: 'AutoEmbed', isFrench: false, url: 'https://player.autoembed.cc/embed/movie/{id}' },
  { id: 'videasy', name: 'VidEasy (4K)', isFrench: false, url: 'https://player.videasy.net/movie/{id}?color=8834ec' },
  { id: 'vidfast', name: 'VidFast (4K)', isFrench: false, url: 'https://vidfast.pro/movie/{id}' },
  { id: 'vidify', name: 'Vidify', isFrench: false, url: 'https://vidify.top/embed/movie/{id}' },
  { id: 'flicky', name: 'Flicky', isFrench: false, url: 'https://flicky.host/embed/movie/?id={id}' },
  { id: 'rive', name: 'RiveStream', isFrench: false, url: 'https://rivestream.org/embed?type=movie&id={id}' },
  { id: 'vidora', name: 'Vidora', isFrench: false, url: 'https://vidora.su/movie/{id}' },
  { id: 'vidsrccc', name: 'VidSrcCC', isFrench: false, url: 'https://vidsrc.cc/v2/embed/movie/{id}?autoPlay=false' },
  { id: 'streamflix', name: 'StreamFlix', isFrench: false, url: 'https://watch.streamflix.one/movie/{id}/watch?server=1' },
  { id: 'nebula', name: 'NebulaFlix', isFrench: false, url: 'https://nebulaflix.stream/movie?mt={id}&server=1' },
  { id: 'vidjoy', name: 'VidJoy', isFrench: false, url: 'https://vidjoy.pro/embed/movie/{id}' },
  { id: 'vidzee', name: 'VidZee', isFrench: false, url: 'https://player.vidzee.wtf/embed/movie/{id}' },
  { id: 'spenflix', name: 'Spenflix', isFrench: false, url: 'https://spencerdevs.xyz/movie/{id}' },
  { id: 'frembed', name: 'Frembed', isFrench: true, url: 'https://frembed.icu/api/film.php?id={id}' },
  { id: 'uembed', name: 'UEmbed (premium)', isFrench: false, url: 'https://uembed.site/?id={id}&apikey=thisisforsurenotapremiumkey_right?' },
  { id: 'vidsrccx', name: 'VidSrcCX', isFrench: false, url: 'https://vidsrc.cx/embed/movie/{id}' }
];
