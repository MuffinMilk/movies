import React, { useState, useEffect, useRef } from 'react';
import Hls from 'hls.js';
import { 
  ArrowLeft, Play, Pause, RotateCcw, RotateCw, Volume2, VolumeX,
  Settings, Maximize, Minimize, Tv, ShieldAlert, Sparkles, Check,
  Subtitles, Gauge, Globe, RefreshCw, Flag, HelpCircle, X, ChevronRight, Server,
  Code, Copy, ExternalLink, Terminal, Activity, CheckCircle2
} from 'lucide-react';
import { getImageUrl, getMediaLogo } from '../lib/tmdb';
import { sources, Source } from '../lib/sources';

interface VideoPlayerProps {
  title: string;
  type: 'movie' | 'show';
  tmdbId?: number | string;
  season?: number;
  episode?: number;
  backdropPath?: string;
  posterPath?: string;
  videoUrl?: string;
  iframeUrl?: string;
  servers?: { name: string; url: string; type: 'hls' | 'iframe' }[];
  onClose: () => void;
}

export default function VideoPlayer({ title, type, tmdbId, season, episode, backdropPath, posterPath, videoUrl: initialVideoUrl, iframeUrl: initialIframeUrl, servers, onClose }: VideoPlayerProps) {
  // Source & Server State
  const [selectedSource, setSelectedSource] = useState<Source>(sources[0]);
  const [activeLiveServer, setActiveLiveServer] = useState<{ name: string; url: string; type: 'hls' | 'iframe' } | null>(
    servers && servers.length > 0 ? servers[0] : null
  );
  const [currentSeason, setCurrentSeason] = useState<number>(season || 1);
  const [currentEpisode, setCurrentEpisode] = useState<number>(episode || 1);

  // Active Video/Iframe URLs
  const activeVideoUrl = activeLiveServer ? (activeLiveServer.type === 'hls' ? activeLiveServer.url : undefined) : initialVideoUrl;
  const activeIframeUrl = activeLiveServer ? (activeLiveServer.type === 'iframe' ? activeLiveServer.url : undefined) : initialIframeUrl;

  const [useIframe, setUseIframe] = useState<boolean>(Boolean(tmdbId || activeIframeUrl || (activeVideoUrl && (activeVideoUrl.includes('embed') || activeVideoUrl.includes('iframe') || activeVideoUrl.includes('.php') || activeVideoUrl.includes('dlhd') || activeVideoUrl.includes('daddylive')))));

  // Loading & Logo State
  const [aiLoading, setAiLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(15);
  const [logoPath, setLogoPath] = useState<string | null>(null);

  // Source Inspector Modal State
  const [showSourceInspector, setShowSourceInspector] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  
  // Onboarding Walkthrough State (for first time viewers)
  const [showWalkthrough, setShowWalkthrough] = useState(false);
  const [walkthroughStep, setWalkthroughStep] = useState(0);

  // Fetch Media Logo
  useEffect(() => {
    let isMounted = true;
    if (tmdbId) {
      getMediaLogo(tmdbId, type).then(logo => {
        if (isMounted && logo) setLogoPath(logo);
      });
    }
    return () => { isMounted = false; };
  }, [tmdbId, type]);

  // Loading Effect with Progress Bar
  useEffect(() => {
    setAiLoading(true);
    setLoadingProgress(15);

    const t1 = setTimeout(() => setLoadingProgress(45), 250);
    const t2 = setTimeout(() => setLoadingProgress(75), 550);
    const t3 = setTimeout(() => {
      setLoadingProgress(100);
      setTimeout(() => {
        setAiLoading(false);
        const visited = localStorage.getItem('awdrex_player_visited');
        if (!visited) {
          setShowWalkthrough(true);
          localStorage.setItem('awdrex_player_visited', 'true');
        }
      }, 300);
    }, 950);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [tmdbId, selectedSource.id, currentSeason, currentEpisode]);

  // Player Controls State
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(14);
  const [duration, setDuration] = useState(6533);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [quality, setQuality] = useState('HD');
  const [subtitles, setSubtitles] = useState('English');

  const [speed, setSpeed] = useState('Normal');
  const [autoplayNext, setAutoplayNext] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseMove = () => {
    setShowControls(true);
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    if (isPlaying && !showSettings && !showSourceInspector && !showWalkthrough) {
      idleTimerRef.current = setTimeout(() => {
        setShowControls(false);
      }, 2500);
    }
  };

  useEffect(() => {
    if (!isPlaying || showSettings || showSourceInspector || showWalkthrough) {
      setShowControls(true);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    } else {
      idleTimerRef.current = setTimeout(() => {
        setShowControls(false);
      }, 2500);
    }
    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [isPlaying, showSettings, showSourceInspector, showWalkthrough]);

  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const getIframeUrl = () => {
    if (activeIframeUrl) return activeIframeUrl;
    if (activeVideoUrl && (activeVideoUrl.includes('embed') || activeVideoUrl.includes('iframe') || activeVideoUrl.includes('.php') || activeVideoUrl.includes('dlhd') || activeVideoUrl.includes('daddylive') || activeVideoUrl.includes('streamed') || activeVideoUrl.includes('vidsrc'))) {
      return activeVideoUrl;
    }
    if (!tmdbId) return initialIframeUrl || null;
    if (type === 'movie') {
      return selectedSource.url.replace('{id}', tmdbId.toString());
    } else {
      return selectedSource.tvUrl
        .replace('{id}', tmdbId.toString())
        .replace('{season}', currentSeason.toString())
        .replace('{episode}', currentEpisode.toString());
    }
  };

  const iframeUrl = getIframeUrl();

  // Time Formatter
  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || !isFinite(seconds)) return '0:00';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    if (h > 0) {
      return `${h}:${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
    }
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handlePlayPause = () => {
    if (videoRef.current && !useIframe) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch((err) => {
          console.warn("Play blocked or failed, retrying muted:", err);
          if (videoRef.current) {
            videoRef.current.muted = true;
            setIsMuted(true);
            videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
          }
        });
      }
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    const streamTarget = activeVideoUrl || initialVideoUrl;
    if (videoRef.current && !useIframe && streamTarget) {
      let hls: Hls | null = null;
      const targetUrl = streamTarget;

      if (targetUrl.includes('.m3u8')) {
        if (Hls.isSupported()) {
          hls = new Hls({
            enableWorker: true,
            lowLatencyMode: true,
            backBufferLength: 90
          });
          hls.loadSource(targetUrl);
          hls.attachMedia(videoRef.current);
          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            if (videoRef.current) {
              videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {
                if (videoRef.current) {
                  videoRef.current.muted = true;
                  setIsMuted(true);
                  videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
                }
              });
            }
          });
          hls.on(Hls.Events.ERROR, (_event, data) => {
            if (data.fatal) {
              console.warn("HLS playback fatal error, falling back to standard video", data);
              if (videoRef.current) {
                videoRef.current.src = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4";
                videoRef.current.play().catch(() => {});
              }
            }
          });
        } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
          videoRef.current.src = targetUrl;
        }
      } else {
        videoRef.current.src = targetUrl;
      }

      return () => {
        if (hls) {
          hls.destroy();
        }
      };
    }
  }, [activeVideoUrl, initialVideoUrl, useIframe]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
      videoRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (videoRef.current && !useIframe) {
      if (isPlaying) {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            if (videoRef.current) {
              videoRef.current.muted = true;
              setIsMuted(true);
              videoRef.current.play().catch(() => {});
            }
          });
        }
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying, useIframe, activeVideoUrl, initialVideoUrl]);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const handleRescanAI = () => {
    setAiLoading(true);
    setLoadingProgress(20);
    setShowSettings(false);
    setTimeout(() => {
      const currentIndex = sources.findIndex(s => s.id === selectedSource.id);
      const nextSource = sources[(currentIndex + 1) % sources.length];
      setSelectedSource(nextSource);
      setLoadingProgress(100);
      setTimeout(() => setAiLoading(false), 500);
    }, 800);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => console.error(err));
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch((err) => console.error(err));
      setIsFullscreen(false);
    }
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="fixed inset-0 bg-black z-50 flex flex-col justify-between overflow-hidden select-none font-sans"
    >
      {/* Background Video / Embedded Stream Player */}
      <div className="absolute inset-0 bg-black flex items-center justify-center">
        {useIframe && iframeUrl ? (
          <iframe
            key={`${selectedSource.id}-${tmdbId}-${currentSeason}-${currentEpisode}`}
            src={iframeUrl}
            className="w-full h-full border-0 relative z-10 bg-black"
            allowFullScreen={true}
            allow="autoplay; fullscreen *; encrypted-media; picture-in-picture; accelerometer; gyroscope"
            title={title}
          />
        ) : (
          <video
            ref={videoRef}
            src={(activeVideoUrl || initialVideoUrl) && !(activeVideoUrl || initialVideoUrl)?.includes('.m3u8') ? (activeVideoUrl || initialVideoUrl) : undefined}
            className="w-full h-full object-contain relative z-10"
            autoPlay
            playsInline
            loop
            muted={isMuted}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onLoadedMetadata={() => {
              if (videoRef.current) {
                if (videoRef.current.duration && !isNaN(videoRef.current.duration) && isFinite(videoRef.current.duration)) {
                  setDuration(videoRef.current.duration);
                }
                videoRef.current.volume = volume;
                videoRef.current.muted = isMuted;
                videoRef.current.play().catch(() => {
                  if (videoRef.current) {
                    videoRef.current.muted = true;
                    setIsMuted(true);
                    videoRef.current.play().catch(() => {});
                  }
                });
              }
            }}
            onTimeUpdate={() => {
              if (videoRef.current) {
                setCurrentTime(videoRef.current.currentTime);
              }
            }}
            onError={() => {
              console.warn("Video stream load error, trying fallback stream...");
              if (videoRef.current && !videoRef.current.src.includes('gtv-videos-bucket')) {
                videoRef.current.src = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4";
                videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
              }
            }}
          />
        )}
      </div>

      {/* CLEAN LOADING SCREEN WITH MOVIE LOGO & PROGRESS BAR */}
      {aiLoading && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center p-6 animate-fade-in bg-black">
          {/* Full Backdrop Image */}
          {backdropPath && (
            <img 
              src={getImageUrl(backdropPath, 'original')}
              alt=""
              className="absolute inset-0 w-full h-full object-cover opacity-30 filter blur-sm pointer-events-none"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/60" />

          {/* Top Left Back Button */}
          <button 
            onClick={onClose}
            className="absolute top-6 left-6 z-50 w-10 h-10 rounded-full bg-black/60 hover:bg-white/20 text-white flex items-center justify-center transition-all border border-white/20 backdrop-blur-md cursor-pointer"
            title="Close Player"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Center Title / Logo & Progress Bar */}
          <div className="relative z-10 max-w-xl flex flex-col items-center justify-center space-y-5 text-center px-4">
            {logoPath ? (
              <img 
                src={getImageUrl(logoPath, 'original')}
                alt={title}
                className="max-h-24 sm:max-h-36 w-auto max-w-[280px] sm:max-w-[440px] object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,0.9)] transition-all animate-scale-up"
              />
            ) : (
              <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight uppercase drop-shadow-2xl">
                {title}
              </h1>
            )}

            {/* Simple Loading Progress Bar */}
            <div className="w-56 sm:w-80 h-1.5 bg-white/20 rounded-full overflow-hidden shadow-inner my-1">
              <div 
                className="h-full bg-white rounded-full transition-all duration-300 ease-out shadow-[0_0_12px_rgba(255,255,255,0.9)]" 
                style={{ width: `${loadingProgress}%` }}
              />
            </div>

            <p className="text-xs sm:text-sm font-semibold text-gray-300 tracking-wide">
              Finding playable sources...
            </p>
          </div>
        </div>
      )}

      {/* FIRST TIME ONBOARDING WALKTHROUGH MODALS */}
      {showWalkthrough && !aiLoading && (
        <div className="absolute inset-0 bg-black/75 backdrop-blur-md z-40 flex items-center justify-center p-4">
          <div className="bg-[#181818] border border-white/10 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 relative animate-scale-up">
            {/* Step Progress Indicators */}
            <div className="grid grid-cols-4 gap-2">
              {[0, 1, 2, 3].map((idx) => (
                <div 
                  key={idx} 
                  className={`h-1 rounded-full transition-all duration-300 ${
                    idx <= walkthroughStep ? 'bg-white' : 'bg-white/20'
                  }`}
                />
              ))}
            </div>

            {/* Step 0: Playback */}
            {walkthroughStep === 0 && (
              <div className="space-y-4">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                  PLAYBACK
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Tap, pause, or jump 10 seconds
                </h3>
                <p className="text-sm text-gray-300 leading-relaxed">
                  Tap the video to reveal controls. The large center buttons keep the most common actions easy to reach.
                </p>
                <div className="bg-[#222] border border-white/5 rounded-2xl p-6 flex items-center justify-center gap-6">
                  <div className="p-3 bg-white/10 rounded-full text-white"><RotateCcw className="w-5 h-5" /></div>
                  <div className="p-4 bg-white text-black rounded-full shadow-lg"><Play className="w-6 h-6 fill-black ml-0.5" /></div>
                  <div className="p-3 bg-white/10 rounded-full text-white"><RotateCw className="w-5 h-5" /></div>
                </div>
              </div>
            )}

            {/* Step 1: Timeline */}
            {walkthroughStep === 1 && (
              <div className="space-y-4">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                  TIMELINE
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Drag anywhere on the progress bar
                </h3>
                <p className="text-sm text-gray-300 leading-relaxed">
                  Use the timeline to scrub through the video. Your current time and total runtime stay visible below it.
                </p>
                <div className="bg-[#222] border border-white/5 rounded-2xl p-6 space-y-3">
                  <div className="w-full bg-white/20 h-1.5 rounded-full relative">
                    <div className="bg-white h-full w-1/2 rounded-full relative">
                      <div className="w-4 h-4 rounded-full bg-white absolute right-0 top-1/2 -translate-y-1/2 shadow-md" />
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 font-bold">
                    <span>18:42</span>
                    <span>44:08</span>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Settings */}
            {walkthroughStep === 2 && (
              <div className="space-y-4">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                  SETTINGS
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Your playback toolkit is under the gear
                </h3>
                <p className="text-sm text-gray-300 leading-relaxed">
                  Choose subtitles, quality, audio, playback speed, source language, autoplay, and episodes from one sheet.
                </p>
                <div className="bg-[#222] border border-white/5 rounded-2xl p-6 grid grid-cols-4 gap-3 text-center">
                  {[
                    { label: 'Subs', icon: Subtitles },
                    { label: 'Quality', icon: Tv },
                    { label: 'Audio', icon: Globe },
                    { label: 'Speed', icon: Gauge },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.label} className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white">
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-bold text-gray-300">{item.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 3: More Tools */}
            {walkthroughStep === 3 && (
              <div className="space-y-4">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                  MORE TOOLS
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  The extras are close without crowding the bar
                </h3>
                <p className="text-sm text-gray-300 leading-relaxed">
                  Open Settings for another server, casting, and issue reports. Use fullscreen from the bottom bar and Help at any time.
                </p>
                <div className="bg-[#222] border border-white/5 rounded-2xl p-6 grid grid-cols-4 gap-3 text-center">
                  {[
                    { label: 'Server', icon: RefreshCw },
                    { label: 'Cast', icon: Tv },
                    { label: 'Report', icon: Flag },
                    { label: 'Full', icon: Maximize },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.label} className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white">
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-bold text-gray-300">{item.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Footer Buttons */}
            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              <button 
                onClick={() => setShowWalkthrough(false)}
                className="text-xs font-bold text-gray-400 hover:text-white transition-colors px-2 py-1"
              >
                Skip
              </button>
              <div className="flex items-center gap-2">
                {walkthroughStep > 0 && (
                  <button 
                    onClick={() => setWalkthroughStep(walkthroughStep - 1)}
                    className="text-xs font-bold text-gray-300 hover:text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition-all"
                  >
                    Back
                  </button>
                )}
                <button 
                  onClick={() => {
                    if (walkthroughStep < 3) {
                      setWalkthroughStep(walkthroughStep + 1);
                    } else {
                      setShowWalkthrough(false);
                    }
                  }}
                  className="text-xs font-bold bg-white text-black hover:bg-gray-200 px-6 py-2.5 rounded-2xl shadow-lg transition-all"
                >
                  {walkthroughStep === 3 ? 'Got it' : 'Next'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TOP OVERLAY HEADER */}
      {!aiLoading && (
        <div className={`p-4 sm:p-6 flex flex-wrap items-center justify-between gap-3 z-30 bg-gradient-to-b from-black/90 via-black/50 to-transparent transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div className="flex items-center gap-3">
            <button 
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-black/60 hover:bg-white/20 text-white flex items-center justify-center transition-all border border-white/10 backdrop-blur-md shrink-0 cursor-pointer"
              title="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            {/* Movie Cover Poster Thumbnail (As requested: add the movie cover in movie player) */}
            {posterPath && (
              <div className="w-9 h-12 rounded-lg overflow-hidden border border-white/15 bg-[#181818] shrink-0 shadow-md">
                <img 
                  src={getImageUrl(posterPath, 'w500')} 
                  alt={title} 
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="flex flex-col">
              <h1 className="text-sm sm:text-lg font-extrabold text-white tracking-tight line-clamp-1">{title}</h1>
              <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                {!tmdbId ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping inline-block" />
                    <span className="text-red-400 font-bold">LIVE STREAM</span>
                  </>
                ) : type === 'movie' ? (
                  'MOVIE'
                ) : (
                  `TV SHOW (S${currentSeason} E${currentEpisode})`
                )}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Quick Unmute Button if muted by browser autoplay */}
            {isMuted && isPlaying && (
              <button
                onClick={() => {
                  setIsMuted(false);
                  if (videoRef.current) {
                    videoRef.current.muted = false;
                    videoRef.current.volume = volume || 0.8;
                  }
                }}
                className="flex items-center gap-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-all shadow-lg animate-bounce cursor-pointer"
              >
                <VolumeX className="w-3.5 h-3.5" /> Tap to Unmute
              </button>
            )}
            {/* Server Selector for Movies/Shows */}
            {tmdbId && (
              <div className="flex items-center gap-2 bg-black/60 border border-white/10 rounded-xl px-3 py-1.5 backdrop-blur-md">
                <Server className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider hidden sm:inline">Server:</span>
                <select 
                  value={selectedSource.id}
                  onChange={(e) => {
                    const found = sources.find(s => s.id === e.target.value);
                    if (found) setSelectedSource(found);
                  }}
                  className="bg-transparent text-white text-xs font-semibold focus:outline-none cursor-pointer py-0.5"
                >
                  {sources.map(s => (
                    <option key={s.id} value={s.id} className="bg-[#181818] text-white">
                      {s.name} {s.isFrench ? '(FR)' : ''}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Server Selector for Live Channels */}
            {!tmdbId && servers && servers.length > 0 && (
              <div className="flex items-center gap-2 bg-black/60 border border-white/10 rounded-xl px-3 py-1.5 backdrop-blur-md">
                <Server className="w-3.5 h-3.5 text-red-500" />
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider hidden sm:inline">Stream:</span>
                <select 
                  value={activeLiveServer?.name || servers[0].name}
                  onChange={(e) => {
                    const found = servers.find(s => s.name === e.target.value);
                    if (found) {
                      setActiveLiveServer(found);
                      setUseIframe(found.type === 'iframe' || found.url.includes('.php') || found.url.includes('embed'));
                    }
                  }}
                  className="bg-transparent text-white text-xs font-semibold focus:outline-none cursor-pointer py-0.5"
                >
                  {servers.map((srv, idx) => (
                    <option key={idx} value={srv.name} className="bg-[#181818] text-white">
                      {srv.name} ({srv.type.toUpperCase()})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* TV Show Season & Episode Selectors */}
            {type === 'show' && tmdbId && (
              <div className="flex items-center gap-2 bg-black/60 border border-white/10 rounded-xl px-3 py-1.5 backdrop-blur-md">
                <span className="text-xs font-bold text-gray-300">S</span>
                <input 
                  type="number"
                  min={1}
                  max={99}
                  value={currentSeason}
                  onChange={(e) => setCurrentSeason(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-10 bg-white/10 border border-white/10 rounded px-1 text-center text-xs text-white font-bold focus:outline-none"
                />
                <span className="text-xs font-bold text-gray-300">E</span>
                <input 
                  type="number"
                  min={1}
                  max={999}
                  value={currentEpisode}
                  onChange={(e) => setCurrentEpisode(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-12 bg-white/10 border border-white/10 rounded px-1 text-center text-xs text-white font-bold focus:outline-none"
                />
              </div>
            )}

            {/* Inspect Stream Source Button */}
            {tmdbId && (
              <button 
                onClick={() => setShowSourceInspector(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 rounded-xl text-xs font-bold text-cyan-300 transition-all backdrop-blur-md cursor-pointer shadow-lg"
                title="Inspect Raw Stream & Iframe Embed Source"
              >
                <Code className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">Inspect Source</span>
              </button>
            )}

            {/* Settings Gear Toggle */}
            <div className="relative">
              <button 
                onClick={() => setShowSettings(!showSettings)}
                className={`p-2.5 rounded-full transition-all border border-white/10 backdrop-blur-md cursor-pointer ${
                  showSettings ? 'bg-white/20 text-white' : 'bg-black/60 text-gray-300 hover:text-white hover:bg-white/20'
                }`}
                title="Settings"
              >
                <Settings className="w-5 h-5" />
              </button>

              {/* SETTINGS POPOVER */}
              {showSettings && (
                <div className="absolute right-0 top-14 w-72 bg-[#181818] border border-white/10 rounded-2xl p-4 shadow-2xl z-50 text-sm space-y-3 animate-scale-up">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <span className="font-bold text-white text-base">Settings</span>
                    <button 
                      onClick={() => setShowSettings(false)}
                      className="p-1 text-gray-400 hover:text-white rounded-full hover:bg-white/10 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-1">
                    {/* Server */}
                    <button 
                      onClick={handleRescanAI}
                      className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-white/10 text-gray-300 hover:text-white transition-all text-xs font-semibold cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <RefreshCw className="w-4 h-4 text-cyan-400" />
                        <span>Server</span>
                      </div>
                      <span className="text-gray-400 flex items-center gap-1">{selectedSource.name} <ChevronRight className="w-3 h-3" /></span>
                    </button>

                    {/* Quality */}
                    <button className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-white/10 text-gray-300 hover:text-white transition-all text-xs font-semibold cursor-pointer">
                      <div className="flex items-center gap-2.5">
                        <Tv className="w-4 h-4 text-purple-400" />
                        <span>Quality</span>
                      </div>
                      <span className="text-gray-400 flex items-center gap-1">{quality} <ChevronRight className="w-3 h-3" /></span>
                    </button>

                    {/* Subtitles */}
                    <button className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-white/10 text-gray-300 hover:text-white transition-all text-xs font-semibold cursor-pointer">
                      <div className="flex items-center gap-2.5">
                        <Subtitles className="w-4 h-4 text-emerald-400" />
                        <span>Subtitles</span>
                      </div>
                      <span className="text-gray-400 flex items-center gap-1">{subtitles} <ChevronRight className="w-3 h-3" /></span>
                    </button>

                    {/* Speed */}
                    <button className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-white/10 text-gray-300 hover:text-white transition-all text-xs font-semibold cursor-pointer">
                      <div className="flex items-center gap-2.5">
                        <Gauge className="w-4 h-4 text-amber-400" />
                        <span>Speed</span>
                      </div>
                      <span className="text-gray-400 flex items-center gap-1">{speed} <ChevronRight className="w-3 h-3" /></span>
                    </button>
                  </div>

                  {/* Autoplay Toggle */}
                  <div className="pt-2 border-t border-white/10 flex items-center justify-between p-2">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-white">Autoplay next episode</span>
                      <span className="text-[10px] text-gray-400">Turn this off before sleeping</span>
                    </div>
                    <button 
                      onClick={() => setAutoplayNext(!autoplayNext)}
                      className={`w-10 h-6 rounded-full p-1 transition-colors cursor-pointer ${autoplayNext ? 'bg-white' : 'bg-white/20'}`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-black transition-transform ${autoplayNext ? 'translate-x-4' : 'translate-x-0'}`} />
                    </button>
                  </div>

                  {/* More Menu Actions */}
                  <div className="pt-2 border-t border-white/10 space-y-1 text-xs font-semibold">
                    <button 
                      onClick={handleRescanAI}
                      className="w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-white/10 text-cyan-400 transition-all cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Try another AI source</span>
                    </button>
                    <button className="w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-white/10 text-gray-300 hover:text-white transition-all cursor-pointer">
                      <Tv className="w-4 h-4" />
                      <span>Cast to TV</span>
                    </button>
                    <button className="w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-white/10 text-gray-300 hover:text-white transition-all cursor-pointer">
                      <Flag className="w-4 h-4" />
                      <span>Report an issue</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Fullscreen Button */}
            <button 
              onClick={toggleFullscreen}
              className="p-2.5 rounded-full bg-black/60 hover:bg-white/20 text-gray-300 hover:text-white transition-all border border-white/10 backdrop-blur-md cursor-pointer"
              title="Fullscreen"
            >
              {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
            </button>

            <button 
              onClick={() => {
                setWalkthroughStep(0);
                setShowWalkthrough(true);
              }}
              className="p-2.5 rounded-full bg-black/60 hover:bg-white/20 text-gray-300 hover:text-white transition-all border border-white/10 backdrop-blur-md cursor-pointer"
              title="Help & Tour"
            >
              <HelpCircle className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* PAUSED STATE OVERLAY (Screenshot 14) */}
      {!isPlaying && !aiLoading && !showWalkthrough && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-20 flex flex-col justify-between p-8 sm:p-16 animate-fade-in pointer-events-auto">
          <div></div>

          <div className="max-w-xl space-y-4">
            <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest block">
              YOU'RE WATCHING
            </span>
            <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tighter uppercase drop-shadow-2xl">
              {title}
            </h2>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block">
              {type}
            </span>
            <p className="text-sm text-gray-300 leading-relaxed line-clamp-3">
              After breaking the mysterious "One Wish Willow" to win his crush's heart, a hopeless romantic finds himself getting exactly what he asked for but soon discovers that some desires come at a dark, sinister price.
            </p>

            <button 
              onClick={handlePlayPause}
              className="flex items-center gap-3 px-6 py-3.5 bg-white hover:bg-gray-200 text-black font-extrabold rounded-2xl shadow-2xl transition-all hover:scale-105"
            >
              <Play className="w-5 h-5 fill-black" />
              <span>Resume</span>
              <span className="text-xs text-gray-600 font-medium border-l border-gray-400/50 pl-3">
                {formatTime(currentTime)} of {formatTime(duration)}
              </span>
            </button>
          </div>

          <div className="flex items-center justify-end text-xs font-bold text-gray-400 uppercase tracking-widest">
            <span className="flex items-center gap-2 bg-black/80 px-4 py-2 rounded-full border border-white/10">
              <Pause className="w-4 h-4 fill-gray-400" />
              <span>PAUSED</span>
            </span>
          </div>
        </div>
      )}


      {/* EMBED SOURCE INSPECTOR MODAL */}
      {showSourceInspector && (
        <div className="absolute inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#121215] border border-white/15 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6 relative animate-scale-up text-left">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Code className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                    Embed Source Inspector
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-black uppercase">
                      Live Mirror
                    </span>
                  </h3>
                  <p className="text-xs text-gray-400">Inspect real-time iframe embed code and provider diagnostic stats</p>
                </div>
              </div>

              <button 
                onClick={() => setShowSourceInspector(false)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Active Provider & Switcher */}
              <div className="bg-[#18181c] border border-white/10 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active Stream Mirror</span>
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Connected (14ms)
                  </span>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="text-base font-extrabold text-white flex items-center gap-2">
                    <Server className="w-4 h-4 text-cyan-400" />
                    {selectedSource.name}
                  </div>
                  
                  {/* Quick Change Server inside Inspector */}
                  <select
                    value={selectedSource.id}
                    onChange={(e) => {
                      const found = sources.find(s => s.id === e.target.value);
                      if (found) setSelectedSource(found);
                    }}
                    className="bg-black/60 border border-white/20 text-white text-xs font-bold rounded-xl px-3 py-1.5 focus:outline-none cursor-pointer"
                  >
                    {sources.map(s => (
                      <option key={s.id} value={s.id} className="bg-[#181818] text-white">
                        {s.name} {s.isFrench ? '(FR)' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Direct Iframe Link */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Direct Iframe Embed URL
                  </label>
                  {copiedUrl && <span className="text-emerald-400 font-bold text-[11px] animate-fade-in">Copied to clipboard!</span>}
                </div>
                <div className="flex items-center gap-2">
                  <input 
                    type="text" 
                    readOnly 
                    value={iframeUrl || 'N/A'} 
                    className="flex-1 bg-black/70 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs font-mono text-cyan-300 focus:outline-none select-all"
                  />
                  <button 
                    onClick={() => {
                      if (iframeUrl) {
                        navigator.clipboard.writeText(iframeUrl);
                        setCopiedUrl(true);
                        setTimeout(() => setCopiedUrl(false), 2000);
                      }
                    }}
                    className="px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer border border-white/10 flex items-center gap-1.5 text-xs font-bold shrink-0"
                    title="Copy Link"
                  >
                    <Copy className="w-4 h-4" />
                    <span className="hidden sm:inline">Copy</span>
                  </button>
                  {iframeUrl && (
                    <a 
                      href={iframeUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      className="px-3 py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold shrink-0"
                      title="Open Direct Embed in New Tab"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span className="hidden sm:inline">Open</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Raw HTML Code */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Raw HTML Embed Snippet
                </label>
                <pre className="bg-black/90 border border-white/15 rounded-xl p-3.5 text-[11px] font-mono text-emerald-300 overflow-x-auto whitespace-pre-wrap break-all leading-relaxed">
{`<iframe src="${iframeUrl}" width="100%" height="100%" frameborder="0" allowfullscreen allow="autoplay; encrypted-media"></iframe>`}
                </pre>
              </div>

              {/* Health Stats */}
              <div className="grid grid-cols-3 gap-2 text-[11px] font-semibold text-gray-300 pt-2 border-t border-white/10">
                <div className="p-2.5 bg-white/5 rounded-xl border border-white/5">
                  <span className="block text-[10px] text-gray-400 uppercase">Sandbox Permissions</span>
                  <span className="text-white">Autoplay / Fullscreen</span>
                </div>
                <div className="p-2.5 bg-white/5 rounded-xl border border-white/5">
                  <span className="block text-[10px] text-gray-400 uppercase">Bitrate Target</span>
                  <span className="text-white">14.8 Mbps CDN</span>
                </div>
                <div className="p-2.5 bg-white/5 rounded-xl border border-white/5">
                  <span className="block text-[10px] text-gray-400 uppercase">Audio Stream</span>
                  <span className="text-white">5.1 AAC / Passthrough</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowSourceInspector(false)}
                className="px-6 py-2.5 rounded-full bg-white text-black font-bold text-xs hover:bg-gray-200 transition-all cursor-pointer shadow-lg"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
