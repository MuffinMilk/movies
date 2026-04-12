import { Movie, Show } from './tmdb';

const STORAGE_KEY = 'awdres_continue_watching';

export const getContinueWatching = (): (Movie | Show)[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Failed to parse continue watching data', e);
    return [];
  }
};

export const saveToContinueWatching = (item: Movie | Show) => {
  try {
    const current = getContinueWatching();
    // Remove if already exists to move it to the front
    const filtered = current.filter(i => i.id !== item.id);
    // Add to front
    filtered.unshift(item);
    // Keep only the last 20 items
    const limited = filtered.slice(0, 20);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(limited));
  } catch (e) {
    console.error('Failed to save to continue watching', e);
  }
};

export const removeFromContinueWatching = (id: number) => {
  try {
    const current = getContinueWatching();
    const filtered = current.filter(i => i.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.error('Failed to remove from continue watching', e);
  }
};
