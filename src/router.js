/**
 * Hash-based SPA router for FilmKu.
 * @module router
 */

/**
 * @typedef {Object} RouteInfo
 * @property {string} pattern - Matched route pattern
 * @property {string} path - Current hash path
 * @property {Object} params - Extracted route params
 * @property {Object} query - Extracted query string params
 * @property {function} handler - Route handler
 */

const routes = [];
let notFoundHandler = null;
let beforeHooks = [];
let afterHooks = [];
let currentRoute = null;
let initialized = false;

/**
 * Convert a route pattern to a RegExp and param names.
 * @param {string} pattern - e.g. "#/movie/:id"
 * @returns {{regex: RegExp, keys: string[]}}
 */
function patternToRegex(pattern) {
  const keys = [];
  const regexStr = pattern
    .replace(/\/:([^/]+)/g, (_, key) => {
      keys.push(key);
      return '/([^/]+)';
    })
    .replace(/\*/g, '.*');
  return { regex: new RegExp(`^${regexStr}$`), keys };
}

/**
 * Parse the current hash into path and query.
 * @returns {{path: string, query: Object}}
 */
function parseHash() {
  const hash = window.location.hash || '#/';
  const [pathPart, queryPart] = hash.split('?');
  const query = {};
  if (queryPart) {
    for (const [k, v] of new URLSearchParams(queryPart)) {
      query[k] = v;
    }
  }
  return { path: pathPart || '#/', query };
}

/**
 * Register a route.
 * @param {string} pattern - Route pattern e.g. "#/movie/:id"
 * @param {function} handler - Handler(params, query) called on match
 * @returns {void}
 */
export function on(pattern, handler) {
  const { regex, keys } = patternToRegex(pattern);
  routes.push({ pattern, regex, keys, handler });
}

/**
 * Register a 404 fallback handler.
 * @param {function} handler - Handler(query) called when no route matches
 * @returns {void}
 */
export function notFound(handler) {
  notFoundHandler = handler;
}

/**
 * Add a before-route hook (cleanup etc).
 * @param {function} hook - hook(routeInfo|null, nextRouteInfo)
 * @returns {void}
 */
export function before(hook) {
  beforeHooks.push(hook);
}

/**
 * Add an after-route hook (scroll reset, transitions etc).
 * @param {function} hook - hook(routeInfo)
 * @returns {void}
 */
export function after(hook) {
  afterHooks.push(hook);
}

/**
 * Navigate to a hash path programmatically.
 * @param {string} path - e.g. "#/movie/123" or "/movie/123"
 * @returns {void}
 */
export function navigate(path) {
  const target = path.startsWith('#') ? path : `#${path}`;
  if (window.location.hash === target) {
    resolve();
  } else {
    window.location.hash = target;
  }
}

/**
 * Get current route info.
 * @returns {RouteInfo|null}
 */
export function getCurrentRoute() {
  return currentRoute;
}

/**
 * Resolve the current hash against registered routes and invoke the handler.
 * @returns {void}
 */
function resolve() {
  const { path, query } = parseHash();

  for (const route of routes) {
    const match = path.match(route.regex);
    if (match) {
      const params = {};
      route.keys.forEach((key, i) => {
        params[key] = decodeURIComponent(match[i + 1]);
      });

      const routeInfo = {
        pattern: route.pattern,
        path,
        params,
        query,
        handler: route.handler,
      };

      for (const hook of beforeHooks) {
        hook(currentRoute, routeInfo);
      }

      currentRoute = routeInfo;
      route.handler(params, query);

      for (const hook of afterHooks) {
        hook(routeInfo);
      }
      return;
    }
  }

  // 404 fallback
  const routeInfo = { pattern: '*', path, params: {}, query, handler: notFoundHandler };
  for (const hook of beforeHooks) {
    hook(currentRoute, routeInfo);
  }
  currentRoute = routeInfo;
  if (notFoundHandler) notFoundHandler(query);
  for (const hook of afterHooks) {
    hook(routeInfo);
  }
}

/**
 * Initialize the router (idempotent).
 * Registers default after-hooks: scroll-to-top and page transition.
 * @returns {void}
 */
export function init() {
  if (initialized) return;
  initialized = true;

  // Default: scroll to top on every route change
  after(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  });

  // Default: trigger page enter transition
  after(() => {
    const container = document.getElementById('page-content');
    if (container) {
      container.classList.remove('page-enter');
      // Force reflow so the animation restarts
      void container.offsetWidth;
      container.classList.add('page-enter');
    }
  });

  if (!window.location.hash) {
    window.location.hash = '#/';
  }

  window.addEventListener('hashchange', resolve);
  resolve();
}

export default {
  on,
  notFound,
  before,
  after,
  navigate,
  getCurrentRoute,
  init,
};
