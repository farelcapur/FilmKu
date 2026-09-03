# FilmKu — Task Checklist

> **Version**: 1.0  
> **Last Updated**: 2026-09-03  
> **Total Phases**: 7  
> **Estimated Effort**: ~40-50 hours

---

## Phase 0: Project Setup & Configuration
> **Goal**: Initialize the project, install dependencies, and configure the build tool.  
> **Dependency**: None  
> **Estimated Effort**: ~1 hour

- [ ] Initialize npm project: `npm init -y`
- [ ] Install Vite: `npm install -D vite`
- [ ] Create `vite.config.js` with base config
- [ ] Create `package.json` scripts (`dev`, `build`, `preview`)
- [ ] Create `index.html` entry point with:
  - Meta tags (charset, viewport, description, Open Graph)
  - Google Fonts preconnect & link (Inter, Outfit)
  - `<div id="app"></div>` root container
  - Script tag to `src/main.js` (type="module")
- [ ] Create `src/config.js` with:
  - TMDB API key (from env: `import.meta.env.VITE_TMDB_API_KEY`)
  - TMDB base URL
  - TMDB image base URL
  - Viduki base URL
  - Default accent color hex
  - API tier labels mapping
- [ ] Create `.env` file with `VITE_TMDB_API_KEY=your_key_here`
- [ ] Create `.env.example` as template (without actual key)
- [ ] Create `.gitignore` (node_modules, dist, .env)
- [ ] Verify dev server starts: `npm run dev`

---

## Phase 1: Design System & Core Styles
> **Goal**: Build the complete CSS design system — colors, typography, spacing, components, animations.  
> **Dependency**: Phase 0  
> **Estimated Effort**: ~4 hours

### 1.1 Global Styles (`src/styles/index.css`)
- [ ] CSS Reset (box-sizing, margin, padding, font inheritance)
- [ ] CSS Custom Properties (design tokens):
  - Colors (bg, surface, text, accent, semantic)
  - Typography (font families, sizes, weights, line-heights)
  - Spacing scale (4px base unit: `--space-1` through `--space-16`)
  - Border radii (`--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-xl`, `--radius-full`)
  - Shadows (elevation levels: `--shadow-sm`, `--shadow-md`, `--shadow-lg`, `--shadow-xl`)
  - Transitions (`--transition-fast`, `--transition-default`, `--transition-slow`)
  - Z-index scale (`--z-base`, `--z-dropdown`, `--z-modal`, `--z-toast`, `--z-navbar`)
- [ ] Base body styles (background, color, font, antialiasing)
- [ ] Scrollbar styling (thin, dark, custom colors)
- [ ] Selection styling (accent color)
- [ ] Link reset styles
- [ ] Utility classes (`.sr-only`, `.truncate`, `.line-clamp-2`, `.line-clamp-3`)
- [ ] Import Google Fonts via `@import` or link in HTML

### 1.2 Component Styles (`src/styles/components.css`)
- [ ] `.navbar` styles (fixed, transparent → solid, glassmorphism, height 64px)
- [ ] `.hero` styles (full-width, gradient overlay, content positioning)
- [ ] `.movie-card` styles (poster ratio 2:3, border-radius, hover scale + shadow, overflow hidden)
- [ ] `.movie-card__overlay` styles (gradient overlay on hover, info appearance)
- [ ] `.movie-row` styles (horizontal scroll, scroll-snap, gap, padding, hide scrollbar)
- [ ] `.movie-row__title` styles (section heading with accent underline)
- [ ] `.btn` styles (primary, secondary, ghost, icon variants, hover/active states)
- [ ] `.badge` styles (genre tags, rating badges with color coding)
- [ ] `.search-bar` styles (expanding input, focus ring, icon positioning)
- [ ] `.modal` styles (overlay, centered content, glassmorphism, slide-in animation)
- [ ] `.toast` styles (fixed bottom-right, slide-in, progress bar auto-dismiss)
- [ ] `.progress-bar` styles (thin bar, accent color, percentage width)
- [ ] `.dropdown` styles (glass background, border, shadow, item hover)
- [ ] `.video-player` styles (16:9 container, loading state, controls overlay)
- [ ] `.season-selector` styles (tabs/dropdown, episode list items, active state)
- [ ] `.cast-card` styles (circular image, name, character, hover)
- [ ] `.skeleton` styles (shimmer gradient animation, various shapes)
- [ ] `.glass` utility class (backdrop-filter, background, border)

