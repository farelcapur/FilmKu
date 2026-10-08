/**
 * Data formatting utilities for TMDB data.
 * @module utils/formatters
 */
import { config } from '../config.js';

/**
 * Format a TMDB vote_average to "7.5" style string.
 * @param {number|null} vote - TMDB vote_average (0-10)
 * @returns {string} Formatted rating string
 */
export function formatRating(vote) {
  if (vote == null || isNaN(vote)) return 'N/A';
  return vote.toFixed(1);
}

/**
 * Format runtime in minutes to "2h 15m".
 * @param {number|null} minutes - Runtime in minutes
 * @returns {string} Formatted runtime
 */
export function formatRuntime(minutes) {
  if (!minutes || isNaN(minutes)) return 'N/A';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

/**
 * Format a date string to "Jan 15, 2026".
 * @param {string} dateStr - ISO date string (YYYY-MM-DD)
 * @returns {string} Formatted date or "N/A"
 */
export function formatDate(dateStr) {
  if (!dateStr) return 'N/A';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return 'N/A';
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Extract year from a date string.
 * @param {string} dateStr - ISO date string
 * @returns {string} Year or "N/A"
 */
export function formatYear(dateStr) {
  if (!dateStr) return 'N/A';
  const year = dateStr.slice(0, 4);
  return /^\d{4}$/.test(year) ? year : 'N/A';
}

/**
 * Calculate watch progress percentage string.
 * @param {number} watched - Seconds watched
 * @param {number} duration - Total duration in seconds
 * @returns {string} Percentage string e.g. "32%"
 */
export function formatProgress(watched, duration) {
  if (!duration || duration === 0) return '0%';
  const pct = Math.min(100, Math.max(0, (watched / duration) * 100));
  return `${Math.round(pct)}%`;
}

/**
 * Truncate text with ellipsis.
 * @param {string} text - Input text
 * @param {number} maxLength - Max characters before truncation
 * @returns {string} Truncated text
 */
export function truncateText(text, maxLength) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '...';
}

/**
 * Build a full TMDB image URL from a path.
 * @param {string|null} path - TMDB image path (e.g. "/abc.jpg")
 * @param {string} [size='medium'] - Size key ('small'|'medium'|'large'|'original')
 * @param {string} [type='poster'] - Image type ('poster'|'backdrop'|'profile'|'still')
 * @returns {string|null} Full image URL or null if no path
 */
export function getImageUrl(path, size = 'medium', type = 'poster') {
  if (!path) return null;
  const sizes = config.tmdb[`${type}Sizes`] || config.tmdb.posterSizes;
  const sizeKey = sizes[size] || size;
  return `${config.tmdb.imageBaseUrl}${sizeKey}${path}`;
}

/**
 * Get CSS class for a rating value.
 * @param {number} rating - Rating 0-10
 * @returns {string} CSS class suffix ('high'|'medium'|'low')
 */
export function getRatingColor(rating) {
  if (rating >= 7) return 'high';
  if (rating >= 5) return 'medium';
  return 'low';
}
