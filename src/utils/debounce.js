/**
 * Debounce & throttle utility helpers.
 * @module utils/debounce
 */

/**
 * Debounce a function call.
 * @param {Function} fn - Function to debounce
 * @param {number} [delay=300] - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(fn, delay = 300) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

/**
 * Throttle a function call.
 * @param {Function} fn - Function to throttle
 * @param {number} [limit=300] - Minimum interval in milliseconds
 * @returns {Function} Throttled function
 */
export function throttle(fn, limit = 300) {
  let inThrottle = false;
  return function (...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}
