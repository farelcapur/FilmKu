# FilmKu — Agent Instructions

## Project Overview

**FilmKu** is a static, client-side movie & TV show streaming website with a Netflix-inspired UI. It uses the **TMDB API** for metadata (titles, posters, descriptions, ratings) and **Viduki.net** embed APIs for video playback. All data persistence is handled via `localStorage` — there is **no backend or database**.

---

## Core Principles

1. **100% Static & Client-Side** — No server, no database, no build-time data fetching. Everything runs in the browser.
2. **Netflix-Quality UI** — Dark theme, smooth animations, responsive grid layouts, glassmorphism accents, premium typography.
3. **Resilient Playback** — Automatic API fallback when a Viduki server fails. Always try to play content.
4. **Performance First** — Lazy loading, image optimization, skeleton loaders, minimal bundle size.
5. **Mobile First** — Responsive design that works beautifully on all screen sizes (320px → 4K).

---

## Technology Constraints

| Layer        | Technology              | Notes                                    |
|------------- |------------------------ |----------------------------------------- |
| Framework    | **Vite + Vanilla JS**   | No React/Vue/Angular. Pure ES modules.   |
| Styling      | **Vanilla CSS**         | CSS custom properties for theming. No Tailwind. |
| Data Source   | **TMDB API v3**        | For movie/TV metadata. Requires API key. |
| Streaming     | **Viduki.net Embed**   | iframe-based. 4 API tiers available.     |
| Storage       | **localStorage**       | Watch history, bookmarks, preferences.   |
| Routing       | **Hash-based router**  | `#/movie/123`, `#/tv/456/1/3`, etc.     |
| Build Tool    | **Vite**               | Dev server + production build.           |
| Deployment    | **Static hosting**     | Vercel / Netlify / GitHub Pages.         |

---

## Architecture Rules

### File & Folder Structure

```
FilmKu/
├── index.html                  # Single HTML entry point
├── vite.config.js              # Vite configuration
├── package.json
│
├── public/
│   ├── favicon.ico
│   └── og-image.png
│
├── src/
│   ├── main.js                 # App entry — router init, global listeners
│   ├── router.js               # Hash-based SPA router
│   ├── config.js               # API keys, endpoints, constants
│   │
│   ├── api/
│   │   ├── tmdb.js             # TMDB API wrapper (fetch movies, TV, search)
│   │   └── viduki.js           # Viduki iframe URL builder + fallback logic
│   │
│   ├── components/
│   │   ├── Navbar.js           # Top navigation bar
│   │   ├── Hero.js             # Hero banner with featured content
│   │   ├── MovieCard.js        # Individual movie/TV card
│   │   ├── MovieRow.js         # Horizontal scrollable row of cards
│   │   ├── VideoPlayer.js      # iframe wrapper + API selector + fallback
│   │   ├── SearchBar.js        # Search input with live suggestions
│   │   ├── Modal.js            # Movie detail modal/overlay
│   │   ├── Footer.js           # Site footer
│   │   ├── SkeletonLoader.js   # Loading placeholder components
│   │   ├── SeasonSelector.js   # Season/Episode picker for TV shows
│   │   ├── ContinueWatching.js # Continue watching row from localStorage
│   │   ├── Bookmarks.js        # Bookmarked/saved content
│   │   └── Toast.js            # Notification toasts
│   │
│   ├── pages/
│   │   ├── Home.js             # Landing page — hero + rows
│   │   ├── Browse.js           # Browse by genre/category
│   │   ├── Search.js           # Search results page
│   │   ├── MovieDetail.js      # Movie detail + player page
│   │   ├── TVDetail.js         # TV show detail + season/episode picker
│   │   ├── Watch.js            # Full-screen watch page
│   │   ├── Bookmarks.js        # Bookmarks/My List page
│   │   └── NotFound.js         # 404 page
│   │
│   ├── utils/
│   │   ├── storage.js          # localStorage helpers (get/set/remove)
│   │   ├── dom.js              # DOM manipulation helpers
│   │   ├── debounce.js         # Debounce utility
│   │   ├── formatters.js       # Date, runtime, rating formatters
│   │   └── constants.js        # Shared constants (genres, etc.)
│   │
│   └── styles/
│       ├── index.css           # Global styles, CSS reset, variables
│       ├── components.css      # Component-specific styles
│       ├── pages.css           # Page-specific styles
│       ├── animations.css      # Keyframe animations & transitions
│       └── responsive.css      # Media queries & breakpoints
│
├── .ai/
│   ├── PRD.md
│   ├── tasks.md
│   └── tech-stacks.md
│
└── AGENTS.md                   # This file
```

