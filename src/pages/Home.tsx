import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
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
  searchMovies,
  searchShows,
  getImageUrl 
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
  const [trending, setTrending] = useState<(Movie | Show)[]>([]);
  const [originals, setOriginals] = useState<Show[]>([]);
  const [topRated, setTopRated] = useState<Movie[]>([]);
  const [action, setAction] = useState<Movie[]>([]);
  const [comedy, setComedy] = useState<Movie[]>([]);
  const [horror, setHorror] = useState<Movie[]>([]);
  const [romance, setRomance] = useState<Movie[]>([]);

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
            trendingData,
            originalsData,
            topRatedData,
            actionData,
            comedyData,
            horrorData,
            romanceData
          ] = await Promise.all([
            getTrending(),
            getNetflixOriginals(),
            getTopRatedMovies(),
            getActionMovies(),
            getComedyMovies(),
            getHorrorMovies(),
            getRomanceMovies()
          ]);
          
          setTrending(trendingData);
          setOriginals(originalsData);
          setTopRated(topRatedData);
          setAction(actionData);
          setComedy(comedyData);
          setHorror(horrorData);
          setRomance(romanceData);
        }
      } catch (err) {
        setError('Failed to load content. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [query]);

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
            {searchResults.map((item) => (
              <React.Fragment key={`${'title' in item ? 'movie' : 'tv'}-${item.id}`}>
                {'title' in item ? <MovieCard movie={item as Movie} /> : <ShowCard show={item as Show} />}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
    );
  }

  // NETFLIX LAYOUT VIEW
  const featuredItem = originals.length > 0 ? originals[Math.floor(Math.random() * Math.min(originals.length, 5))] : null;

  return (
    <div className="w-full pb-12">
      {/* Hero Section */}
      {featuredItem && (
        <div className="relative w-full h-[85vh] mb-8 overflow-hidden">
          <img 
            src={getImageUrl(featuredItem.backdrop_path, 'original')} 
            alt={featuredItem.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent" />
          
          <div className="absolute bottom-[20%] left-0 w-full px-4 md:px-12 lg:px-16">
            <div className="max-w-2xl">
              <h2 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight drop-shadow-lg">
                {featuredItem.name}
              </h2>
              <p className="text-gray-200 text-lg md:text-xl line-clamp-3 mb-8 drop-shadow-md font-medium">
                {featuredItem.overview}
              </p>
              <div className="flex items-center gap-4">
                <Link 
                  to={`/show/${featuredItem.id}`} 
                  className="group flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-500 hover:to-pink-500 px-8 py-3.5 rounded-full font-bold text-lg transition-all duration-300 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105"
                >
                  <Play className="w-6 h-6 fill-current transition-transform group-hover:scale-110" />
                  Watch Now
                </Link>
                <Link 
                  to={`/show/${featuredItem.id}`} 
                  className="flex items-center gap-2 bg-white/10 text-white hover:bg-white hover:text-black border border-white/20 px-8 py-3.5 rounded-full font-bold text-lg transition-all duration-300 backdrop-blur-md hover:scale-105"
                >
                  <Info className="w-6 h-6" />
                  Details
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rows */}
      <div className="flex flex-col gap-8 -mt-24 relative z-20">
        {continueWatching.length > 0 && (
          <Row 
            title="Continue Watching" 
            items={continueWatching} 
            onRemoveItem={handleRemoveFromContinueWatching}
          />
        )}
        <Row title="Trending Now" items={trending} />
        <Row title="Awdres Originals" items={originals} />
        <Row title="Top Rated" items={topRated} />
        <Row title="Action Thrillers" items={action} />
        <Row title="Comedies" items={comedy} />
        <Row title="Scary Movies" items={horror} />
        <Row title="Romance" items={romance} />
      </div>
    </div>
  );
}
