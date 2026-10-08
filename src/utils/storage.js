/**
 * localStorage wrapper with error handling and JSON serialization.
 * @module utils/storage
 */
import { STORAGE_KEYS, MAX_SEARCH_HISTORY } from './constants.js';

/**
 * Safely read and parse JSON from localStorage.
 * @param {string} key - Storage key
 * @param {*} defaultValue - Value returned on error/missing
 * @returns {*} Parsed value or default
 */
function readJSON(key, defaultValue) {
  try {
    const raw = localStorage.getItem(key);
    if (raw == null) return defaultValue;
    return JSON.parse(raw);
  } catch {
    return defaultValue;
  }
}

/**
 * Safely write JSON to localStorage.
 * @param {string} key - Storage key
 * @param {*} value - Value to serialize
 * @returns {boolean} Success flag
 */
function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

/**
 * Get full watch history object (Viduki format).
 * @returns {Object} Watch history keyed by TMDB ID
 */
export function getWatchHistory() {
  return readJSON(STORAGE_KEYS.watchHistory, {});
}

/**
 * Write full watch history.
 * @param {Object} data - Watch history object
 * @returns {boolean} Success flag
 */
export function setWatchHistory(data) {
  return writeJSON(STORAGE_KEYS.watchHistory, data);
}

/**
 * Get bookmarks array.
 * @returns {Array<{id:number, type:string, title:string, poster_path:string, added_at:number}>}
 */
export function getBookmarks() {
  return readJSON(STORAGE_KEYS.bookmarks, []);
}

/**
 * Add a bookmark (no-op if already exists).
 * @param {{id:number, type:string, title:string, poster_path:string}} item - Item to bookmark
 * @returns {boolean} True if added
 */
export function addBookmark(item) {
  const bookmarks = getBookmarks();
  const exists = bookmarks.some((b) => b.id === item.id && b.type === item.type);
  if (exists) return false;
  bookmarks.unshift({ ...item, added_at: Date.now() });
  return writeJSON(STORAGE_KEYS.bookmarks, bookmarks);
}

/**
 * Remove a bookmark by TMDB id.
 * @param {number} id - TMDB ID to remove
 * @returns {boolean} True if removed
 */
export function removeBookmark(id) {
  const bookmarks = getBookmarks();
  const filtered = bookmarks.filter((b) => b.id !== id);
  if (filtered.length === bookmarks.length) return false;
  return writeJSON(STORAGE_KEYS.bookmarks, filtered);
}

/**
 * Check if an item is bookmarked.
 * @param {number} id - TMDB ID
 * @returns {boolean}
 */
export function isBookmarked(id) {
  return getBookmarks().some((b) => b.id === id);
}

/**
 * Get user preferences.
 * @returns {{defaultApi:number, language:string}}
 */
export function getPreferences() {
  return readJSON(STORAGE_KEYS.preferences, { defaultApi: 1, language: 'id-ID' });
}

/**
 * Write a single preference key.
 * @param {string} key - Preference key
 * @param {*} value - Preference value
 * @returns {boolean} Success flag
 */
export function setPreference(key, value) {
  const prefs = getPreferences();
  prefs[key] = value;
  return writeJSON(STORAGE_KEYS.preferences, prefs);
}

/**
 * Get recent search queries.
 * @returns {string[]}
 */
export function getSearchHistory() {
  return readJSON(STORAGE_KEYS.searchHistory, []);
}

/**
 * Add a search query to history (max 10, newest first, no duplicates).
 * @param {string} query - Search query
 * @returns {void}
 */
export function addSearchQuery(query) {
  const trimmed = query.trim();
  if (!trimmed) return;
  let history = getSearchHistory();
  history = history.filter((q) => q.toLowerCase() !== trimmed.toLowerCase());
  history.unshift(trimmed);
  if (history.length > MAX_SEARCH_HISTORY) {
    history = history.slice(0, MAX_SEARCH_HISTORY);
  }
  writeJSON(STORAGE_KEYS.searchHistory, history);
}

/**
 * Clear all search history.
 * @returns {void}
 */
export function clearSearchHistory() {
  writeJSON(STORAGE_KEYS.searchHistory, []);
}
