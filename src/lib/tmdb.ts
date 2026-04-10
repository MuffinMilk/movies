const TMDB_API_KEY = '1070730380f5fee0d87cf0382670b255';
const BASE_URL = '/api/tmdb';

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
  const res = await fetch(`${BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}`);
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
  const res = await fetch(`${BASE_URL}/tv/${id}?api_key=${TMDB_API_KEY}`);
  if (!res.ok) throw new Error('Failed to fetch show details');
  return res.json();
};

export const getImageUrl = (path: string | null, size: 'w500' | 'original' = 'w500') => {
  if (!path) return 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?auto=format&fit=crop&w=500&q=80';
  return `/api/tmdb-image/${size}${path}`;
};
