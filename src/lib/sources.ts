export interface Source {
  id: string;
  name: string;
  isFrench: boolean;
  url: string;
  tvUrl: string;
}

export const sources: Source[] = [
  { id: 'mapple', name: 'MappleTv', isFrench: false, url: 'https://mappletv.uk/watch/movie/{id}', tvUrl: 'https://mappletv.uk/watch/tv/{id}/{season}/{episode}' },
  { id: 'pstream', name: 'P-Stream', isFrench: false, url: 'https://iframe.pstream.mov/media/tmdb-movie-{id}', tvUrl: 'https://iframe.pstream.mov/media/tmdb-tv-{id}-{season}-{episode}' },
  { id: 'multiembed', name: 'MultiEmbed', isFrench: false, url: 'https://multiembed.mov/?video_id={id}&tmdb=1', tvUrl: 'https://multiembed.mov/?video_id={id}&tmdb=1&s={season}&e={episode}' },
  { id: 'moviesapi', name: 'MoviesAPI', isFrench: false, url: 'https://moviesapi.club/movie/{id}', tvUrl: 'https://moviesapi.club/tv/{id}-{season}-{episode}' },
  { id: 'embedsu', name: 'EmbedSU', isFrench: false, url: 'https://embed.su/embed/movie/{id}', tvUrl: 'https://embed.su/embed/tv/{id}/{season}/{episode}' },
  { id: 'hexa', name: 'Hexa', isFrench: false, url: 'https://hexa.watch/watch/movie/{id}', tvUrl: 'https://hexa.watch/watch/tv/{id}/{season}/{episode}' },
  { id: 'vidlink', name: 'VidLink', isFrench: false, url: 'https://vidlink.pro/movie/{id}', tvUrl: 'https://vidlink.pro/tv/{id}/{season}/{episode}' },
  { id: 'vidsrcXyz', name: 'VidSrcXyz', isFrench: false, url: 'https://vidsrc.xyz/embed/movie/{id}', tvUrl: 'https://vidsrc.xyz/embed/tv/{id}/{season}/{episode}' },
  { id: 'vidsrcrip', name: 'VidSrcRIP', isFrench: false, url: 'https://vidsrc.rip/embed/movie/{id}', tvUrl: 'https://vidsrc.rip/embed/tv/{id}/{season}/{episode}' },
  { id: 'vidsrcsu', name: 'VidSrcSU', isFrench: false, url: 'https://vidsrc.su/embed/movie/{id}', tvUrl: 'https://vidsrc.su/embed/tv/{id}/{season}/{episode}' },
  { id: 'vidsrcvip', name: 'VidSrcVIP', isFrench: false, url: 'https://vidsrc.vip/embed/movie/{id}', tvUrl: 'https://vidsrc.vip/embed/tv/{id}/{season}/{episode}' },
  { id: '2embed', name: '2Embed', isFrench: false, url: 'https://www.2embed.cc/embed/{id}', tvUrl: 'https://www.2embed.cc/embedtv/{id}&s={season}&e={episode}' },
  { id: '123embed', name: '123Embed', isFrench: false, url: 'https://play2.123embed.net/movie/{id}', tvUrl: 'https://play2.123embed.net/tv/{id}/{season}/{episode}' },
  { id: '111movies', name: '111Movies', isFrench: false, url: 'https://111movies.com/movie/{id}', tvUrl: 'https://111movies.com/tv/{id}/{season}/{episode}' },
  { id: 'smashystream', name: 'SmashyStream', isFrench: false, url: 'https://player.smashy.stream/movie/{id}', tvUrl: 'https://player.smashy.stream/tv/{id}?s={season}&e={episode}' },
  { id: 'autoembed', name: 'AutoEmbed', isFrench: false, url: 'https://player.autoembed.cc/embed/movie/{id}', tvUrl: 'https://player.autoembed.cc/embed/tv/{id}/{season}/{episode}' },
  { id: 'videasy', name: 'VidEasy (4K)', isFrench: false, url: 'https://player.videasy.net/movie/{id}?color=8834ec', tvUrl: 'https://player.videasy.net/tv/{id}/{season}/{episode}?color=8834ec' },
  { id: 'vidfast', name: 'VidFast (4K)', isFrench: false, url: 'https://vidfast.pro/movie/{id}', tvUrl: 'https://vidfast.pro/tv/{id}/{season}/{episode}' },
  { id: 'vidify', name: 'Vidify', isFrench: false, url: 'https://vidify.top/embed/movie/{id}', tvUrl: 'https://vidify.top/embed/tv/{id}/{season}/{episode}' },
  { id: 'flicky', name: 'Flicky', isFrench: false, url: 'https://flicky.host/embed/movie/?id={id}', tvUrl: 'https://flicky.host/embed/tv/?id={id}/{season}/{episode}' },
  { id: 'rive', name: 'RiveStream', isFrench: false, url: 'https://rivestream.org/embed?type=movie&id={id}', tvUrl: 'https://rivestream.org/embed?type=tv&id={id}&season={season}&episode={episode}' },
  { id: 'vidora', name: 'Vidora', isFrench: false, url: 'https://vidora.su/movie/{id}', tvUrl: 'https://vidora.su/tv/{id}/{season}/{episode}' },
  { id: 'vidsrccc', name: 'VidSrcCC', isFrench: false, url: 'https://vidsrc.cc/v2/embed/movie/{id}?autoPlay=false', tvUrl: 'https://vidsrc.cc/v2/embed/tv/{id}/{season}/{episode}?autoPlay=false' },
  { id: 'streamflix', name: 'StreamFlix', isFrench: false, url: 'https://watch.streamflix.one/movie/{id}/watch?server=1', tvUrl: 'https://watch.streamflix.one/tv/{id}/{season}/{episode}/watch?server=1' },
  { id: 'nebula', name: 'NebulaFlix', isFrench: false, url: 'https://nebulaflix.stream/movie?mt={id}&server=1', tvUrl: 'https://nebulaflix.stream/tv?mt={id}&s={season}&e={episode}&server=1' },
  { id: 'vidjoy', name: 'VidJoy', isFrench: false, url: 'https://vidjoy.pro/embed/movie/{id}', tvUrl: 'https://vidjoy.pro/embed/tv/{id}/{season}/{episode}' },
  { id: 'vidzee', name: 'VidZee', isFrench: false, url: 'https://player.vidzee.wtf/embed/movie/{id}', tvUrl: 'https://player.vidzee.wtf/embed/tv/{id}/{season}/{episode}' },
  { id: 'spenflix', name: 'Spenflix', isFrench: false, url: 'https://spencerdevs.xyz/movie/{id}', tvUrl: 'https://spencerdevs.xyz/tv/{id}/{season}/{episode}' },
  { id: 'frembed', name: 'Frembed', isFrench: true, url: 'https://frembed.icu/api/film.php?id={id}', tvUrl: 'https://frembed.icu/api/serie.php?id={id}&sa={season}&epi={episode}' },
  { id: 'uembed', name: 'UEmbed (premium)', isFrench: false, url: 'https://uembed.site/?id={id}&apikey=thisisforsurenotapremiumkey_right?', tvUrl: 'https://uembed.site/?id={id}&s={season}&e={episode}&apikey=thisisforsurenotapremiumkey_right?' },
  { id: 'vidsrccx', name: 'VidSrcCX', isFrench: false, url: 'https://vidsrc.cx/embed/movie/{id}', tvUrl: 'https://vidsrc.cx/embed/tv/{id}/{season}/{episode}' }
];