### 1.3 Page Styles (`src/styles/pages.css`)
- [ ] Home page layout (hero + rows stacking)
- [ ] Browse page layout (filters bar + grid)
- [ ] Search results layout (query header + grid)
- [ ] Detail page layout (backdrop + content + rows)
- [ ] Watch page layout (full-width player + metadata below)
- [ ] Bookmarks page layout (header + grid)
- [ ] 404 page layout (centered message)

### 1.4 Animations (`src/styles/animations.css`)
- [ ] `@keyframes fadeIn` — opacity 0 → 1
- [ ] `@keyframes fadeInUp` — opacity 0 + translateY(20px) → visible
- [ ] `@keyframes fadeInDown` — opacity 0 + translateY(-20px) → visible
- [ ] `@keyframes slideInLeft` — translateX(-100%) → 0
- [ ] `@keyframes slideInRight` — translateX(100%) → 0
- [ ] `@keyframes slideInUp` — translateY(100%) → 0
- [ ] `@keyframes scaleIn` — scale(0.9) opacity(0) → normal
- [ ] `@keyframes shimmer` — skeleton loading shimmer gradient
- [ ] `@keyframes pulse` — subtle scale pulse for loading states
- [ ] `@keyframes spin` — 360deg rotation for spinner
- [ ] `@keyframes progressBar` — toast auto-dismiss progress
- [ ] `@keyframes heroSlideIn` — hero content entrance animation
- [ ] Intersection Observer based `.animate-on-scroll` trigger class
- [ ] Card stagger animation for grid items

### 1.5 Responsive Styles (`src/styles/responsive.css`)
- [ ] Breakpoint: 480px — adjust card sizes, font sizes
- [ ] Breakpoint: 640px — 3-column grid, larger hero text
- [ ] Breakpoint: 768px — tablet layout, side-by-side where appropriate
- [ ] Breakpoint: 1024px — desktop layout, expanded card row
- [ ] Breakpoint: 1280px — large desktop, wider content area
- [ ] Breakpoint: 1536px — 4K support, max-width container
- [ ] Mobile navbar → hamburger menu
- [ ] Touch-friendly tap targets (min 44px)
- [ ] Hide/show elements per breakpoint

---

## Phase 2: Utility Modules & API Layer
> **Goal**: Build the foundational JavaScript utilities, API wrappers, and router.  
> **Dependency**: Phase 0  
> **Estimated Effort**: ~5 hours

### 2.1 Utility Modules
- [ ] `src/utils/dom.js`:
  - `$(selector)` — querySelector shorthand
  - `$$(selector)` — querySelectorAll shorthand
  - `createElement(tag, attrs, children)` — create element helper
  - `clearElement(el)` — remove all children
  - `insertHTML(el, position, html)` — safe insertAdjacentHTML
- [ ] `src/utils/storage.js`:
  - `getWatchHistory()` — read watch progress from localStorage
  - `setWatchHistory(data)` — write watch progress
  - `getBookmarks()` — read bookmarks array
  - `addBookmark(item)` — add to bookmarks
  - `removeBookmark(id)` — remove from bookmarks
  - `isBookmarked(id)` — check if item is bookmarked
  - `getPreferences()` — read user preferences
  - `setPreference(key, value)` — write a preference
  - `getSearchHistory()` — read recent searches
  - `addSearchQuery(query)` — add to search history (max 10)
  - `clearSearchHistory()` — clear all search history
- [ ] `src/utils/debounce.js`:
  - `debounce(fn, delay)` — debounce function (default 300ms)
  - `throttle(fn, limit)` — throttle function
- [ ] `src/utils/formatters.js`:
  - `formatRating(vote)` — "7.5" format with color class
  - `formatRuntime(minutes)` — "2h 15m" format
  - `formatDate(dateStr)` — "Jan 15, 2026" format
  - `formatYear(dateStr)` — extract year
  - `formatProgress(watched, duration)` — percentage string
  - `truncateText(text, maxLength)` — truncate with "..."
  - `getImageUrl(path, size)` — build TMDB image URL
  - `getRatingColor(rating)` — return CSS class based on rating
