import React, { useState } from 'react';
import { Search, Play, Radio, Tv, Globe, ExternalLink, X, Sparkles, Volume2, ShieldCheck, Zap, Server, Film, Activity, Flame, Clock } from 'lucide-react';
import VideoPlayer from '../components/VideoPlayer';

export interface LiveServerOption {
  name: string;
  url: string;
  type: 'hls' | 'iframe';
}

export interface ChannelStream {
  id: string;
  name: string;
  category: 'Sports' | 'Entertainment' | 'News' | 'Movies' | 'Documentary' | 'Kids';
  logo: string;
  currentShow: string;
  nextShow?: string;
  bgImage: string;
  viewers: string;
  quality: '1080p HD' | '4K Ultra' | '720p HD';
  servers: LiveServerOption[];
}

// Comprehensive Live Channel Configuration Modeled after Dulo.cx
export const HLS_CHANNELS: ChannelStream[] = [
  // ================= SPORTS =================
  {
    id: 'espn-hd',
    name: 'ESPN HD',
    category: 'Sports',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/ESPN_wordmark.svg',
    currentShow: 'NBA Finals Game 7 Live Special & Analysis',
    nextShow: '8:30 PM - SportsCenter Primetime',
    bgImage: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80',
    viewers: '1.4M watching',
    quality: '1080p HD',
    servers: [
      { name: 'Server 1 (HLS Ultra)', url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', type: 'hls' },
      { name: 'Server 2 (DaddyLive Embed)', url: 'https://dlhd.so/stream/stream-31.php', type: 'iframe' },
      { name: 'Server 3 (EmbedMe HD)', url: 'https://embedme.cc/embed/espn', type: 'iframe' },
      { name: 'Server 4 (Backup Stream)', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4', type: 'hls' }
    ]
  },
  {
    id: 'espn-2',
    name: 'ESPN 2 HD',
    category: 'Sports',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/ESPN_wordmark.svg',
    currentShow: 'NCAA College Football Championship Preview',
    nextShow: '8:00 PM - First Take Debate',
    bgImage: 'https://images.unsplash.com/photo-1517649763962-0c6232660102?auto=format&fit=crop&w=800&q=80',
    viewers: '680K watching',
    quality: '1080p HD',
    servers: [
      { name: 'Server 1 (HLS Ultra)', url: 'https://cph-p2p-msl.akamaized.net/hls/live/2000341/test/master.m3u8', type: 'hls' },
      { name: 'Server 2 (DaddyLive Embed)', url: 'https://dlhd.so/stream/stream-32.php', type: 'iframe' },
      { name: 'Server 3 (Backup Stream)', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', type: 'hls' }
    ]
  },
  {
    id: 'fox-sports-1',
    name: 'FOX Sports 1 (FS1)',
    category: 'Sports',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/c/c9/Fox_Sports_1_logo_%282013%29.svg',
    currentShow: 'MLB Live: Dodgers vs Yankees Game 5',
    nextShow: '9:00 PM - The Herd with Colin Cowherd',
    bgImage: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80',
    viewers: '890K watching',
    quality: '1080p HD',
    servers: [
      { name: 'Server 1 (HLS Ultra)', url: 'https://playertest.longtailvideo.com/adaptive/oceans/oceans.m3u8', type: 'hls' },
      { name: 'Server 2 (DLHD Live)', url: 'https://dlhd.so/stream/stream-55.php', type: 'iframe' },
      { name: 'Server 3 (Backup Stream)', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', type: 'hls' }
    ]
  },
  {
    id: 'nfl-network',
    name: 'NFL Network',
    category: 'Sports',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a2/NFL_Network_logo.svg',
    currentShow: 'NFL Total Access - Sunday Night Special',
    nextShow: '8:00 PM - Good Morning Football Rewind',
    bgImage: 'https://images.unsplash.com/photo-1566958769312-8947493b3f4e?auto=format&fit=crop&w=800&q=80',
    viewers: '950K watching',
    quality: '4K Ultra',
    servers: [
      { name: 'Server 1 (HLS 4K)', url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', type: 'hls' },
      { name: 'Server 2 (DaddyLive Embed)', url: 'https://dlhd.so/stream/stream-60.php', type: 'iframe' },
      { name: 'Server 3 (Backup Stream)', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', type: 'hls' }
    ]
  },
  {
    id: 'nba-tv',
    name: 'NBA TV Live',
    category: 'Sports',
    logo: 'https://upload.wikimedia.org/wikipedia/en/2/23/NBA_TV_logo_2019.svg',
    currentShow: 'Gametime Live: Top 10 Plays of the Week',
    nextShow: '9:00 PM - Inside the NBA Special',
    bgImage: 'https://images.unsplash.com/photo-1519766304817-4f37bda74a29?auto=format&fit=crop&w=800&q=80',
    viewers: '720K watching',
    quality: '1080p HD',
    servers: [
      { name: 'Server 1 (HLS Ultra)', url: 'https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_fhd/master.m3u8', type: 'hls' },
      { name: 'Server 2 (DaddyLive Embed)', url: 'https://dlhd.so/stream/stream-62.php', type: 'iframe' }
    ]
  },
  {
    id: 'sky-sports-f1',
    name: 'Sky Sports F1 HD',
    category: 'Sports',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/3/36/Sky_Sports_F1_logo_2020.svg',
    currentShow: 'Formula 1 Grand Prix Live Qualifying',
    nextShow: '8:30 PM - Ted\'s Notebook Analysis',
    bgImage: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80',
    viewers: '1.2M watching',
    quality: '4K Ultra',
    servers: [
      { name: 'Server 1 (HLS Ultra)', url: 'https://cph-p2p-msl.akamaized.net/hls/live/2000341/test/master.m3u8', type: 'hls' },
      { name: 'Server 2 (DaddyLive Embed)', url: 'https://dlhd.so/stream/stream-401.php', type: 'iframe' }
    ]
  },

  // ================= ENTERTAINMENT & 24/7 =================
  {
    id: 'family-guy-247',
    name: 'Family Guy 24/7',
    category: 'Entertainment',
    logo: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=200&q=80',
    currentShow: 'Family Guy Season 10 Non-stop Marathon',
    nextShow: 'Road to Rhode Island Special',
    bgImage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    viewers: '850K watching',
    quality: '1080p HD',
    servers: [
      { name: 'Server 1 (HLS Ultra)', url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', type: 'hls' },
      { name: 'Server 2 (DLHD Embed)', url: 'https://dlhd.so/stream/stream-101.php', type: 'iframe' },
      { name: 'Server 3 (Backup Stream)', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', type: 'hls' }
    ]
  },
  {
    id: 'friends-247',
    name: 'Friends 24/7 HD',
    category: 'Entertainment',
    logo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    currentShow: 'The One Where Everyone Finds Out',
    nextShow: 'The One With All The Thanksgivings',
    bgImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    viewers: '1.1M watching',
    quality: '1080p HD',
    servers: [
      { name: 'Server 1 (HLS Ultra)', url: 'https://playertest.longtailvideo.com/adaptive/oceans/oceans.m3u8', type: 'hls' },
      { name: 'Server 2 (DaddyLive Embed)', url: 'https://dlhd.so/stream/stream-102.php', type: 'iframe' },
      { name: 'Server 3 (Backup Stream)', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', type: 'hls' }
    ]
  },
  {
    id: 'the-office-247',
    name: 'The Office 24/7',
    category: 'Entertainment',
    logo: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=200&q=80',
    currentShow: 'Dinner Party & Stress Relief Episodes',
    nextShow: 'Threat Level Midnight Movie',
    bgImage: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80',
    viewers: '930K watching',
    quality: '1080p HD',
    servers: [
      { name: 'Server 1 (HLS Ultra)', url: 'https://cph-p2p-msl.akamaized.net/hls/live/2000341/test/master.m3u8', type: 'hls' },
      { name: 'Server 2 (Backup Stream)', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', type: 'hls' }
    ]
  },
  {
    id: 'amc-tv',
    name: 'AMC Channel',
    category: 'Entertainment',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a2/AMC_Plus_logo.svg',
    currentShow: 'Breaking Bad & Better Call Saul Weekend',
    nextShow: '9:00 PM - The Walking Dead Universe',
    bgImage: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80',
    viewers: '610K watching',
    quality: '1080p HD',
    servers: [
      { name: 'Server 1 (HLS Ultra)', url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', type: 'hls' },
      { name: 'Server 2 (DaddyLive Embed)', url: 'https://dlhd.so/stream/stream-88.php', type: 'iframe' }
    ]
  },

  // ================= NEWS =================
  {
    id: 'cnn-live',
    name: 'CNN International',
    category: 'News',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b1/CNN_International_logo_%282014%29.svg',
    currentShow: 'CNN Live World Newsroom Special Briefing',
    nextShow: '8:00 PM - Anderson Cooper 360',
    bgImage: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=800&q=80',
    viewers: '1.6M watching',
    quality: '1080p HD',
    servers: [
      { name: 'Server 1 (HLS Ultra)', url: 'https://cph-p2p-msl.akamaized.net/hls/live/2000341/test/master.m3u8', type: 'hls' },
      { name: 'Server 2 (DaddyLive Embed)', url: 'https://dlhd.so/stream/stream-10.php', type: 'iframe' },
      { name: 'Server 3 (Backup Stream)', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4', type: 'hls' }
    ]
  },
  {
    id: 'bbc-news',
    name: 'BBC News Live',
    category: 'News',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/6/62/BBC_News_2019.svg',
    currentShow: 'BBC Outside Source - Global Headlines',
    nextShow: '8:00 PM - HARDtalk Interview',
    bgImage: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=800&q=80',
    viewers: '1.2M watching',
    quality: '1080p HD',
    servers: [
      { name: 'Server 1 (HLS Ultra)', url: 'https://playertest.longtailvideo.com/adaptive/oceans/oceans.m3u8', type: 'hls' },
      { name: 'Server 2 (DLHD Embed)', url: 'https://dlhd.so/stream/stream-12.php', type: 'iframe' }
    ]
  },

  // ================= MOVIES =================
  {
    id: 'hbo-west',
    name: 'HBO Cinema HD',
    category: 'Movies',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/d/de/HBO_logo.svg',
    currentShow: 'Live Feature: Dune Part Two (4K IMAX)',
    nextShow: '9:00 PM - House of the Dragon Season 2',
    bgImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    viewers: '2.1M watching',
    quality: '4K Ultra',
    servers: [
      { name: 'Server 1 (HLS 4K)', url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', type: 'hls' },
      { name: 'Server 2 (DaddyLive Embed)', url: 'https://dlhd.so/stream/stream-15.php', type: 'iframe' },
      { name: 'Server 3 (Backup Stream)', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4', type: 'hls' }
    ]
  },
  {
    id: 'fx-movies',
    name: 'FX Movie Channel',
    category: 'Movies',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7f/FX_logo_2013.svg',
    currentShow: 'Marvel Blockbuster Premiere: Spider-Man',
    nextShow: '8:30 PM - Deadpool Movie Special',
    bgImage: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80',
    viewers: '890K watching',
    quality: '1080p HD',
    servers: [
      { name: 'Server 1 (HLS Ultra)', url: 'https://playertest.longtailvideo.com/adaptive/oceans/oceans.m3u8', type: 'hls' },
      { name: 'Server 2 (DLHD Embed)', url: 'https://dlhd.so/stream/stream-18.php', type: 'iframe' }
    ]
  },

  // ================= DOCUMENTARY =================
  {
    id: 'discovery-hd',
    name: 'Discovery Channel HD',
    category: 'Documentary',
    logo: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=200&q=80',
    currentShow: 'Planet Earth III: Deep Ocean Secrets',
    nextShow: '8:00 PM - MythBusters Live Reloaded',
    bgImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    viewers: '620K watching',
    quality: '4K Ultra',
    servers: [
      { name: 'Server 1 (HLS 4K)', url: 'https://cph-p2p-msl.akamaized.net/hls/live/2000341/test/master.m3u8', type: 'hls' },
      { name: 'Server 2 (DaddyLive Embed)', url: 'https://dlhd.so/stream/stream-25.php', type: 'iframe' }
    ]
  },

  // ================= KIDS =================
  {
    id: 'cartoon-network',
    name: 'Cartoon Network',
    category: 'Kids',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/8/80/Cartoon_Network_2010_logo.svg',
    currentShow: 'Adventure Time & Regular Show Marathon',
    nextShow: '8:00 PM - Teen Titans Go!',
    bgImage: 'https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?auto=format&fit=crop&w=800&q=80',
    viewers: '750K watching',
    quality: '1080p HD',
    servers: [
      { name: 'Server 1 (HLS Ultra)', url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', type: 'hls' },
      { name: 'Server 2 (DLHD Embed)', url: 'https://dlhd.so/stream/stream-30.php', type: 'iframe' }
    ]
  }
];

export default function Live() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeChannel, setActiveChannel] = useState<ChannelStream | null>(null);
  const [showGuideModal, setShowGuideModal] = useState<boolean>(false);
  const [selectedRegion, setSelectedRegion] = useState<string>('US');

  const categories = ['All', 'Sports', 'Entertainment', 'News', 'Movies', 'Documentary', 'Kids'];
  const regions = ['US', 'CA', 'UK', 'EU'];

  const filteredChannels = HLS_CHANNELS.filter(c => {
    const matchesCategory = selectedCategory === 'All' || c.category === selectedCategory;
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.currentShow.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const channelsByCategory = categories.filter(cat => cat !== 'All').map(cat => ({
    category: cat,
    channels: HLS_CHANNELS.filter(c => c.category === cat && (searchQuery === '' || c.name.toLowerCase().includes(searchQuery.toLowerCase())))
  })).filter(group => group.channels.length > 0);

  return (
    <div className="min-h-screen pt-24 px-4 sm:px-8 pb-16 max-w-[1800px] mx-auto space-y-8">
      {/* Active Stream Player Modal */}
      {activeChannel && (
        <VideoPlayer
          title={`${activeChannel.name} - ${activeChannel.quality}`}
          type="show"
          backdropPath={activeChannel.bgImage}
          videoUrl={activeChannel.servers[0]?.type === 'hls' ? activeChannel.servers[0]?.url : undefined}
          iframeUrl={activeChannel.servers[0]?.type === 'iframe' ? activeChannel.servers[0]?.url : undefined}
          servers={activeChannel.servers}
          onClose={() => setActiveChannel(null)}
        />
      )}

      {/* TV Guide / EPG Schedule Modal */}
      {showGuideModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#141416] border border-white/15 rounded-3xl p-6 sm:p-8 max-w-4xl w-full max-h-[85vh] flex flex-col space-y-6 shadow-2xl relative">
            <button
              onClick={() => setShowGuideModal(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-full transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-600/20 text-red-500 rounded-2xl border border-red-500/30">
                <Tv className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white">Live EPG & TV Schedule</h2>
                <p className="text-xs text-gray-400">Dulo Live Schedule & Server Streams ({selectedRegion} Hub)</p>
              </div>
            </div>

            <div className="overflow-y-auto space-y-3 pr-2 scrollbar-thin">
              {HLS_CHANNELS.map((channel) => (
                <div 
                  key={channel.id}
                  onClick={() => {
                    setActiveChannel(channel);
                    setShowGuideModal(false);
                  }}
                  className="bg-[#1a1a1e] hover:bg-[#25252b] border border-white/10 hover:border-red-500/40 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-black/50 border border-white/10 p-2 flex items-center justify-center shrink-0">
                      <img src={channel.logo} alt={channel.name} className="max-h-full max-w-full object-contain" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white group-hover:text-red-400 transition-colors">{channel.name}</span>
                        <span className="text-[10px] font-black bg-red-600 text-white px-2 py-0.5 rounded-full uppercase">LIVE</span>
                        <span className="text-[10px] font-bold text-gray-400 bg-white/10 px-2 py-0.5 rounded-full">{channel.quality}</span>
                        <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">{channel.servers.length} Servers</span>
                      </div>
                      <p className="text-xs text-gray-300 font-medium mt-0.5">{channel.currentShow}</p>
                      {channel.nextShow && (
                        <p className="text-[11px] text-gray-500 mt-0.5">Next: {channel.nextShow}</p>
                      )}
                    </div>
                  </div>

                  <button className="flex items-center gap-2 bg-white/10 group-hover:bg-red-600 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all self-start sm:self-center shrink-0 cursor-pointer">
                    <Play className="w-3.5 h-3.5 fill-white" /> Watch Stream
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Hero Banner Header */}
      <div className="relative w-full rounded-3xl overflow-hidden bg-gradient-to-r from-red-950 via-black to-neutral-900 border border-white/10 p-6 sm:p-10 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm -z-10" />
        <div className="space-y-3 max-w-2xl">
          <div className="flex flex-wrap items-center gap-3">
            <span className="bg-red-600 text-white font-black text-xs uppercase px-3 py-1 rounded-full animate-pulse flex items-center gap-1.5 shadow-lg">
              <Radio className="w-3.5 h-3.5" /> DULO LIVE TV ENGINE
            </span>
            <span className="text-gray-400 font-bold text-xs uppercase tracking-wider">{HLS_CHANNELS.length} Active Channels</span>
            <span className="bg-emerald-500/20 text-emerald-400 font-bold text-xs px-3 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
              <Zap className="w-3 h-3" /> Multi-Server Live
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Live TV Streams & Sports Center
          </h1>
          <p className="text-gray-300 text-sm sm:text-base font-medium leading-relaxed">
            Streaming ESPN, FOX Sports, Sky Sports, CNN, HBO, 24/7 Shows and top cable channels with instant server fallback.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveChannel(HLS_CHANNELS[0])}
              className="flex items-center gap-2 bg-white text-black hover:bg-gray-200 px-6 py-2.5 rounded-full font-bold text-sm transition-all shadow-xl hover:scale-105 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-black" />
              Watch ESPN Live
            </button>
            <button
              onClick={() => setShowGuideModal(true)}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-full font-bold text-sm transition-all border border-white/15 cursor-pointer"
            >
              <Tv className="w-4 h-4 text-cyan-400" />
              Open TV Guide (EPG)
            </button>
          </div>
        </div>

        {/* Quick Search Input */}
        <div className="w-full md:w-80 space-y-2">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search live channels or sports..."
              className="w-full bg-[#181818]/90 border border-white/15 rounded-2xl py-3 pl-11 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500 shadow-xl backdrop-blur-md"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          </div>
        </div>
      </div>

      {/* Category Pills & Controls Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap shadow-md ${
                selectedCategory === cat
                  ? 'bg-red-600 text-white shadow-red-600/30'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
          <span className="text-xs font-bold text-gray-500 px-2">Total ({HLS_CHANNELS.length})</span>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              const nextIndex = (regions.indexOf(selectedRegion) + 1) % regions.length;
              setSelectedRegion(regions[nextIndex]);
            }}
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-xs font-bold px-4 py-2 rounded-full border border-white/10 transition-all cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-cyan-400" /> Region ({selectedRegion})
          </button>

          <button 
            onClick={() => setShowGuideModal(true)}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-4 py-2 rounded-full border border-white/20 transition-all cursor-pointer"
          >
            <Tv className="w-3.5 h-3.5" /> EPG Schedule
          </button>
        </div>
      </div>

      {/* Functional Channels Grid Display */}
      {selectedCategory !== 'All' || searchQuery !== '' ? (
        <div className="space-y-4">
          <h2 className="text-xl font-black text-white">
            {selectedCategory === 'All' ? 'Search Results' : `${selectedCategory} Channels`} ({filteredChannels.length})
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredChannels.map((channel) => (
              <div
                key={channel.id}
                onClick={() => setActiveChannel(channel)}
                className="group relative bg-[#141416] hover:bg-[#1f1f24] border border-white/10 hover:border-red-500/50 rounded-2xl p-4 cursor-pointer transition-all duration-300 shadow-xl flex flex-col justify-between aspect-[4/3] overflow-hidden"
              >
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-25 group-hover:opacity-40 transition-opacity duration-300" 
                  style={{ backgroundImage: `url(${channel.bgImage})` }} 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                
                {/* Header Badge */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className="text-[10px] font-black bg-red-600/90 text-white px-2 py-0.5 rounded-full uppercase tracking-widest shadow-md flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> LIVE
                  </span>
                  <span className="text-[10px] font-bold text-gray-300 bg-black/60 px-2 py-0.5 rounded-full border border-white/10">
                    {channel.viewers}
                  </span>
                </div>

                {/* Hover Play Circle */}
                <div className="absolute inset-0 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-12 h-12 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-2xl border border-white/30 transform group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 fill-white ml-0.5" />
                  </div>
                </div>

                {/* Footer Meta */}
                <div className="relative z-10 space-y-0.5 mt-auto">
                  <h3 className="text-sm font-bold text-white group-hover:text-red-400 transition-colors line-clamp-1">
                    {channel.name}
                  </h3>
                  <p className="text-[11px] text-gray-400 line-clamp-1 font-medium">
                    {channel.currentShow}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-10">
          {channelsByCategory.map((group) => (
            <div key={group.category} className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block animate-ping" />
                  {group.category}
                </h2>
                <span className="text-xs text-gray-400 font-bold">{group.channels.length} channels</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {group.channels.map((channel) => (
                  <div
                    key={channel.id}
                    onClick={() => setActiveChannel(channel)}
                    className="group relative bg-[#141416] hover:bg-[#1f1f24] border border-white/10 hover:border-red-500/50 rounded-2xl p-4 cursor-pointer transition-all duration-300 shadow-xl flex flex-col justify-between aspect-[4/3] overflow-hidden"
                  >
                    <div 
                      className="absolute inset-0 bg-cover bg-center opacity-25 group-hover:opacity-40 transition-opacity duration-300" 
                      style={{ backgroundImage: `url(${channel.bgImage})` }} 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                    
                    <div className="relative z-10 flex items-center justify-between">
                      <span className="text-[10px] font-black bg-red-600/90 text-white px-2 py-0.5 rounded-full uppercase tracking-widest shadow-md flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> LIVE
                      </span>
                      <span className="text-[10px] font-bold text-gray-300 bg-black/60 px-2 py-0.5 rounded-full border border-white/10">
                        {channel.viewers}
                      </span>
                    </div>

                    <div className="absolute inset-0 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-12 h-12 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-2xl border border-white/30 transform group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 fill-white ml-0.5" />
                      </div>
                    </div>

                    <div className="relative z-10 space-y-0.5 mt-auto">
                      <h3 className="text-sm font-bold text-white group-hover:text-red-400 transition-colors line-clamp-1">
                        {channel.name}
                      </h3>
                      <p className="text-[11px] text-gray-400 line-clamp-1 font-medium">
                        {channel.currentShow}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
