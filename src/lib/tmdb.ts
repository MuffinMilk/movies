const TMDB_API_KEY = '1070730380f5fee0d87cf0382670b255';
const BASE_URL = 'https://api.themoviedb.org/3';

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
}

export interface MovieDetails extends Movie {
  runtime: number;
  genres: { id: number; name: string }[];
  tagline: string;
  videos?: { results: any[] };
  credits?: { cast: any[] };
  images?: { logos: any[] };
  release_dates?: { results: any[] };
}

export interface Show {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  vote_average: number;
}

export interface ShowDetails extends Show {
  episode_run_time: number[];
  genres: { id: number; name: string }[];
  tagline: string;
  number_of_seasons: number;
  seasons: {
    id: number;
    name: string;
    season_number: number;
    episode_count: number;
  }[];
  videos?: { results: any[] };
  credits?: { cast: any[] };
  images?: { logos: any[] };
  content_ratings?: { results: any[] };
}

export const getPopularMovies = async (page: number = 1): Promise<Movie[]> => {
  const res = await fetch(`${BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&page=${page}`);
  if (!res.ok) throw new Error('Failed to fetch popular movies');
  const data = await res.json();
  return data.results;
};

export const searchMovies = async (query: string, page: number = 1): Promise<Movie[]> => {
  const res = await fetch(`${BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&page=${page}`);
  if (!res.ok) throw new Error('Failed to search movies');
  const data = await res.json();
  return data.results;
};

export const getMovieDetails = async (id: string): Promise<MovieDetails> => {
  const res = await fetch(`${BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}&append_to_response=videos,credits,images,release_dates&include_image_language=en,null`);
  if (!res.ok) throw new Error('Failed to fetch movie details');
  return res.json();
};

export const getPopularShows = async (page: number = 1): Promise<Show[]> => {
  const res = await fetch(`${BASE_URL}/tv/popular?api_key=${TMDB_API_KEY}&page=${page}`);
  if (!res.ok) throw new Error('Failed to fetch popular shows');
  const data = await res.json();
  return data.results;
};

export const getTrending = async (): Promise<(Movie | Show)[]> => {
  const res = await fetch(`${BASE_URL}/trending/all/week?api_key=${TMDB_API_KEY}`);
  if (!res.ok) throw new Error('Failed to fetch trending');
  const data = await res.json();
  return data.results;
};

export const getNetflixOriginals = async (): Promise<Show[]> => {
  const res = await fetch(`${BASE_URL}/discover/tv?api_key=${TMDB_API_KEY}&with_networks=213`);
  if (!res.ok) throw new Error('Failed to fetch originals');
  const data = await res.json();
  return data.results;
};

export const getTopRatedMovies = async (): Promise<Movie[]> => {
  const res = await fetch(`${BASE_URL}/movie/top_rated?api_key=${TMDB_API_KEY}`);
  if (!res.ok) throw new Error('Failed to fetch top rated');
  const data = await res.json();
  return data.results;
};

export const getActionMovies = async (): Promise<Movie[]> => {
  const res = await fetch(`${BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=28`);
  if (!res.ok) throw new Error('Failed to fetch action movies');
  const data = await res.json();
  return data.results;
};

export const getComedyMovies = async (): Promise<Movie[]> => {
  const res = await fetch(`${BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=35`);
  if (!res.ok) throw new Error('Failed to fetch comedy movies');
  const data = await res.json();
  return data.results;
};

export const getHorrorMovies = async (): Promise<Movie[]> => {
  const res = await fetch(`${BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=27`);
  if (!res.ok) throw new Error('Failed to fetch horror movies');
  const data = await res.json();
  return data.results;
};

export const getRomanceMovies = async (): Promise<Movie[]> => {
  const res = await fetch(`${BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=10749`);
  if (!res.ok) throw new Error('Failed to fetch romance movies');
  const data = await res.json();
  return data.results;
};

export const searchShows = async (query: string, page: number = 1): Promise<Show[]> => {
  const res = await fetch(`${BASE_URL}/search/tv?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&page=${page}`);
  if (!res.ok) throw new Error('Failed to search shows');
  const data = await res.json();
  return data.results;
};