- [ ] `src/utils/constants.js`:
  - Genre mapping (id → name, for both movie and TV)
  - Default page size
  - Max search history items
  - Debounce delays

### 2.2 TMDB API Wrapper (`src/api/tmdb.js`)
- [ ] `fetchFromTMDB(endpoint, params)` — base fetch function with error handling, cache
- [ ] `getTrending(mediaType, timeWindow)` — trending content
- [ ] `getPopularMovies(page)` — popular movies
- [ ] `getTopRatedMovies(page)` — top rated movies
- [ ] `getUpcomingMovies(page)` — upcoming movies
- [ ] `getMovieDetails(movieId)` — full movie details with append (credits, videos, similar, recommendations)
- [ ] `getPopularTV(page)` — popular TV shows
- [ ] `getTopRatedTV(page)` — top rated TV shows
- [ ] `getTVDetails(tvId)` — full TV details with append
- [ ] `getTVSeason(tvId, seasonNum)` — season with all episodes
- [ ] `searchMulti(query, page)` — multi-search
- [ ] `getGenres(mediaType)` — genre list
- [ ] `discoverMovies(params)` — discover with filters
- [ ] `discoverTV(params)` — discover with filters
- [ ] Response caching with `sessionStorage` (TTL: 5 minutes)
- [ ] Error handling with retry logic (max 2 retries)

### 2.3 Viduki Embed Builder (`src/api/viduki.js`)
- [ ] `buildMovieUrl(tmdbId, apiTier, color)` — build movie embed URL
- [ ] `buildTVUrl(tmdbId, season, episode, apiTier, color)` — build TV embed URL
- [ ] `getApiLabel(tier)` — return human-readable label
- [ ] `getNextApiTier(currentTier)` — return next fallback tier (or null)
- [ ] `initFallbackListener(onFallback)` — setup message event listener for failures
- [ ] `initProgressListener(onProgress)` — setup message event listener for watch progress
- [ ] `removeFallbackListener()` — cleanup listener
- [ ] `removeProgressListener()` — cleanup listener

### 2.4 Router (`src/router.js`)
- [ ] Hash-based SPA router implementation
- [ ] Route registration: `router.on(pattern, handler)`
- [ ] Pattern matching with params: `#/movie/:id` → `{ id: "123" }`
- [ ] `router.navigate(path)` — programmatic navigation
- [ ] `router.getCurrentRoute()` — return current route info
- [ ] Route change event listener (`hashchange`)
- [ ] Before/after route hooks (for cleanup, scroll reset)
- [ ] 404 fallback route
- [ ] Scroll to top on route change
- [ ] Page transition animation trigger

---

## Phase 3: Core Components
> **Goal**: Build all reusable UI components.  
> **Dependency**: Phase 1, Phase 2  
> **Estimated Effort**: ~10 hours

### 3.1 Navigation
- [ ] `src/components/Navbar.js`:
  - Logo ("FilmKu" text with gradient or icon)
  - Navigation links: Home, Movies, TV Shows, My List
  - Active link highlighting based on current route
  - Search icon toggle → expand search bar
  - Transparent at top → glassmorphism on scroll
  - Mobile: hamburger menu icon → slide-in menu
  - Scroll event listener for style change
- [ ] `src/components/Footer.js`:
  - Site links (About, FAQ, Contact, Privacy, Terms)
  - Copyright "© 2026 FilmKu. All rights reserved."
  - Social media icons (decorative SVGs)
  - "Powered by TMDB" attribution with logo

### 3.2 Content Cards
- [ ] `src/components/MovieCard.js`:
  - Poster image with lazy loading (`loading="lazy"`)
  - Fallback placeholder if image fails
  - Hover overlay: title, year, rating badge, genre tags
  - Bookmark icon (toggle on click)
  - Progress bar for "Continue Watching" cards
  - For TV in continue watching: "S1 E3" badge
  - Click handler → navigate to detail page
  - Smooth scale-up animation on hover
- [ ] `src/components/MovieRow.js`:
  - Section title with optional "See All" link
  - Horizontal scroll container
  - Left/Right scroll arrow buttons (visible on hover, desktop only)
  - Render array of `MovieCard` components
  - Scroll snapping behavior
  - Touch/drag scroll support
  - Show skeleton cards while loading

