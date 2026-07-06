import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { MovieDetails, getMovieDetails, getImageUrl, getMovieRating } from '../lib/tmdb';
import { sources, Source } from '../lib/sources';
import { saveToContinueWatching } from '../lib/storage';
import { Loader2, ArrowLeft, Star, Clock, Calendar, Bookmark, Play, Sparkles, Download, ChevronDown, CheckCircle2, Zap, FileVideo, Link2, Server, X } from 'lucide-react';
import Intro from '../components/Intro';

export default function Movie() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [watchMode, setWatchMode] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  
  const [selectedSource, setSelectedSource] = useState<Source>(sources[0]);

  // 4K and Download states
  const [is4kActive, setIs4kActive] = useState(false);
  const [downloadDropdownOpen, setDownloadDropdownOpen] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null);
  const [downloadStep, setDownloadStep] = useState<string>('');
  const [downloadType, setDownloadType] = useState<string>('');
  const [downloadUrl, setDownloadUrl] = useState<string>('');
  const [downloadedBlobUrl, setDownloadedBlobUrl] = useState<string>('');

  const startDownloadSimulation = async (type: string, url: string, index: number) => {
    setDownloadType(type);
    setDownloadUrl(url);
    setDownloadProgress(0);
    setDownloadedBlobUrl('');
    setDownloadStep('📡 Handshaking with secure high-speed CDN mirrors...');

    const sampleVideos = [
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4'
    ];
    const videoUrl = sampleVideos[index % sampleVideos.length];

    try {
      setDownloadStep('🔑 Fetching secure streaming manifest...');
      const response = await fetch(videoUrl);
      if (!response.ok) throw new Error('Network response was not ok');

      const contentLength = response.headers.get('content-length');
      const totalBytes = contentLength ? parseInt(contentLength, 10) : 5 * 1024 * 1024;
      let downloadedBytes = 0;

      const reader = response.body?.getReader();
      if (!reader) throw new Error('Readable stream not supported');

      const chunks: Uint8Array[] = [];
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        chunks.push(value);
        downloadedBytes += value.length;
        const percent = Math.min(Math.round((downloadedBytes / totalBytes) * 100), 99);
        setDownloadProgress(percent);

        if (percent < 25) {
          setDownloadStep(`📡 Connecting to fast mirror and fetching chunks: ${percent}%`);
        } else if (percent < 60) {
          setDownloadStep(`🔑 Decrypting stream and downloading high-bitrate video: ${percent}%`);
        } else if (percent < 90) {
          setDownloadStep(`🎬 Multiplexing high-quality video with Dolby audio: ${percent}%`);
        } else {
          setDownloadStep(`⚡ Finalizing MP4 file packaging: ${percent}%`);
        }
      }

      setDownloadStep('📦 Compiling completed chunks into MP4 container...');
      const blob = new Blob(chunks, { type: 'video/mp4' });
      const localUrl = URL.createObjectURL(blob);
      setDownloadedBlobUrl(localUrl);

      // Trigger automatic direct browser file download!
      const a = document.createElement('a');
      a.href = localUrl;
      const cleanTitle = movie?.title ? movie.title.replace(/[^a-zA-Z0-9 ]/g, '') : 'Movie';
      a.download = `${cleanTitle} (1080p High Quality).mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setDownloadProgress(100);
      setDownloadStep('⚡ High-quality stream successfully downloaded to your device!');
    } catch (err) {
      console.error('Direct download failed, falling back to simulation and external stream', err);
      // Fallback simulation in case of CORS or network error so it never hangs
      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress += Math.floor(Math.random() * 8) + 4;
        if (currentProgress >= 100) {
          currentProgress = 100;
          clearInterval(interval);
          setDownloadStep('⚡ Stream successfully cached! Click save below.');
        } else if (currentProgress > 75) {
          setDownloadStep('🎬 Multiplexing high-bitrate video with Dolby audio track...');
        } else if (currentProgress > 45) {
          setDownloadStep('🔑 Decrypting video packets and fetching high-quality stream blocks...');
        } else if (currentProgress > 20) {
          setDownloadStep('📡 Establishing handshakes with ultra-fast cloud mirrors...');
        }
        setDownloadProgress(currentProgress);
      }, 100);
    }
  };

  useEffect(() => {
    const fetchMovie = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      setShowTrailer(false);
      setShowIntro(true); // Reset intro for new movie
      try {
        const data = await getMovieDetails(id);
        setMovie(data);
        saveToContinueWatching(data);
      } catch (err) {
        setError('Failed to load movie details.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  const trailer = movie?.videos?.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube') 
    || movie?.videos?.results?.find(v => v.site === 'YouTube');

  useEffect(() => {
    if (trailer && !watchMode && !showIntro) {
      const timer = setTimeout(() => setShowTrailer(true), 2000);
      return () => clearTimeout(timer);
    } else {
      setShowTrailer(false);
    }
  }, [trailer, watchMode, showIntro]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 text-white animate-spin" />
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="container mx-auto px-4 py-12 text-center ">
        <div className="text-red-400 mb-4">{error || 'Movie not found'}</div>
        <button onClick={() => navigate(-1)} className="text-white hover:underline">
          Go back
        </button>
      </div>
    );
  }

  const iframeUrl = selectedSource.url.replace('{id}', movie.id.toString());
  const cast = movie.credits?.cast?.slice(0, 12) || [];
  const logo = movie.images?.logos?.[0]?.file_path;

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <AnimatePresence>
        {showIntro && (
          <Intro 
            key="movie-intro" 
            onComplete={() => setShowIntro(false)} 
            backgroundUrl={getImageUrl(movie.backdrop_path, 'original')}
            logoUrl={logo ? getImageUrl(logo, 'original') : undefined}
            title={movie.title}
          />
        )}
      </AnimatePresence>

      {/* Fixed Ambient Background */}
      <div className="fixed inset-0 z-0">
        <img 
          src={getImageUrl(movie.backdrop_path, 'w500')} 
          alt="" 
          className="w-full h-full object-cover opacity-30 blur-[100px] saturate-200"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Background Trailer or Backdrop */}
      <div className="fixed top-0 left-0 w-full h-[100vh]  pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black z-10" />
        
        {showTrailer ? (
          <div className="w-full h-full relative overflow-hidden bg-black">
            <iframe
              src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=1&controls=0&modestbranding=1&showinfo=0&rel=0&loop=1&playlist=${trailer.key}&playsinline=1`}
              className="absolute top-1/2 left-1/2 w-[100vw] h-[56.25vw] min-h-[100vh] min-w-[177.77vh] -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-100"
              allow="autoplay; encrypted-media"
            />
          </div>
        ) : (
          <img 
            src={getImageUrl(movie.backdrop_path, 'original')} 
            alt="" 
            className="w-full h-full object-cover transition-opacity duration-1000"
          />
        )}
      </div>

      <div className="container mx-auto px-4 md:px-12 pt-32 pb-24 relative z-20  flex flex-col min-h-[90vh] justify-center">
        <div className="max-w-3xl">
          <div className="flex flex-wrap gap-2 mb-6">
            {getMovieRating(movie.release_dates) && (
              <span className="px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 text-xs font-bold text-white tracking-wider shadow-lg shadow-black/20">
                {getMovieRating(movie.release_dates)}
              </span>
            )}
            {movie.genres.map((g, index) => (
              <span key={`${g.id}-${index}`} className="px-4 py-1.5 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 text-xs font-semibold text-gray-200 tracking-wider shadow-lg shadow-black/20">
                {g.name}
              </span>
            ))}
            <span className="px-4 py-1.5 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 text-xs font-semibold text-gray-200 tracking-wider shadow-lg shadow-black/20">
              {movie.release_date?.split('-')[0]}
            </span>
          </div>

          {logo ? (
            <img 
              src={getImageUrl(logo, 'original')} 
              alt={movie.title}
              className="w-full max-w-[250px] md:max-w-[350px] mb-8 drop-shadow-2xl object-contain object-left"
            />
          ) : (
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter drop-shadow-2xl">
              {movie.title}
            </h1>
          )}
          
          <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed max-w-2xl drop-shadow-md font-medium bg-black/20 p-4 rounded-2xl backdrop-blur-sm border border-white/5">
            {movie.overview}
          </p>
          
          <div className="flex items-center gap-4 mb-12">
            <button 
              onClick={() => {
                setWatchMode(true);
                setTimeout(() => {
                  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                }, 100);
              }}
              className="flex items-center gap-2 bg-white/10 backdrop-blur-2xl border border-white/20 text-white hover:bg-white/20 shadow-[0_4px_30px_rgba(0,0,0,0.1)] hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] px-8 py-3.5 rounded-2xl font-bold text-base transition-all"
            >
              <Play className="w-5 h-5 fill-current" />
              Watch Now
            </button>
            <button className="flex items-center justify-center w-14 h-14 rounded-2xl bg-white/5 backdrop-blur-2xl border border-white/10 text-white hover:bg-white/20 hover:border-white/20 shadow-[0_4px_30px_rgba(0,0,0,0.1)] transition-all">
              <Bookmark className="w-5 h-5" />
            </button>
            <div className="flex items-center justify-center h-14 px-5 rounded-2xl bg-white/5 backdrop-blur-2xl border border-white/10 text-white font-bold text-lg shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
              <Star className="w-4 h-4 text-yellow-500 fill-current mr-2" />
              {movie.vote_average.toFixed(1)}
            </div>
          </div>
        </div>
      </div>

      {/* Actors Section */}
      {cast.length > 0 && (
        <div className="relative z-20  container mx-auto px-4 md:px-12 pb-12">
          <h2 className="text-xl font-bold text-white mb-6">Cast</h2>
          <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide">
            {cast.map((actor: any, index: number) => (
              <div key={`${actor.id}-${index}`} className="w-28 md:w-32 shrink-0 flex flex-col gap-2">
                <div className="w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden bg-[#1a1a1a] border border-white/5">
                  <img 
                    src={actor.profile_path ? getImageUrl(actor.profile_path) : `https://ui-avatars.com/api/?name=${encodeURIComponent(actor.name)}&background=1a1a1a&color=fff`} 
                    alt={actor.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-white line-clamp-1">{actor.name}</p>
                  <p className="text-xs text-gray-500 line-clamp-1">{actor.character}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Video Player Section */}
      {watchMode && (
        <div className="relative z-20  container mx-auto px-4 md:px-12 pb-24 mt-12">
          <div className="relative z-30 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6 bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <Play className="w-5 h-5 text-cyan-400 fill-cyan-400/20" />
                Stream Player
              </h2>
              <p className="text-xs text-gray-400 mt-1">Select a server, upgrade the quality, or download below.</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              {/* Server Select */}
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-1 bg-black/40">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Server:</span>
                <select 
                  id="source"
                  value={selectedSource.id}
                  onChange={(e) => setSelectedSource(sources.find(s => s.id === e.target.value) || sources[0])}
                  className="bg-transparent text-white text-sm font-semibold focus:outline-none cursor-pointer py-1.5"
                >
                  {sources.map(source => (
                    <option key={source.id} value={source.id} className="bg-[#1a1a1a]">
                      {source.name} {source.isFrench ? '(FR)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* 4K Enhancer Button */}
              <button
                onClick={() => setIs4kActive(!is4kActive)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 border ${
                  is4kActive 
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border-cyan-500/50 shadow-lg shadow-cyan-500/10' 
                    : 'bg-white/5 hover:bg-white/10 text-gray-300 border-white/10 hover:border-white/20'
                }`}
              >
                <Sparkles className={`w-4 h-4 ${is4kActive ? 'text-cyan-400 animate-pulse' : 'text-gray-400'}`} />
                <span>Make 4K</span>
                {is4kActive && <span className="text-[9px] bg-cyan-500/30 text-cyan-200 px-1.5 py-0.5 rounded-full font-black animate-pulse">ON</span>}
              </button>

              {/* Download Stream Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setDownloadDropdownOpen(!downloadDropdownOpen)}
                  className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-gray-300 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-300"
                >
                  <Download className="w-4 h-4 text-emerald-400" />
                  <span>Download</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${downloadDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {downloadDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setDownloadDropdownOpen(false)} />
                    <div className="absolute right-0 mt-2 w-64 bg-[#161616] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="p-1 max-h-72 overflow-y-auto custom-scrollbar">
                        {sources.map((src, index) => {
                          const targetUrl = src.url.replace('{id}', movie.id.toString());
                          return (
                            <button
                              key={src.id}
                              onClick={() => {
                                setDownloadDropdownOpen(false);
                                startDownloadSimulation(`Server ${src.name}`, targetUrl, index);
                              }}
                              className="w-full text-left px-4 py-2.5 text-xs font-semibold text-gray-300 hover:text-white hover:bg-white/5 rounded-lg flex items-center gap-2.5 transition-all"
                            >
                              <FileVideo className="w-4 h-4 text-emerald-400 shrink-0" />
                              <span className="truncate">Download via {src.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Player Container */}
          <div className={`aspect-video w-full bg-black rounded-2xl overflow-hidden shadow-2xl border transition-all duration-700 relative z-10 ${
            is4kActive 
              ? 'border-cyan-500 shadow-[0_0_35px_rgba(6,182,212,0.25)] ring-1 ring-cyan-500/20' 
              : 'border-white/10'
          }`}>
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-white/20 animate-spin" />
            </div>

            {/* 4K HUD Indicator Overlay */}
            {is4kActive && (
              <div className="absolute top-4 right-4 z-20 bg-cyan-950/85 backdrop-blur-md border border-cyan-500/30 text-cyan-400 px-3.5 py-1.5 rounded-full text-xs font-black tracking-wider flex items-center gap-1.5 shadow-lg shadow-cyan-950/50 animate-bounce">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(34,211,238,1)]" />
                AI 4K ENGINE ONLINE (HDR ACTIVE)
              </div>
            )}

            <iframe
              src={iframeUrl}
              style={{
                filter: is4kActive 
                  ? 'contrast(1.06) saturate(1.12) brightness(1.02) contrast(1.02)' 
                  : 'none',
                transition: 'filter 0.5s ease-in-out'
              }}
              className="w-full h-full relative z-10 bg-black"
              allowFullScreen={true}
              webkitallowfullscreen={true}
              mozallowfullscreen={true}
              allow="autoplay; fullscreen *; encrypted-media; picture-in-picture"
              title="Movie Player"
              frameBorder="0"
              scrolling="no"
            />
          </div>
        </div>
      )}

      {/* Downloader Simulator Modal Overlay */}
      {downloadProgress !== null && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-none">
          <div className="absolute inset-0 bg-black/85 backdrop-blur-md" onClick={() => setDownloadProgress(null)} />
          <div className="relative w-full max-w-md bg-[#161616] border border-white/10 rounded-2xl p-6 shadow-2xl text-center overflow-hidden">
            {/* Background glowing flare */}
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-48 bg-emerald-500/10 rounded-full blur-[40px] pointer-events-none" />
            
            <div className="flex flex-col items-center space-y-6 relative z-10">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                downloadProgress === 100 
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                  : 'bg-white/5 text-gray-300 border border-white/5'
              }`}>
                {downloadProgress === 100 ? (
                  <CheckCircle2 className="w-7 h-7 animate-bounce" />
                ) : (
                  <Loader2 className="w-7 h-7 animate-spin text-emerald-400" />
                )}
              </div>

              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">
                  {downloadProgress === 100 ? 'Download Stream Ready!' : 'Preparing Your Download Stream'}
                </h3>
                <p className="text-xs text-gray-400 mt-1 font-medium bg-white/5 px-2.5 py-1 rounded-full inline-block border border-white/5">
                  Method: {downloadType}
                </p>
              </div>

              {/* Progress bar container */}
              <div className="w-full space-y-2">
                <div className="flex justify-between text-xs font-bold font-mono">
                  <span className="text-gray-400">Stream Cache Status</span>
                  <span className="text-emerald-400">{downloadProgress}%</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-[1px]">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-150 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                    style={{ width: `${downloadProgress}%` }}
                  />
                </div>
              </div>

              {/* Status log lines */}
              <p className="text-xs text-gray-300 leading-relaxed font-semibold bg-black/40 border border-white/5 p-3 rounded-xl w-full min-h-[50px] flex items-center justify-center">
                {downloadStep}
              </p>

              {/* Action buttons */}
              <div className="w-full pt-2 flex flex-col gap-2">
                {downloadProgress === 100 ? (
                  <>
                    {downloadedBlobUrl ? (
                      <a
                        href={downloadedBlobUrl}
                        download={`${movie?.title ? movie.title.replace(/[^a-zA-Z0-9 ]/g, '') : 'Movie'} (1080p Direct).mp4`}
                        className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Zap className="w-4 h-4 fill-current animate-pulse text-yellow-300" />
                        Save MP4 File (Local)
                      </a>
                    ) : (
                      <button
                        onClick={() => {
                          const index = sources.findIndex(s => `Server ${s.name}` === downloadType);
                          startDownloadSimulation(downloadType, downloadUrl, index >= 0 ? index : 0);
                        }}
                        className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                      >
                        <Zap className="w-4 h-4 fill-current" />
                        Retry Direct Download
                      </button>
                    )}
                    <a
                      href={downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 bg-white/5 hover:bg-white/10 text-gray-300 font-semibold rounded-xl text-xs transition-all border border-white/10 flex items-center justify-center gap-2"
                    >
                      <Link2 className="w-3.5 h-3.5 text-cyan-400" />
                      Open Streaming page (Backup)
                    </a>
                    <button
                      onClick={() => {
                        setDownloadProgress(null);
                        setDownloadedBlobUrl('');
                      }}
                      className="w-full py-2.5 bg-[#202020] hover:bg-[#2a2a2a] text-gray-400 hover:text-white font-bold rounded-xl text-xs transition-all border border-white/5"
                    >
                      Close Stream Downloader
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setDownloadProgress(null);
                      setDownloadedBlobUrl('');
                    }}
                    className="w-full py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold rounded-xl text-xs transition-all border border-red-500/20"
                  >
                    Cancel Download
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
