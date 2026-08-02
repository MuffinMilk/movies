import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { 
  Movie, 
  Show, 
  getTrending,
  getNetflixOriginals,
  getTopRatedMovies,
  getActionMovies,
  getComedyMovies,
  getHorrorMovies,
  getRomanceMovies,
  getNowPlayingMovies,
  searchMovies,
  searchShows,
  getImageUrl,
  getMovieDetails
} from '../lib/tmdb';
import MovieCard from '../components/MovieCard';
import ShowCard from '../components/ShowCard';
import Row from '../components/Row';
import Top10Row from '../components/Top10Row';
import ChannelsRow from '../components/ChannelsRow';
import LandscapeRow from '../components/LandscapeRow';
import MediaDetailModal from '../components/MediaDetailModal';
import { Loader2, Play, Info } from 'lucide-react';

export default function Home() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('search');
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMedia, setSelectedMedia] = useState<Movie | Show | null>(null);

  // Search state
  const [searchResults, setSearchResults] = useState<(Movie | Show)[]>([]);
  
  // Layout states
  const [nowPlaying, setNowPlaying] = useState<Movie[]>([]);
  const [trending, setTrending] = useState<(Movie | Show)[]>([]);
  const [originals, setOriginals] = useState<Show[]>([]);
  const [topRated, setTopRated] = useState<Movie[]>([]);
  const [action, setAction] = useState<Movie[]>([]);
  const [comedy, setComedy] = useState<Movie[]>([]);

  const [heroMovies, setHeroMovies] = useState<Movie[]>([]);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        if (query) {
          const [movieRes, showRes] = await Promise.all([
            searchMovies(query),
            searchShows(query)
          ]);
          setSearchResults([...movieRes, ...showRes].sort((a, b) => b.vote_average - a.vote_average));
        } else {
          const [
            nowPlayingData,
            trendingData,
            originalsData,
            topRatedData,
            actionData,
            comedyData
          ] = await Promise.all([
            getNowPlayingMovies(),
            getTrending(),
            getNetflixOriginals(),
            getTopRatedMovies(),
            getActionMovies(),
            getComedyMovies()
          ]);
          
          setNowPlaying(nowPlayingData);
          setTrending(trendingData);
          setOriginals(originalsData);
          setTopRated(topRatedData);
          setAction(actionData);
          setComedy(comedyData);

          // Fetch hero movies
          const heroIds = ['1083381', '1339713', '936075', '931285'];
          const heroDataPromises = heroIds.map(id => getMovieDetails(id).catch(() => null));
          const resolvedHeroData = (await Promise.all(heroDataPromises)).filter(m => m !== null) as Movie[];
          setHeroMovies(resolvedHeroData);
        }
      } catch (err) {
        setError('Failed to load content. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [query]);

  useEffect(() => {
    if (heroMovies.length > 1) {
      const interval = setInterval(() => {
        setCurrentHeroIndex((prev) => (prev + 1) % heroMovies.length);
      }, 7000);
      return () => clearInterval(interval);
    }
  }, [heroMovies.length]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-12 h-12 text-cyan-400 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <div className="text-red-400 py-12 bg-red-400/10 rounded-xl border border-red-400/20">
          {error}
        </div>
      </div>
    );
  }

  // SEARCH RESULTS VIEW
  if (query) {
    return (
      <div className="container mx-auto px-4 pt-28 pb-16">
        <h1 className="text-3xl font-bold text-white mb-8">
          Search Results for "{query}"
        </h1>
        {searchResults.length === 0 ? (
          <div className="text-center text-gray-400 py-20 bg-white/5 rounded-2xl border border-white/10">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-white mb-2">No results found</h3>
            <p>Try adjusting your search term.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
            {searchResults.map((item, index) => (
              <React.Fragment key={`${'title' in item ? 'movie' : 'tv'}-${item.id}-${index}`}>
                {'title' in item ? <MovieCard movie={item as Movie} /> : <ShowCard show={item as Show} />}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
    );
  }

  const featuredItem = heroMovies.length > 0 ? heroMovies[currentHeroIndex] : (nowPlaying.length > 0 ? nowPlaying[0] : null);

  return (
    <div className="w-full pb-16 pt-20 px-4 sm:px-8 max-w-[1700px] mx-auto">
      {/* Detail Modal */}
      {selectedMedia && (
        <MediaDetailModal 
          item={selectedMedia} 
          type={'title' in selectedMedia ? 'movie' : 'show'} 
          onClose={() => setSelectedMedia(null)} 
        />
      )}

      {/* Hero Section */}
      {featuredItem && (
        <div className="relative w-full h-[52vh] min-h-[420px] max-h-[600px] mb-8 overflow-hidden rounded-3xl border border-white/10 shadow-2xl bg-black">
          <AnimatePresence mode="wait">
            <motion.div
              key={featuredItem.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2 }}
              className="absolute inset-0"
            >
              <img 
                src={getImageUrl(featuredItem.backdrop_path, 'original')} 
                alt={'title' in featuredItem ? featuredItem.title : featuredItem.name}
                className="w-full h-full object-cover"
              />
              {/* Radial and bottom gradient overlays for dark ambiance */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/40 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
              
              <div className="absolute bottom-12 left-0 w-full px-6 sm:px-12 flex flex-col items-start z-10 max-w-3xl">
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                >
                  {(featuredItem as any)?.images?.logos?.length > 0 ? (
                    <img
                      src={getImageUrl((featuredItem as any).images.logos[0].file_path, 'w500')}
                      alt={'title' in featuredItem ? featuredItem.title : featuredItem.name}
                      className="max-w-[320px] sm:max-w-[420px] w-full h-auto object-contain mb-4 filter drop-shadow-[0_10px_10px_rgba(0,0,0,0.9)]"
                    />
                  ) : (
                    <h1 className="text-4xl sm:text-6xl font-black text-white mb-3 tracking-tight uppercase drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
                      {'title' in featuredItem ? featuredItem.title : featuredItem.name}
                    </h1>
                  )}

                  <p className="text-gray-300 text-sm sm:text-base line-clamp-3 mb-6 drop-shadow-md font-medium leading-relaxed max-w-xl">
                    {featuredItem.overview || "Avatar Aang, the world's last Airbender, learns of an ancient power that could save his culture from extinction. With the help of his friends, he embarks on an unforgettable journey."}
                  </p>

                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setSelectedMedia(featuredItem)}
                      className="flex items-center justify-center gap-2 bg-white text-black hover:bg-gray-200 px-6 py-2.5 rounded-full font-bold text-sm transition-all shadow-lg hover:scale-105 cursor-pointer"
                    >
                      <Play className="w-4 h-4 fill-black text-black" />
                      Watch now
                    </button>

                    <button
                      onClick={() => setSelectedMedia(featuredItem)}
                      className="flex items-center justify-center gap-2 bg-white/10 text-white hover:bg-white/20 border border-white/20 px-6 py-2.5 rounded-full font-bold text-sm transition-all backdrop-blur-md shadow-lg hover:scale-105 cursor-pointer"
                    >
                      <Info className="w-4 h-4 text-white" />
                      More info
                    </button>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Hero Indicator Dots */}
          {heroMovies.length > 1 && (
            <div className="absolute bottom-6 right-8 z-20 flex gap-2">
              {heroMovies.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentHeroIndex(idx)}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === currentHeroIndex ? 'bg-white w-6' : 'bg-white/30 hover:bg-white/60 w-2'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Featured Landscape Carousel */}
      <LandscapeRow items={nowPlaying.length > 0 ? nowPlaying : (heroMovies.length > 0 ? heroMovies : trending as Movie[])} />

      {/* Channels & Apps */}
      <ChannelsRow />

      {/* Top 10 TV Shows */}
      <Top10Row title="Top 10 TV Shows" items={originals.length > 0 ? originals : (trending as Show[])} />

      {/* Top 10 Movies */}
      <Top10Row title="Top 10 Movies" items={topRated.length > 0 ? topRated : nowPlaying} />

      {/* Popular Movies */}
      <div className="mb-10">
        <Row title="Popular Movies" items={trending.filter(i => 'title' in i)} />
      </div>

      {/* Popular Shows */}
      <div className="mb-10">
        <Row title="Popular TV Shows" items={trending.filter(i => !('title' in i))} />
      </div>

      {/* Action Movies */}
      <div className="mb-10">
        <Row title="Action Blockbusters" items={action} />
      </div>

      {/* Comedy */}
      <div className="mb-10">
        <Row title="Comedy Hits" items={comedy} />
      </div>
    </div>
  );
}