### 3.3 Hero Banner
- [ ] `src/components/Hero.js`:
  - Full-width backdrop image
  - Gradient overlay (bottom → transparent)
  - Content: title, overview (truncated), year, rating
  - "Play" button (→ watch page) and "More Info" button (→ detail page)
  - Auto-rotate between 5 featured items (8s interval)
  - Dot indicators for current slide
  - Pause rotation on hover
  - Smooth crossfade transition between slides
  - Mobile-optimized layout

### 3.4 Search
- [ ] `src/components/SearchBar.js`:
  - Input field with search icon
  - Debounced input (300ms) → API call
  - Dropdown suggestion list (max 8 results)
  - Each suggestion: poster thumbnail, title, year, type badge (Movie/TV)
  - Click suggestion → navigate to detail
  - Recent searches section (from localStorage)
  - Clear recent searches button
  - "No results found" state
  - Keyboard navigation (↑↓ arrows, Enter, Escape)
  - Close on click outside
  - Loading spinner while fetching

### 3.5 Video Player
- [ ] `src/components/VideoPlayer.js`:
  - iframe container with 16:9 aspect ratio
  - API Tier selector (dropdown or tab buttons):
    - Server 1: Multi Server
    - Server 2: Multi Language
    - Server 3: Multi Embeds
    - Server 4: Premium
  - Active tier highlighting
  - Manual tier switching → update iframe src
  - Auto-fallback on `viduki:all-servers-failed` message:
    - Try next tier automatically
    - Show toast: "Server X failed, switching to Server Y..."
    - After all tiers fail: show error message + retry button
  - Progress tracking via `MEDIA_DATA` message:
    - Save to localStorage
    - Update continue watching data
  - Loading overlay while iframe loads
  - Iframe `onload` → hide loading overlay
  - Cleanup listeners on destroy

### 3.6 TV Components
- [ ] `src/components/SeasonSelector.js`:
  - Dropdown or tab bar for season selection
  - Show season number and episode count
  - Trigger episode list update on change
- [ ] Episode list:
  - Episode thumbnail (still image)
  - Episode number, title
  - Air date, runtime
  - Short description (truncatable)
  - Progress bar if previously watched
  - "Now Playing" indicator for current episode
  - Click → navigate to watch page

### 3.7 UI Primitives
- [ ] `src/components/SkeletonLoader.js`:
  - Skeleton card (poster shape)
  - Skeleton row (multiple skeleton cards)
  - Skeleton hero (full-width rectangle)
  - Skeleton text (line shapes)
  - Shimmer animation
- [ ] `src/components/Toast.js`:
  - Toast container (fixed bottom-right)
  - `showToast(message, type, duration)` — display toast
  - Types: success (green), error (red), info (blue), warning (yellow)
  - Auto-dismiss progress bar
  - Close button
  - Stack multiple toasts vertically
- [ ] `src/components/Modal.js`:
  - Overlay backdrop (click to close)
  - Centered content container
  - Close (X) button
  - Escape key to close
  - Body scroll lock when open
  - Slide-in / scale-in animation
- [ ] `src/components/ContinueWatching.js`:
  - Specialized `MovieRow` variant
  - Read from `filmku-watchHistory` localStorage
  - Show progress bar on each card
  - Sort by `last_updated` descending
  - Max 20 items
  - Remove item button (X icon)
  - "Resume" action on click
  - Hide row if no watch history
- [ ] `src/components/ScrollToTop.js`:
  - Fixed button, bottom-right
  - Visible only when scrolled > 500px
  - Smooth scroll to top on click
  - Fade in/out animation

---

## Phase 4: Pages
> **Goal**: Build all page views using components.  
> **Dependency**: Phase 3  
> **Estimated Effort**: ~10 hours

### 4.1 Home Page (`src/pages/Home.js`)
- [ ] Render Hero banner (trending content)
- [ ] Render ContinueWatching row (conditional — only if history exists)
- [ ] Render MovieRow: "Trending Now" (trending/day)
- [ ] Render MovieRow: "Popular Movies" (movie/popular)
- [ ] Render MovieRow: "Popular TV Shows" (tv/popular)
- [ ] Render MovieRow: "Top Rated Movies" (movie/top_rated)
- [ ] Render MovieRow: "Upcoming Movies" (movie/upcoming)
- [ ] Render MovieRow: "Top Rated TV Shows" (tv/top_rated)
- [ ] Skeleton loading state for all sections
- [ ] Staggered fade-in animation as sections load
- [ ] Lazy load rows as they enter viewport (IntersectionObserver)
- [ ] Error state with retry button if API fails

