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

export const getAnime = async (page: number = 1): Promise<Show[]> => {
  const res = await fetch(`${BASE_URL}/discover/tv?api_key=${TMDB_API_KEY}&with_genres=16&with_original_language=ja&page=${page}`);
  if (!res.ok) throw new Error('Failed to fetch anime');
  const data = await res.json();
  return data.results;
};

export const getImageUrl = (path: string | null, size: 'w500' | 'original' = 'w500') => {
  if (!path) return 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?auto=format&fit=crop&w=500&q=80';
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

export const getShowRating = (contentRatings?: { results: any[] }) => {
  if (!contentRatings?.results) return null;
  const usRating = contentRatings.results.find((r: any) => r.iso_3166_1 === 'US');
  return usRating?.rating || null;
};
