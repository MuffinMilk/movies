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
  getMovieDetails,
  getMovieRating
} from '../lib/tmdb';
import { getContinueWatching, removeFromContinueWatching } from '../lib/storage';
import MovieCard from '../components/MovieCard';
import ShowCard from '../components/ShowCard';
import Row from '../components/Row';
import { Loader2, Play, Info } from 'lucide-react';

export default function Home() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('search');
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Search state
  const [searchResults, setSearchResults] = useState<(Movie | Show)[]>([]);
  
  // Netflix layout state
  const [continueWatching, setContinueWatching] = useState<(Movie | Show)[]>([]);
  const [nowPlaying, setNowPlaying] = useState<Movie[]>([]);
  const [trending, setTrending] = useState<(Movie | Show)[]>([]);
  const [originals, setOriginals] = useState<Show[]>([]);
  const [topRated, setTopRated] = useState<Movie[]>([]);
  const [action, setAction] = useState<Movie[]>([]);
  const [comedy, setComedy] = useState<Movie[]>([]);
  const [horror, setHorror] = useState<Movie[]>([]);
  const [romance, setRomance] = useState<Movie[]>([]);

  const [heroMovies, setHeroMovies] = useState<Movie[]>([]);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

  const handleRemoveFromContinueWatching = (id: number) => {
    removeFromContinueWatching(id);
    setContinueWatching(getContinueWatching());
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        if (query) {
          // If searching, fetch both movies and shows and combine them
          const [movieRes, showRes] = await Promise.all([
            searchMovies(query),
            searchShows(query)
          ]);
          setSearchResults([...movieRes, ...showRes].sort((a, b) => b.vote_average - a.vote_average));
        } else {
          // Load continue watching from local storage
          setContinueWatching(getContinueWatching());

          // Fetch all Netflix rows
          const [
            nowPlayingData,
            trendingData,
            originalsData,
            topRatedData,
            actionData,
            comedyData,
            horrorData,
            romanceData
          ] = await Promise.all([
            getNowPlayingMovies(),
            getTrending(),
            getNetflixOriginals(),
            getTopRatedMovies(),
            getActionMovies(),
            getComedyMovies(),
            getHorrorMovies(),
            getRomanceMovies()
          ]);
          
          setNowPlaying(nowPlayingData);
          setTrending(trendingData);
          setOriginals(originalsData);
          setTopRated(topRatedData);
          setAction(actionData);
          setComedy(comedyData);
          setHorror(horrorData);
          setRomance(romanceData);

          // Fetch custom hero movies
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
      }, 7000); // Switch every 7 seconds
      return () => clearInterval(interval);
    }
  }, [heroMovies.length]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
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
      <div className="container mx-auto px-4 py-24">
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

  // NETFLIX LAYOUT VIEW
  const featuredItem = heroMovies.length > 0 ? heroMovies[currentHeroIndex] : (nowPlaying.length > 0 ? nowPlaying[0] : null);

  return (
    <div className="w-full pb-12">
      {/* Hero Section */}
      {featuredItem && (
        <div className="relative w-full h-[60vh] min-h-[500px] mb-8 overflow-hidden rounded-2xl border border-white/5 shadow-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={featuredItem.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
              className="absolute inset-0"
            >
              <img 
                src={getImageUrl(featuredItem.backdrop_path, 'original')} 
                alt={'title' in featuredItem ? featuredItem.title : featuredItem.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-transparent to-transparent flex" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0f0f0f]/90 via-[#0f0f0f]/40 to-transparent" />
              
              <div className="absolute bottom-12 left-0 w-full px-8 md:px-12 flex flex-col items-start z-10">
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="max-w-2xl"
                >
                  {(featuredItem as any)?.images?.logos?.length > 0 ? (
                    <img
                      src={getImageUrl((featuredItem as any).images.logos[0].file_path, 'w500')}
                      alt={'title' in featuredItem ? featuredItem.title : featuredItem.name}
                      className="max-w-[400px] w-full h-auto object-contain mb-4 drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]"
                    />
                  ) : (
                    <h2 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] logo-text">
                      <span className="text-transparent bg-clip-text bg-gradient-to-b from-blue-100 to-white">
                        {'title' in featuredItem ? featuredItem.title : featuredItem.name}
                      </span>
                    </h2>
                  )}
                  {getMovieRating((featuredItem as any)?.release_dates) && (
                    <div className="mb-4">
                      <span className="px-3 py-1 rounded-sm bg-white/20 border border-white/30 text-xs font-bold text-white shadow-lg backdrop-blur-md">
                        {getMovieRating((featuredItem as any).release_dates)}
                      </span>
                    </div>
                  )}
                  <p className="text-gray-300 text-sm md:text-base line-clamp-3 mb-6 drop-shadow-md font-medium leading-relaxed">
                    {featuredItem.overview}
                  </p>
                  <div className="flex items-center gap-3">
                    <Link 
                      to={`/${'title' in featuredItem ? 'movie' : 'show'}/${featuredItem.id}`} 
                      className="flex items-center justify-center gap-2 bg-white text-black hover:bg-gray-200 px-6 py-2 rounded-md font-bold text-sm transition-all"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      Play
                    </Link>
                    <button 
                      className="flex items-center justify-center bg-white/10 text-white hover:bg-white/20 border border-white/20 w-9 h-9 rounded-md transition-all backdrop-blur-md"
                    >
                      <span className="text-lg font-light leading-none">+</span>
                    </button>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Hero Indicator Dots */}
          {heroMovies.length > 1 && (
            <div className="absolute bottom-4 right-8 z-20 flex gap-2">
              {heroMovies.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentHeroIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    idx === currentHeroIndex ? 'bg-white w-6' : 'bg-white/40 hover:bg-white/70'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Rows */}
      <div className="flex flex-col gap-6 relative z-20">
        {continueWatching.length > 0 && (
          <Row 
            title="Continue Watching" 
            items={continueWatching} 
            onRemoveItem={handleRemoveFromContinueWatching}
          />
        )}
        <Row title="In theater now" items={nowPlaying.slice(1)} />
        <Row title="Trending Now" items={trending} />
        <Row title="Awdrex Originals" items={originals} />
        <Row title="Top Rated" items={topRated} />
        <Row title="Action Thrillers" items={action} />
        <Row title="Comedies" items={comedy} />
        <Row title="Scary Movies" items={horror} />
        <Row title="Romance" items={romance} />
      </div>
    </div>
  );
}