### 4.2 Browse Page (`src/pages/Browse.js`)
- [ ] Tab toggle: Movies / TV Shows
- [ ] Genre filter dropdown (populate from TMDB genre list)
- [ ] Sort dropdown: Popularity, Rating, Release Date, Title
- [ ] Grid layout with MovieCard components
- [ ] Infinite scroll / "Load More" button
- [ ] Page number tracking for API pagination
- [ ] Skeleton grid while loading
- [ ] Empty state: "No results found" with suggestion to change filters
- [ ] URL params sync: `#/movies?genre=28&sort=popularity`
- [ ] Smooth transition between filter changes

### 4.3 Search Page (`src/pages/Search.js`)
- [ ] Read query from URL: `#/search?q=avengers`
- [ ] Display search query as heading: "Results for 'avengers'"
- [ ] Grid of results with type badge (Movie/TV)
- [ ] Infinite scroll for more results
- [ ] Skeleton grid while loading
- [ ] Empty state: "No results found for 'xyz'" with suggestions
- [ ] "Clear search" action → back to home

### 4.4 Movie Detail Page (`src/pages/MovieDetail.js`)
- [ ] Full backdrop as background (blur + dark overlay)
- [ ] Content section:
  - Poster image (w500)
  - Title (h1), tagline (if exists)
  - Year, runtime, rating badge, genre tags
  - Overview/synopsis
  - "Watch Now" button → `#/watch/movie/:id`
  - "Add to My List" bookmark toggle button
  - "Watch Trailer" button (if YouTube trailer available) → modal
- [ ] Cast row: horizontal scroll of cast cards (profile image, name, character)
- [ ] "Similar Movies" row
- [ ] "Recommended" row
- [ ] Trailer modal: YouTube embed iframe
- [ ] Loading skeleton for all sections
- [ ] Error state if movie not found

### 4.5 TV Detail Page (`src/pages/TVDetail.js`)
- [ ] Same layout structure as Movie Detail
- [ ] Additional: Total seasons, total episodes, status (Returning/Ended)
- [ ] Season Selector component
- [ ] Episode list for selected season
- [ ] Each episode card:
  - Still image thumbnail
  - Episode number & title
  - Air date & runtime
  - Description (truncatable)
  - Progress bar if watched
  - Play button → `#/watch/tv/:id/:season/:episode`
- [ ] Auto-select last watched season (from localStorage)
- [ ] Highlight last watched episode
- [ ] "Watch Now" → play first unwatched episode or latest

### 4.6 Watch Page (`src/pages/Watch.js`)
- [ ] Full-width video player (VideoPlayer component)
- [ ] Content info bar below player:
  - Title (movie title or "Show Name: S1 E3 - Episode Title")
  - Year, rating, runtime
  - Overview
- [ ] API Tier selector (integrated in VideoPlayer)
- [ ] For TV Shows:
  - "Previous Episode" / "Next Episode" navigation buttons
  - Episode list sidebar or collapsible section
  - Auto-detect and display current episode info
- [ ] Back button → return to detail page
- [ ] Bookmark button
- [ ] Dark background/dimmed surrounding
- [ ] Initialize Viduki listeners:
  - Fallback listener
  - Progress listener
- [ ] Cleanup listeners on page leave
- [ ] Loading state while iframe initializes
- [ ] Error fallback UI

### 4.7 Bookmarks Page (`src/pages/Bookmarks.js`)
- [ ] Page title: "My List"
- [ ] Filter tabs: All, Movies, TV Shows
- [ ] Grid of bookmarked MovieCards
- [ ] Each card has a remove bookmark action
- [ ] Empty state: "Your list is empty" with CTA to browse
- [ ] Sort by added date (most recent first)
- [ ] Instant UI update on bookmark toggle (no reload)

### 4.8 Not Found Page (`src/pages/NotFound.js`)
- [ ] "404" large display text
- [ ] "Page not found" message
- [ ] "Go Home" button → `#/`
- [ ] Fun animation or illustration

---

