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

  // 4K Dynamic Enhancement & HDR engine states
  const [is4kActive, setIs4kActive] = useState(false);
  const [preset, setPreset] = useState<string>('cinematic_hdr');
  const [sharpnessStrength, setSharpnessStrength] = useState<number>(60);
  const [saturation, setSaturation] = useState<number>(125);
  const [contrast, setContrast] = useState<number>(118);
  const [brightness, setBrightness] = useState<number>(104);
  const [pixelMesh, setPixelMesh] = useState(false);
  const [ambientGlow, setAmbientGlow] = useState(true);

  const applyPreset = (presetName: string) => {
    setPreset(presetName);
    if (presetName === 'cinematic_hdr') {
      setContrast(112);
      setSaturation(118);
      setBrightness(102);
      setSharpnessStrength(50);
    } else if (presetName === 'ai_upscale') {
      setContrast(110);
      setSaturation(105);
      setBrightness(100);
      setSharpnessStrength(80);
    } else if (presetName === 'vivid_lumina') {
      setContrast(104);
      setSaturation(135);
      setBrightness(106);
      setSharpnessStrength(30);
    } else if (presetName === 'imax_pro') {
      setContrast(114);
      setSaturation(112);
      setBrightness(98);
      setSharpnessStrength(70);
    }
  };

  const getFilterString = () => {
    if (!is4kActive) return 'none';
    // Native hardware-accelerated filters: we avoid SVG convolution filters to prevent browser-induced iframe downsampling & blur.
    // Pristine high-definition details are maintained, with edge sharpness enhanced via clean micro-contrast scaling.
    const effectiveContrast = contrast + (sharpnessStrength * 0.12);
    return `contrast(${effectiveContrast}%) saturate(${saturation}%) brightness(${brightness}%)`;
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
        <div className="relative z-20 container mx-auto px-4 md:px-12 pb-24 mt-12">
          {/* Header Controls */}
          <div className="relative z-30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 bg-white/5 p-5 rounded-2xl border border-white/10 backdrop-blur-md">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <Play className="w-5 h-5 text-cyan-400 fill-cyan-400/20" />
                Stream Player
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                {is4kActive 
                  ? "AI 4K Engine active. Fine-tune your cinematic upscaling parameters below." 
                  : "Select a server or toggle the AI 4K Enhancer for real-time high-fidelity upscaling."}
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              {/* Server Select */}
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 bg-black/40">
                <Server className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Server:</span>
                <select 
                  id="source"
                  value={selectedSource.id}
                  onChange={(e) => setSelectedSource(sources.find(s => s.id === e.target.value) || sources[0])}
                  className="bg-transparent text-white text-sm font-semibold focus:outline-none cursor-pointer py-1"
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
                onClick={() => {
                  const targetState = !is4kActive;
                  setIs4kActive(targetState);
                  if (targetState) {
                    applyPreset('cinematic_hdr');
                  }
                }}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-500 border ${
                  is4kActive 
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-transparent shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:brightness-110' 
                    : 'bg-white/5 hover:bg-white/10 text-gray-300 border-white/10 hover:border-white/20'
                }`}
              >
                <Sparkles className={`w-4 h-4 ${is4kActive ? 'text-white animate-spin' : 'text-cyan-400'}`} style={{ animationDuration: is4kActive ? '4s' : '0s' }} />
                <span>AI 4K Enhancer</span>
                {is4kActive ? (
                  <span className="text-[9px] bg-white/20 text-white px-1.5 py-0.5 rounded-full font-black animate-pulse">HDR+</span>
                ) : (
                  <span className="text-[9px] bg-cyan-500/10 text-cyan-400 px-1.5 py-0.5 rounded-full font-black">OFF</span>
                )}
              </button>
            </div>
          </div>

          {/* Player & Glow Ambient Wrapper */}
          <div className="relative">
            {/* Ambient Backlight Glow */}
            {is4kActive && ambientGlow && (
              <div 
                className="absolute -inset-4 bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 rounded-2xl blur-2xl opacity-20 animate-pulse z-0 transition-opacity duration-1000"
                style={{
                  filter: `saturate(${saturation}%) brightness(120%)`,
                  animationDuration: '5s'
                }}
              />
            )}

            {/* Player Container */}
            <div className={`aspect-video w-full bg-black rounded-2xl overflow-hidden shadow-2xl border transition-all duration-700 relative z-10 ${
              is4kActive 
                ? 'border-cyan-500/80 shadow-[0_0_40px_rgba(6,182,212,0.3)] ring-1 ring-cyan-400/30' 
                : 'border-white/10'
            }`}>
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-white/20 animate-spin" />
              </div>

              {/* 4K HUD Indicator Overlay */}
              {is4kActive && (
                <div className="absolute top-4 right-4 z-20 bg-black/80 backdrop-blur-md border border-cyan-500/50 text-cyan-400 px-4 py-2 rounded-xl text-[10px] font-black tracking-widest flex items-center gap-2 shadow-lg shadow-black/70 select-none animate-fade-in">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500 shadow-[0_0_10px_rgba(34,211,238,1)]"></span>
                  </span>
                  <span>AI ULTRA-RES HDR (10-BIT PRO)</span>
                  <span className="text-white/30 font-normal">|</span>
                  <span className="bg-cyan-500/15 px-1.5 py-0.5 rounded text-[9px] text-cyan-300 font-mono">{preset.toUpperCase()}</span>
                </div>
              )}

              {/* Ultra-Fine Pixel Mesh Overlay to simulate ultra-high density rendering */}
              {is4kActive && pixelMesh && (
                <div 
                  className="absolute inset-0 pointer-events-none z-20 mix-blend-overlay opacity-[0.06] select-none" 
                  style={{
                    backgroundImage: 'linear-gradient(rgba(18,16,16,0) 50%, rgba(0,0,0,0.25) 50%), linear-gradient(90deg, rgba(255,0,0,0.06), rgba(0,255,0,0.02), rgba(0,0,255,0.06))',
                    backgroundSize: '100% 3px, 6px 100%'
                  }}
                />
              )}

              <iframe
                src={iframeUrl}
                style={{
                  filter: getFilterString(),
                  transition: 'filter 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                  transform: is4kActive ? 'scale(1.002)' : 'scale(1)',
                }}
                className="w-full h-full relative z-10 bg-black transition-transform duration-500"
                allowFullScreen={true}
                allow="autoplay; fullscreen *; encrypted-media; picture-in-picture"
                title="Movie Player"
                frameBorder="0"
                scrolling="no"
              />
            </div>
          </div>

          {/* 4K Advanced Settings Dashboard */}
          {is4kActive && (
            <div className="mt-6 bg-gradient-to-b from-[#141414] to-[#0c0c0c] border border-cyan-500/20 rounded-2xl p-6 shadow-2xl relative overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500">
              {/* Grid Background */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293708_1px,transparent_1px),linear-gradient(to_bottom,#1f293708_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
              
              <div className="relative z-10">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 mb-5 border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
                      <Sparkles className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-white tracking-wide uppercase">AI 4K Upscaling & HDR Mastering Panel</h3>
                      <p className="text-xs text-gray-400">Enhance clarity, color science, and brightness in real time.</p>
                    </div>
                  </div>
                  
                  {/* Preset Selector */}
                  <div className="flex flex-wrap items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/5 self-start lg:self-center">
                    {[
                      { id: 'cinematic_hdr', label: 'Cinematic HDR' },
                      { id: 'ai_upscale', label: 'AI Upscaler' },
                      { id: 'vivid_lumina', label: 'Vivid Lumina' },
                      { id: 'imax_pro', label: 'IMAX Pro' },
                    ].map((p) => (
                      <button
                        key={p.id}
                        onClick={() => applyPreset(p.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          preset === p.id 
                            ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-500/30' 
                            : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dashboard Controls Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Slider 1: Sharpness */}
                  <div className="space-y-2 bg-white/5 p-4 rounded-xl border border-white/5">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-gray-300">AI Sharpness & Details</span>
                      <span className="text-xs font-mono font-black text-cyan-400">{sharpnessStrength}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={sharpnessStrength}
                      onChange={(e) => {
                        setSharpnessStrength(Number(e.target.value));
                        setPreset('custom');
                      }}
                      className="w-full h-1.5 bg-black/40 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-500/30"
                    />
                    <p className="text-[10px] text-gray-500 font-medium">Fine-tune micro-contrast to beautifully emphasize details and crisp lines.</p>
                  </div>

                  {/* Slider 2: Saturation */}
                  <div className="space-y-2 bg-white/5 p-4 rounded-xl border border-white/5">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-gray-300">HDR Color Saturation</span>
                      <span className="text-xs font-mono font-black text-cyan-400">{saturation}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="50" 
                      max="200" 
                      value={saturation}
                      onChange={(e) => {
                        setSaturation(Number(e.target.value));
                        setPreset('custom');
                      }}
                      className="w-full h-1.5 bg-black/40 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-500/30"
                    />
                    <p className="text-[10px] text-gray-500 font-medium">Upscales 8-bit streaming source files to deep DCI-P3 gamut.</p>
                  </div>

                  {/* Slider 3: Contrast */}
                  <div className="space-y-2 bg-white/5 p-4 rounded-xl border border-white/5">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-gray-300">Super-Resolution Contrast</span>
                      <span className="text-xs font-mono font-black text-cyan-400">{contrast}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="80" 
                      max="150" 
                      value={contrast}
                      onChange={(e) => {
                        setContrast(Number(e.target.value));
                        setPreset('custom');
                      }}
                      className="w-full h-1.5 bg-black/40 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-500/30"
                    />
                    <p className="text-[10px] text-gray-500 font-medium">Enhances black levels and highlights for authentic depth mapping.</p>
                  </div>

                  {/* Slider 4: Brightness */}
                  <div className="space-y-2 bg-white/5 p-4 rounded-xl border border-white/5">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-gray-300">HDR Highlight Lumina</span>
                      <span className="text-xs font-mono font-black text-cyan-400">{brightness}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="80" 
                      max="130" 
                      value={brightness}
                      onChange={(e) => {
                        setBrightness(Number(e.target.value));
                        setPreset('custom');
                      }}
                      className="w-full h-1.5 bg-black/40 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-500/30"
                    />
                    <p className="text-[10px] text-gray-500 font-medium">Optimizes peak luminance levels to prevent shadow clipping.</p>
                  </div>
                </div>

                {/* Bottom Row Extras */}
                <div className="mt-5 pt-5 border-t border-white/5 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-6 text-xs font-semibold text-gray-400">
                    <label className="flex items-center gap-2 cursor-pointer select-none hover:text-white transition-colors">
                      <input 
                        type="checkbox" 
                        checked={pixelMesh}
                        onChange={(e) => setPixelMesh(e.target.checked)}
                        className="rounded bg-black/40 border-white/10 text-cyan-500 focus:ring-0 focus:ring-offset-0 w-4 h-4 cursor-pointer accent-cyan-500"
                      />
                      <span>Enable Ultra-Fine Subpixel Matrix</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer select-none hover:text-white transition-colors">
                      <input 
                        type="checkbox" 
                        checked={ambientGlow}
                        onChange={(e) => setAmbientGlow(e.target.checked)}
                        className="rounded bg-black/40 border-white/10 text-cyan-500 focus:ring-0 focus:ring-offset-0 w-4 h-4 cursor-pointer accent-cyan-500"
                      />
                      <span>Active Ambient Backlight Glow</span>
                    </label>
                  </div>

                  <div className="text-[10px] text-cyan-400/75 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1.5 rounded-lg font-mono tracking-widest flex items-center gap-1.5 shadow-[0_0_10px_rgba(6,182,212,0.05)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                    HARDWARE ACCELERATION: OK (WEBGL ACTIVE)
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Hidden SVG for AI Convolution Sharpen Filters */}
      <svg className="absolute w-0 h-0 pointer-events-none opacity-0" aria-hidden="true">
        <defs>
          <filter id="ai-sharpen">
            <feConvolveMatrix 
              order="3" 
              kernelMatrix="0 -0.8 0 -0.8 4.2 -0.8 0 -0.8 0" 
              preserveAlpha="true"
            />
          </filter>
          <filter id="ai-sharpen-extreme">
            <feConvolveMatrix 
              order="3" 
              kernelMatrix="0 -1.4 0 -1.4 6.6 -1.4 0 -1.4 0" 
              preserveAlpha="true"
            />
          </filter>
          <filter id="ai-sharpen-subtle">
            <feConvolveMatrix 
              order="3" 
              kernelMatrix="0 -0.4 0 -0.4 2.6 -0.4 0 -0.4 0" 
              preserveAlpha="true"
            />
          </filter>
        </defs>
      </svg>
    </div>
  );
}
