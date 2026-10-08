/**
 * TMDB API wrapper with caching and retry logic.
 * @module api/tmdb
 */
import { config } from '../config.js';
import { CACHE_TTL } from '../utils/constants.js';

/**
 * Read a cached sessionStorage entry if fresh.
 * @param {string} key - Cache key
 * @returns {*} Cached data or null
 */
function readCache(key) {
  try {
    const raw = sessionStorage.getItem(`filmku-cache-${key}`);
    if (!raw) return null;
    const { data, timestamp } = JSON.parse(raw);
    if (Date.now() - timestamp > CACHE_TTL) {
      sessionStorage.removeItem(`filmku-cache-${key}`);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

/**
 * Write data to sessionStorage cache.
 * @param {string} key - Cache key
 * @param {*} data - Data to cache
 * @returns {void}
 */
function writeCache(key, data) {
  try {
    sessionStorage.setItem(
      `filmku-cache-${key}`,
      JSON.stringify({ data, timestamp: Date.now() })
    );
  } catch {
    // sessionStorage full or unavailable — fail silently
  }
}

/**
 * Fetch from TMDB with cache, error handling, and retry.
 * @param {string} endpoint - TMDB endpoint path (e.g. "/movie/popular")
 * @param {Object} [params={}] - Query parameters
 * @param {Object} [options={}] - Fetch options
 * @param {boolean} [options.cache=true] - Whether to use cache
 * @param {AbortSignal} [options.signal] - Abort signal for cancellation
 * @param {number} [options.retries=2] - Max retries on failure
 * @returns {Promise<Object>} TMDB response JSON
 * @throws {Error} If all retries fail
 */
export async function fetchFromTMDB(endpoint, params = {}, options = {}) {
  const { cache = true, signal, retries = 2 } = options;
  const cacheKey = endpoint + '?' + new URLSearchParams(params).toString();

  if (cache) {
    const cached = readCache(cacheKey);
    if (cached) return cached;
  }

  const url = new URL(`${config.tmdb.baseUrl}${endpoint}`);
  url.searchParams.set('api_key', config.tmdb.apiKey);
  url.searchParams.set('language', config.tmdb.defaultParams.language);
  url.searchParams.set('include_adult', String(config.tmdb.defaultParams.include_adult));

  for (const [k, v] of Object.entries(params)) {
    if (v != null) url.searchParams.set(k, String(v));
  }

  let lastError;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url.toString(), { signal });
      if (!res.ok) {
        const error = new Error(`TMDB API error: ${res.status} ${res.statusText}`);
        error.status = res.status;
        throw error;
      }
      const data = await res.json();
      if (cache) writeCache(cacheKey, data);
      return data;
    } catch (err) {
      if (err.name === 'AbortError') throw err;
      lastError = err;
      if (err.status && err.status !== 429) throw err;
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
      }
    }
  }
  throw lastError;
}

/**
 * Get trending content.
 * @param {string} [mediaType='all'] - 'movie' | 'tv' | 'all'
 * @param {string} [timeWindow='day'] - 'day' | 'week'
 * @param {AbortSignal} [signal]
 * @returns {Promise<Object>}
 */
export function getTrending(mediaType = 'all', timeWindow = 'day', signal) {
  return fetchFromTMDB(`/trending/${mediaType}/${timeWindow}`, {}, { signal });
}

/**
 * Get popular movies.
 * @param {number} [page=1]
 * @param {AbortSignal} [signal]
 * @returns {Promise<Object>}
 */
export function getPopularMovies(page = 1, signal) {
  return fetchFromTMDB('/movie/popular', { page }, { signal });
}

/**
 * Get top rated movies.
 * @param {number} [page=1]
 * @param {AbortSignal} [signal]
 * @returns {Promise<Object>}
 */
export function getTopRatedMovies(page = 1, signal) {
  return fetchFromTMDB('/movie/top_rated', { page }, { signal });
}

/**
 * Get upcoming movies.
 * @param {number} [page=1]
 * @param {AbortSignal} [signal]
 * @returns {Promise<Object>}
 */
export function getUpcomingMovies(page = 1, signal) {
  return fetchFromTMDB('/movie/upcoming', { page }, { signal });
}

/**
 * Get full movie details with appended data.
 * @param {number} movieId - TMDB movie ID
 * @param {AbortSignal} [signal]
 * @returns {Promise<Object>}
 */
export function getMovieDetails(movieId, signal) {
  return fetchFromTMDB(
    `/movie/${movieId}`,
    { append_to_response: 'credits,videos,similar,recommendations' },
    { signal }
  );
}

/**
 * Get popular TV shows.
 * @param {number} [page=1]
 * @param {AbortSignal} [signal]
 * @returns {Promise<Object>}
 */
export function getPopularTV(page = 1, signal) {
  return fetchFromTMDB('/tv/popular', { page }, { signal });
}

/**
 * Get top rated TV shows.
 * @param {number} [page=1]
 * @param {AbortSignal} [signal]
 * @returns {Promise<Object>}
 */
export function getTopRatedTV(page = 1, signal) {
  return fetchFromTMDB('/tv/top_rated', { page }, { signal });
}

/**
 * Get full TV show details with appended data.
 * @param {number} tvId - TMDB TV ID
 * @param {AbortSignal} [signal]
 * @returns {Promise<Object>}
 */
export function getTVDetails(tvId, signal) {
  return fetchFromTMDB(
    `/tv/${tvId}`,
    { append_to_response: 'credits,videos,similar,recommendations' },
    { signal }
  );
}

/**
 * Get a TV season with all episodes.
 * @param {number} tvId - TMDB TV ID
 * @param {number} seasonNum - Season number
 * @param {AbortSignal} [signal]
 * @returns {Promise<Object>}
 */
export function getTVSeason(tvId, seasonNum, signal) {
  return fetchFromTMDB(`/tv/${tvId}/season/${seasonNum}`, {}, { signal });
}

/**
 * Multi-search (movies, TV, people).
 * @param {string} query - Search query
 * @param {number} [page=1]
 * @param {AbortSignal} [signal]
 * @returns {Promise<Object>}
 */
export function searchMulti(query, page = 1, signal) {
  return fetchFromTMDB('/search/multi', { query, page }, { signal, cache: false });
}

/**
 * Get genre list for a media type.
 * @param {string} mediaType - 'movie' | 'tv'
 * @param {AbortSignal} [signal]
 * @returns {Promise<Object>}
 */
export function getGenres(mediaType, signal) {
  return fetchFromTMDB(`/genre/${mediaType}/list`, {}, { signal });
}

/**
 * Discover movies with filters.
 * @param {Object} params - Discover filters ({ genre, sort_by, page, ... })
 * @param {AbortSignal} [signal]
 * @returns {Promise<Object>}
 */
export function discoverMovies(params = {}, signal) {
  return fetchFromTMDB('/discover/movie', params, { signal });
}

/**
 * Discover TV shows with filters.
 * @param {Object} params - Discover filters ({ genre, sort_by, page, ... })
 * @param {AbortSignal} [signal]
 * @returns {Promise<Object>}
 */
export function discoverTV(params = {}, signal) {
  return fetchFromTMDB('/discover/tv', params, { signal });
}