export const getShowDetails = async (id: string): Promise<ShowDetails> => {
  const res = await fetch(`${BASE_URL}/tv/${id}?api_key=${TMDB_API_KEY}&append_to_response=videos,credits,images,content_ratings&include_image_language=en,null`);
  if (!res.ok) throw new Error('Failed to fetch show details');
  return res.json();
};

export const getSeasonDetails = async (showId: number | string, seasonNumber: number = 1): Promise<any> => {
  try {
    const res = await fetch(`${BASE_URL}/tv/${showId}/season/${seasonNumber}?api_key=${TMDB_API_KEY}`);
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error('Failed to fetch season details:', err);
    return null;
  }
};

export const getMediaLogo = async (id: number | string, type: 'movie' | 'show' | 'tv' = 'movie'): Promise<string | null> => {
  try {
    const mediaType = type === 'show' ? 'tv' : type;
    const res = await fetch(`${BASE_URL}/${mediaType}/${id}/images?api_key=${TMDB_API_KEY}&include_image_language=en,null`);
    if (!res.ok) return null;
    const data = await res.json();
    const logo = data.logos?.[0]?.file_path;
    return logo ? logo : null;
  } catch (err) {
    return null;
  }
};

export const getNowPlayingMovies = async (): Promise<Movie[]> => {
  const res = await fetch(`${BASE_URL}/movie/now_playing?api_key=${TMDB_API_KEY}`);
  if (!res.ok) throw new Error('Failed to fetch now playing movies');
  const data = await res.json();
  return data.results;
};

export const searchMulti = async (query: string, page: number = 1): Promise<(Movie | Show)[]> => {
  const res = await fetch(`${BASE_URL}/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&page=${page}`);
  if (!res.ok) throw new Error('Failed to search');
  const data = await res.json();
  return data.results.filter((item: any) => item.media_type === 'movie' || item.media_type === 'tv');
};

export const getAnime = async (page: number = 1, category?: string): Promise<Show[]> => {
  let endpoint = `${BASE_URL}/discover/tv?api_key=${TMDB_API_KEY}&with_genres=16&with_original_language=ja&page=${page}&sort_by=popularity.desc`;
  
  if (category === 'Trending') {
    endpoint = `${BASE_URL}/discover/tv?api_key=${TMDB_API_KEY}&with_genres=16&with_original_language=ja&sort_by=popularity.desc&page=${page}`;
  } else if (category === 'Top Rated') {
    endpoint = `${BASE_URL}/discover/tv?api_key=${TMDB_API_KEY}&with_genres=16&with_original_language=ja&sort_by=vote_average.desc&vote_count.gte=100&page=${page}`;
  } else if (category === 'Airing Now') {
    endpoint = `${BASE_URL}/tv/on_the_air?api_key=${TMDB_API_KEY}&page=${page}`;
  } else if (category === 'Upcoming') {
    endpoint = `${BASE_URL}/discover/tv?api_key=${TMDB_API_KEY}&with_genres=16&with_original_language=ja&first_air_date.gte=2025-01-01&page=${page}`;
  } else if (category === 'Action' || category === 'Adventure') {
    endpoint = `${BASE_URL}/discover/tv?api_key=${TMDB_API_KEY}&with_genres=16,10759&with_original_language=ja&page=${page}`;
  } else if (category === 'Comedy') {
    endpoint = `${BASE_URL}/discover/tv?api_key=${TMDB_API_KEY}&with_genres=16,35&with_original_language=ja&page=${page}`;
  } else if (category === 'Drama') {
    endpoint = `${BASE_URL}/discover/tv?api_key=${TMDB_API_KEY}&with_genres=16,18&with_original_language=ja&page=${page}`;
  } else if (category === 'Fantasy' || category === 'Sci-Fi' || category === 'Supernatural') {
    endpoint = `${BASE_URL}/discover/tv?api_key=${TMDB_API_KEY}&with_genres=16,10765&with_original_language=ja&page=${page}`;
  } else if (category === 'Romance' || category === 'Slice of Life') {
    endpoint = `${BASE_URL}/discover/tv?api_key=${TMDB_API_KEY}&with_genres=16,35&with_original_language=ja&page=${page}`;
  } else if (category === 'Sports') {
    endpoint = `${BASE_URL}/discover/tv?api_key=${TMDB_API_KEY}&with_genres=16&with_original_language=ja&page=${page}`;
  }

  const res = await fetch(endpoint);
  if (!res.ok) throw new Error('Failed to fetch anime');
  const data = await res.json();
  let results = data.results || [];
  if (category === 'Airing Now') {
    results = results.filter((item: any) => item.original_language === 'ja' || item.genre_ids?.includes(16));
  }
  return results;
};