## Phase 5: App Assembly & Integration
> **Goal**: Wire everything together — router, pages, global event handlers, state management.  
> **Dependency**: Phase 4  
> **Estimated Effort**: ~5 hours

### 5.1 Main Entry (`src/main.js`)
- [ ] Import all CSS files
- [ ] Import router
- [ ] Import all pages
- [ ] Import Navbar & Footer
- [ ] Initialize router with all routes
- [ ] Render persistent Navbar at top
- [ ] Render persistent Footer at bottom
- [ ] Create `<main id="page-content">` container for page rendering
- [ ] Setup global event listeners:
  - Navbar scroll handler
  - Viduki progress message listener (global)
  - Online/offline detection
- [ ] Handle initial route on page load
- [ ] Error boundary: catch unhandled errors, show toast

### 5.2 Router Integration
- [ ] Register all routes:
  - `#/` → Home
  - `#/movies` → Browse (movies mode)
  - `#/tv` → Browse (TV mode)
  - `#/movie/:id` → MovieDetail
  - `#/tv/:id` → TVDetail
  - `#/watch/movie/:id` → Watch (movie mode)
  - `#/watch/tv/:id/:season/:episode` → Watch (TV mode)
  - `#/search` → Search
  - `#/my-list` → Bookmarks
  - `*` → NotFound
- [ ] Page transition animation (fade out → swap → fade in)
- [ ] Scroll to top on every route change
- [ ] Cleanup previous page (remove listeners, abort requests)
- [ ] Update document title per page
- [ ] Update navbar active link per route

### 5.3 State Management
- [ ] Global state object for current page data
- [ ] Event bus for cross-component communication:
  - `bookmark:added` / `bookmark:removed`
  - `watchHistory:updated`
  - `toast:show`
  - `theme:changed`
- [ ] localStorage sync on bookmark/watch history changes

### 5.4 Performance Optimization
- [ ] Image lazy loading with IntersectionObserver
- [ ] Debounce scroll events (navbar, infinite scroll)
- [ ] AbortController for fetch requests on page change
- [ ] sessionStorage caching for TMDB responses
- [ ] Preload next page images on hover (optional)

---

## Phase 6: Polish & UX
> **Goal**: Refine the user experience — animations, accessibility, edge cases.  
> **Dependency**: Phase 5  
> **Estimated Effort**: ~5 hours

### 6.1 Animations & Transitions
- [ ] Page transition (fade out/in between routes)
- [ ] Card hover animations (scale, shadow, overlay)
- [ ] Hero banner crossfade between slides
- [ ] Modal appear/disappear animation
- [ ] Toast slide-in from right
- [ ] Scroll-triggered animations (fade in as elements enter viewport)
- [ ] Button ripple or press effect
- [ ] Skeleton to content transition (fade)
- [ ] Search bar expand/collapse animation
- [ ] Row arrow buttons fade in/out on hover

### 6.2 Accessibility
- [ ] All images have `alt` attributes
- [ ] All buttons have `aria-label`
- [ ] Focus visible outlines on interactive elements
- [ ] Skip to main content link (hidden, visible on focus)
- [ ] Modal focus trap (Tab loops within modal)
- [ ] Escape key closes modal, search dropdown, mobile menu
- [ ] ARIA roles: `role="navigation"`, `role="main"`, `role="search"`
- [ ] `aria-live="polite"` for dynamic content updates (toasts, search results)
- [ ] Color contrast check (WCAG AA minimum)

### 6.3 Error Handling & Edge Cases
- [ ] Network offline detection → show offline banner
- [ ] TMDB API failure → show friendly error + retry
- [ ] Empty states for all sections (no results, no bookmarks, etc.)
- [ ] Image load failure → show placeholder
- [ ] localStorage quota exceeded → graceful handling
- [ ] Invalid route parameters → redirect to 404
- [ ] Long titles → text truncation with ellipsis
- [ ] Very long overviews → "Show more" / "Show less" toggle
- [ ] Rapid navigation → abort previous fetch, prevent race conditions

### 6.4 Mobile Optimization
- [ ] Touch swipe on hero banner
- [ ] Touch scroll on movie rows (momentum scrolling)
- [ ] Mobile menu (hamburger → full-screen overlay)
- [ ] Bottom action bar on watch page (optional)
- [ ] Input zoom prevention on iOS (font-size ≥ 16px)
- [ ] Safe area insets for notched devices
- [ ] Pull to refresh behavior (optional)

