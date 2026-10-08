/**
 * Viduki.net embed URL builder and message listeners.
 * @module api/viduki
 */
import { config } from '../config.js';

const VIDUKI_ORIGIN = 'https://viduki.net';

/**
 * Build a movie embed URL.
 * @param {number|string} tmdbId - TMDB movie ID
 * @param {number} [apiTier=1] - API tier (1-4)
 * @param {string} [color] - Accent hex color (without #)
 * @returns {string} Full embed URL
 */
export function buildMovieUrl(tmdbId, apiTier = 1, color) {
  const tier = config.viduki.apiTiers[apiTier] || config.viduki.apiTiers[1];
  const hex = color || config.viduki.defaultColor;
  return `${config.viduki.baseUrl}${tier.path}/movie/${tmdbId}?color=${hex}`;
}

/**
 * Build a TV embed URL.
 * @param {number|string} tmdbId - TMDB TV ID
 * @param {number|string} season - Season number
 * @param {number|string} episode - Episode number
 * @param {number} [apiTier=1] - API tier (1-4)
 * @param {string} [color] - Accent hex color (without #)
 * @returns {string} Full embed URL
 */
export function buildTVUrl(tmdbId, season, episode, apiTier = 1, color) {
  const tier = config.viduki.apiTiers[apiTier] || config.viduki.apiTiers[1];
  const hex = color || config.viduki.defaultColor;
  return `${config.viduki.baseUrl}${tier.path}/tv/${tmdbId}/${season}/${episode}?color=${hex}`;
}

/**
 * Get human-readable label for an API tier.
 * @param {number} tier - API tier (1-4)
 * @returns {string} Label or "Unknown Server"
 */
export function getApiLabel(tier) {
  return config.viduki.apiTiers[tier]?.label || 'Unknown Server';
}

/**
 * Get the next fallback tier.
 * @param {number} currentTier - Current API tier (1-4)
 * @returns {number|null} Next tier or null if exhausted
 */
export function getNextApiTier(currentTier) {
  const next = currentTier + 1;
  return next <= 4 ? next : null;
}

let fallbackHandler = null;
let progressHandler = null;

/**
 * Set up message listener for Viduki server failures.
 * Listens for `viduki:all-servers-failed` messages.
 * @param {function(Object):void} onFallback - Callback receiving event.data
 * @returns {void}
 */
export function initFallbackListener(onFallback) {
  removeFallbackListener();
  fallbackHandler = (event) => {
    if (event.origin !== VIDUKI_ORIGIN) return;
    if (event.data?.type === 'viduki:all-servers-failed') {
      onFallback(event.data);
    }
  };
  window.addEventListener('message', fallbackHandler);
}

/**
 * Set up message listener for Viduki watch progress.
 * Listens for `MEDIA_DATA` messages.
 * @param {function(Object):void} onProgress - Callback receiving event.data.data
 * @returns {void}
 */
export function initProgressListener(onProgress) {
  removeProgressListener();
  progressHandler = (event) => {
    if (event.origin !== VIDUKI_ORIGIN) return;
    if (event.data?.type === 'MEDIA_DATA') {
      onProgress(event.data.data);
    }
  };
  window.addEventListener('message', progressHandler);
}

/**
 * Remove the fallback message listener.
 * @returns {void}
 */
export function removeFallbackListener() {
  if (fallbackHandler) {
    window.removeEventListener('message', fallbackHandler);
    fallbackHandler = null;
  }
}

/**
 * Remove the progress message listener.
 * @returns {void}
 */
export function removeProgressListener() {
  if (progressHandler) {
    window.removeEventListener('message', progressHandler);
    progressHandler = null;
  }
}