export const getAnimeMovies = async (page: number = 1): Promise<Movie[]> => {
  const res = await fetch(`${BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=16&with_original_language=ja&sort_by=popularity.desc&page=${page}`);
  if (!res.ok) throw new Error('Failed to fetch anime movies');
  const data = await res.json();
  return data.results;
};

export const getAllAnimeAllPages = async (maxPages: number = 5, category?: string): Promise<Show[]> => {
  try {
    const promises = Array.from({ length: maxPages }, (_, i) => getAnime(i + 1, category));
    const resultsArray = await Promise.all(promises);
    const combined = resultsArray.flat();
    // Remove duplicates
    const uniqueMap = new Map();
    combined.forEach(item => {
      if (item && item.id && !uniqueMap.has(item.id)) {
        uniqueMap.set(item.id, item);
      }
    });
    return Array.from(uniqueMap.values());
  } catch (err) {
    console.error('Failed to fetch all anime pages:', err);
    return getAnime(1, category);
  }
};

export const getShowsByCategory = async (category: string, page: number = 1): Promise<Show[]> => {
  let endpoint = `${BASE_URL}/tv/popular?api_key=${TMDB_API_KEY}&page=${page}`;
  
  if (category === 'Top Rated') {
    endpoint = `${BASE_URL}/tv/top_rated?api_key=${TMDB_API_KEY}&page=${page}`;
  } else if (category === 'Popular') {
    endpoint = `${BASE_URL}/tv/popular?api_key=${TMDB_API_KEY}&page=${page}`;
  } else if (category === 'New Seasons') {
    endpoint = `${BASE_URL}/tv/on_the_air?api_key=${TMDB_API_KEY}&page=${page}`;
  } else if (category === 'Action & Adventure') {
    endpoint = `${BASE_URL}/discover/tv?api_key=${TMDB_API_KEY}&with_genres=10759&page=${page}`;
  } else if (category === 'Animation') {
    endpoint = `${BASE_URL}/discover/tv?api_key=${TMDB_API_KEY}&with_genres=16&page=${page}`;
  } else if (category === 'Comedy') {
    endpoint = `${BASE_URL}/discover/tv?api_key=${TMDB_API_KEY}&with_genres=35&page=${page}`;
  } else if (category === 'Crime') {
    endpoint = `${BASE_URL}/discover/tv?api_key=${TMDB_API_KEY}&with_genres=80&page=${page}`;
  } else if (category === 'Documentary') {
    endpoint = `${BASE_URL}/discover/tv?api_key=${TMDB_API_KEY}&with_genres=99&page=${page}`;
  } else if (category === 'Drama') {
    endpoint = `${BASE_URL}/discover/tv?api_key=${TMDB_API_KEY}&with_genres=18&page=${page}`;
  } else if (category === 'Family') {
    endpoint = `${BASE_URL}/discover/tv?api_key=${TMDB_API_KEY}&with_genres=10751&page=${page}`;
  } else if (category === 'Mystery') {
    endpoint = `${BASE_URL}/discover/tv?api_key=${TMDB_API_KEY}&with_genres=9648&page=${page}`;
  } else if (category === 'Sci-Fi & Fantasy') {
    endpoint = `${BASE_URL}/discover/tv?api_key=${TMDB_API_KEY}&with_genres=10765&page=${page}`;
  } else if (category === 'War & Politics') {
    endpoint = `${BASE_URL}/discover/tv?api_key=${TMDB_API_KEY}&with_genres=10768&page=${page}`;
  }

  const res = await fetch(endpoint);
  if (!res.ok) throw new Error('Failed to fetch shows');
  const data = await res.json();
  return data.results || [];
};