---

## Phase 7: Testing & Deployment
> **Goal**: Final testing, optimization, and deployment preparation.  
> **Dependency**: Phase 6  
> **Estimated Effort**: ~3 hours

### 7.1 Testing
- [ ] Manual test: Home page loads, all rows render
- [ ] Manual test: Hero banner auto-rotates, buttons work
- [ ] Manual test: Search works, results clickable
- [ ] Manual test: Movie detail page — all sections render
- [ ] Manual test: TV detail page — season/episode selector works
- [ ] Manual test: Watch page — iframe loads, API selector works
- [ ] Manual test: Fallback — verify message listener (simulate if possible)
- [ ] Manual test: Watch progress — localStorage updates correctly
- [ ] Manual test: Continue Watching row appears after watching
- [ ] Manual test: Bookmarks — add/remove works, persists across reload
- [ ] Manual test: All routes navigate correctly
- [ ] Manual test: 404 page for invalid routes
- [ ] Manual test: Mobile responsive — all breakpoints
- [ ] Manual test: Touch interactions on mobile/tablet
- [ ] Manual test: Keyboard navigation (Tab, Enter, Escape)
- [ ] Manual test: Offline behavior

### 7.2 Production Build
- [ ] Run `npm run build`
- [ ] Verify `dist/` folder output
- [ ] Test with `npm run preview` (production preview)
- [ ] Check bundle size (target < 100KB gzipped)
- [ ] Verify all assets load correctly
- [ ] Check for console errors/warnings
- [ ] Lighthouse audit (Performance, Accessibility, Best Practices, SEO)

### 7.3 Deployment
- [ ] Choose hosting platform (Vercel / Netlify / GitHub Pages)
- [ ] Configure environment variables on platform
- [ ] Deploy production build
- [ ] Verify live site works
- [ ] Test on multiple browsers (Chrome, Firefox, Safari, Edge)
- [ ] Test on real mobile devices
- [ ] Setup custom domain (optional)
- [ ] Verify HTTPS is working

### 7.4 Documentation
- [ ] Update README.md with:
  - Project description
  - Screenshots/demo link
  - Setup instructions
  - Environment variables
  - Available scripts
  - Tech stack
  - License
- [ ] Verify `.env.example` is up to date
- [ ] Ensure `AGENTS.md` reflects final architecture

---

## Phase Summary

| Phase | Name                        | Tasks | Est. Hours | Status      |
|------ |---------------------------- |------ |----------- |------------ |
| 0     | Project Setup               | 10    | ~1h        | ⬜ Not Started |
| 1     | Design System & Styles      | 40+   | ~4h        | ⬜ Not Started |
| 2     | Utilities & API Layer       | 30+   | ~5h        | ⬜ Not Started |
| 3     | Core Components             | 30+   | ~10h       | ⬜ Not Started |
| 4     | Pages                       | 30+   | ~10h       | ⬜ Not Started |
| 5     | App Assembly & Integration  | 15+   | ~5h        | ⬜ Not Started |
| 6     | Polish & UX                 | 25+   | ~5h        | ⬜ Not Started |
| 7     | Testing & Deployment        | 25+   | ~3h        | ⬜ Not Started |
|       | **TOTAL**                   |**200+**|**~43h**   |              |

---

## Execution Notes for AI Agents

1. **Always follow phase order.** Do not skip to Phase 4 before completing Phase 2 & 3.
2. **Complete all items in a sub-section before moving on.** Mark items `[x]` as you finish them.
3. **Test incrementally.** After each component, verify it renders correctly by running the dev server.
4. **Refer to `AGENTS.md`** for coding standards and file structure.
5. **Refer to `.ai/PRD.md`** for feature requirements and UI specifications.
6. **Refer to `.ai/tech-stacks.md`** for API endpoints, data schemas, and integration details.
7. **If stuck**, re-read the relevant section in PRD or tech-stacks before improvising.
8. **Commit frequently** with descriptive messages following the convention in AGENTS.md.
9. **Never hardcode the TMDB API key** — always use `import.meta.env.VITE_TMDB_API_KEY`.
10. **Keep the design premium.** If a UI looks "basic", it's not done. Add gradients, animations, glassmorphism, and micro-interactions.