### Coding Standards

1. **No default exports** — Always use named exports for clarity.
2. **JSDoc comments** — All public functions must have JSDoc with `@param` and `@returns`.
3. **Component pattern** — Each component is a function that returns an HTML string or DOM element. Example:
   ```js
   /**
    * Creates a movie card element.
    * @param {Object} movie - TMDB movie object
    * @returns {HTMLElement}
    */
   export function MovieCard(movie) {
     const el = document.createElement('div');
     el.className = 'movie-card';
     el.innerHTML = `...`;
     return el;
   }
   ```
4. **Event delegation** — Prefer event delegation on parent containers over individual listeners.
5. **Template literals** — Use tagged template literals for HTML generation. Sanitize user inputs.
6. **Error handling** — All API calls must have try/catch with user-friendly fallbacks.
7. **No inline styles** — All styling via CSS classes. Use `data-*` attributes for state.
8. **Semantic HTML** — Use `<main>`, `<nav>`, `<section>`, `<article>`, `<aside>`, `<figure>`.
9. **Accessibility** — All interactive elements must have `aria-label`, proper focus management, and keyboard navigation support.

### CSS Standards

1. **CSS Custom Properties** for all design tokens:
   ```css
   :root {
     --color-bg-primary: #0a0a0f;
     --color-bg-secondary: #141420;
     --color-accent: #e50914;
     --color-text-primary: #ffffff;
     --color-text-secondary: #a0a0b0;
     --font-primary: 'Inter', sans-serif;
     --radius-md: 8px;
     --transition-default: 300ms cubic-bezier(0.4, 0, 0.2, 1);
   }
   ```
2. **BEM-like naming** — `.movie-card`, `.movie-card__title`, `.movie-card--featured`.
3. **No `!important`** — Increase specificity instead.
4. **Mobile-first breakpoints** — `min-width: 640px`, `768px`, `1024px`, `1280px`, `1536px`.

### API Integration

#### TMDB API
- Base URL: `https://api.themoviedb.org/3`
- Image base: `https://image.tmdb.org/t/p/`
- Poster sizes: `w185`, `w342`, `w500`, `original`
- Backdrop sizes: `w780`, `w1280`, `original`
- Always include `language=id-ID` for Indonesian locale with English fallback.

#### Viduki.net Embed
- Base URL: `https://viduki.net`
- 4 API tiers: `/1/`, `/2/`, `/3/`, `/4/`
- Movie: `/{tier}/movie/{tmdb_id}?color={hex}`
- TV: `/{tier}/tv/{tmdb_id}/{season}/{episode}?color={hex}`
- Default accent color: `e50914` (Netflix red)
- **Fallback order**: API 1 → API 2 → API 3 → API 4
- Listen for `viduki:all-servers-failed` message to trigger fallback.

### localStorage Schema

```
filmku-watchHistory   → JSON object of watch progress (Viduki format)
filmku-bookmarks      → JSON array of bookmarked TMDB IDs with type
filmku-preferences    → JSON object { theme, language, defaultApi }
filmku-searchHistory  → JSON array of recent search queries
```

### Git Conventions

- **Commit format**: `type(scope): description` (e.g., `feat(player): add API fallback`)
- **Branch naming**: `feature/xxx`, `fix/xxx`, `chore/xxx`
- **Never commit** API keys — use environment variables via Vite's `import.meta.env`.

---

## Workflow for AI Agents

1. **Read `.ai/tasks.md`** to understand the current phase and pending tasks.
2. **Check off completed tasks** as you finish them.
3. **Follow the phase order** — do not skip phases.
4. **Test each component** visually before moving to the next.
5. **Refer to `.ai/PRD.md`** for detailed feature requirements.
6. **Refer to `.ai/tech-stacks.md`** for API details and integration guides.
7. **Update `AGENTS.md`** if architectural decisions change during implementation.