export const getAllShowsAllPages = async (maxPages: number = 5, category: string = 'All Shows'): Promise<Show[]> => {
  try {
    const promises = Array.from({ length: maxPages }, (_, i) => getShowsByCategory(category, i + 1));
    const resultsArray = await Promise.all(promises);
    const combined = resultsArray.flat();
    const uniqueMap = new Map();
    combined.forEach(item => {
      if (item && item.id && !uniqueMap.has(item.id)) {
        uniqueMap.set(item.id, item);
      }
    });
    return Array.from(uniqueMap.values());
  } catch (err) {
    console.error('Failed to fetch all shows pages:', err);
    return getShowsByCategory(category, 1);
  }
};

export const getRecommendations = async (id: number | string, type: 'movie' | 'show' | 'tv' = 'movie'): Promise<any[]> => {
  try {
    const mediaType = type === 'show' ? 'tv' : type;
    let res = await fetch(`${BASE_URL}/${mediaType}/${id}/recommendations?api_key=${TMDB_API_KEY}`);
    if (!res.ok) {
      res = await fetch(`${BASE_URL}/${mediaType}/${id}/similar?api_key=${TMDB_API_KEY}`);
    }
    if (!res.ok) return [];
    const data = await res.json();
    return data.results || [];
  } catch (err) {
    console.error('Failed to fetch recommendations:', err);
    return [];
  }
};

export const getImageUrl = (path: string | null, size: 'w500' | 'original' = 'w500') => {
  if (!path) return 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=500&q=80';
  if (path.startsWith('http')) return path;
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

export const getMovieRating = (releaseDates?: { results: any[] }) => {
  if (!releaseDates?.results) return null;
  const usRelease = releaseDates.results.find((r: any) => r.iso_3166_1 === 'US');
  if (usRelease && usRelease.release_dates) {
    const certification = usRelease.release_dates.find((r: any) => r.certification)?.certification;
    if (certification) return certification;
  }
  return null;
};

export const getMoviesByCategoryOrGenre = async (category: string): Promise<Movie[]> => {
  if (category === 'All Movies') {
    const [p1, p2, top, now, action, comedy, horror, romance] = await Promise.all([
      getPopularMovies(1),
      getPopularMovies(2),
      getTopRatedMovies(),
      getNowPlayingMovies(),
      getActionMovies(),
      getComedyMovies(),
      getHorrorMovies(),
      getRomanceMovies(),
    ]);
    const combined = [...p1, ...p2, ...top, ...now, ...action, ...comedy, ...horror, ...romance];
    const uniqueMap = new Map();
    combined.forEach(m => {
      if (m && m.id && !uniqueMap.has(m.id)) {
        uniqueMap.set(m.id, m);
      }
    });
    return Array.from(uniqueMap.values());
  }

  if (category === 'Popular') return getPopularMovies();
  if (category === 'Top Rated') return getTopRatedMovies();
  if (category === 'In Theaters') return getNowPlayingMovies();
  if (category === 'Coming Soon') {
    const res = await fetch(`${BASE_URL}/movie/upcoming?api_key=${TMDB_API_KEY}`);
    const data = await res.json();
    return data.results || getPopularMovies();
  }

  const genreMap: Record<string, number> = {
    'Action & Adventure': 28,
    'Animation': 16,
    'Comedy': 35,
    'Crime': 80,
    'Documentary': 99,
    'Drama': 18,
    'Family': 10751,
    'Fantasy': 14,
    'Horror': 27,
    'Mystery': 9648,
    'Romance': 10749,
    'Sci-Fi': 878,
    'Thriller': 53,
  };

  const genreId = genreMap[category];
  if (genreId) {
    const res = await fetch(`${BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${genreId}`);
    if (!res.ok) throw new Error('Failed to fetch genre movies');
    const data = await res.json();
    return data.results || [];
  }

  return getPopularMovies();
};

export const getShowRating = (contentRatings?: { results: any[] }) => {
  if (!contentRatings?.results) return null;
  const usRating = contentRatings.results.find((r: any) => r.iso_3166_1 === 'US');
  return usRating?.rating || null;
};
