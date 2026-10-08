/**
 * Shared constants for FilmKu.
 * @module utils/constants
 */

/**
 * TMDB genre ID → name mapping (movies).
 * @type {Object<number, string>}
 */
export const MOVIE_GENRES = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Science Fiction',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
};

/**
 * TMDB genre ID → name mapping (TV shows).
 * @type {Object<number, string>}
 */
export const TV_GENRES = {
  10759: 'Action & Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  10762: 'Kids',
  9648: 'Mystery',
  10763: 'News',
  10764: 'Reality',
  10765: 'Sci-Fi & Fantasy',
  10766: 'Soap',
  10767: 'Talk',
  10768: 'War & Politics',
  37: 'Western',
};

/**
 * Default page size for TMDB pagination.
 * @type {number}
 */
export const DEFAULT_PAGE_SIZE = 20;

/**
 * Max items stored in search history.
 * @type {number}
 */
export const MAX_SEARCH_HISTORY = 10;

/**
 * Debounce delays in milliseconds.
 * @type {{ search: number, scroll: number }}
 */
export const DEBOUNCE_DELAYS = {
  search: 300,
  scroll: 100,
};

/**
 * localStorage keys.
 * @type {Object}
 */
export const STORAGE_KEYS = {
  watchHistory: 'filmku-watchHistory',
  bookmarks: 'filmku-bookmarks',
  preferences: 'filmku-preferences',
  searchHistory: 'filmku-searchHistory',
};

/**
 * TMDB API cache TTL (5 minutes).
 * @type {number}
 */
export const CACHE_TTL = 5 * 60 * 1000;
