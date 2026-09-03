# FilmKu — Technology Stack

> **Version**: 1.0  
> **Last Updated**: 2026-09-03

---

## 1. Core Stack

### 1.1 Build Tool — Vite

| Property     | Value                                              |
|------------- |--------------------------------------------------- |
| Version      | Latest stable (^6.x)                               |
| Purpose      | Dev server with HMR + production bundler            |
| Config       | `vite.config.js`                                    |
| Dev Command  | `npm run dev`                                       |
| Build Command| `npm run build`                                     |
| Output       | `dist/` folder — static files ready for deployment  |

**Why Vite**: Blazing fast HMR, native ES module support, excellent Vanilla JS support, minimal config, optimized production build with tree-shaking.

### 1.2 Language — Vanilla JavaScript (ES2022+)

| Feature         | Usage                                         |
|---------------- |---------------------------------------------- |
| ES Modules      | `import`/`export` for all files               |
| `async`/`await` | All API calls                                 |
| Template literals| HTML template generation                     |
| Optional chaining| Safe property access                         |
| Nullish coalescing| Default values                              |
| `structuredClone`| Deep cloning data                            |
| Private fields   | `#privateField` where needed                 |

**No TypeScript** — to keep the stack minimal and the project truly static without compilation overhead.

### 1.3 Styling — Vanilla CSS

| Feature           | Usage                                       |
|------------------ |-------------------------------------------- |
| CSS Custom Props  | Design tokens (colors, spacing, etc.)       |
| CSS Nesting       | Component scoping (native, no preprocessor) |
| `@layer`          | Cascade layer management                    |
| `@container`      | Container queries for component responsiveness |
| `scroll-snap`     | Horizontal scroll rows                      |
| `aspect-ratio`    | Video player 16:9                           |
| `backdrop-filter`  | Glassmorphism effects                      |
| `@keyframes`      | Animations & skeleton loaders               |
| Media queries     | Responsive breakpoints                      |
| `clamp()`         | Fluid typography                            |

---

## 2. External APIs

### 2.1 TMDB API v3

| Property        | Value                                             |
|---------------- |-------------------------------------------------- |
| Base URL        | `https://api.themoviedb.org/3`                     |
| Auth            | API Key via query param `?api_key={KEY}`           |
| Rate Limit      | ~40 requests / 10 seconds                          |
| Image Base URL  | `https://image.tmdb.org/t/p/`                      |
| Documentation   | https://developer.themoviedb.org/reference/intro   |

#### Key Endpoints Used

```
GET /trending/{media_type}/{time_window}     — Trending content
GET /movie/popular                           — Popular movies
GET /movie/top_rated                         — Top rated movies
GET /movie/upcoming                          — Upcoming movies
GET /movie/{movie_id}                        — Movie details
GET /movie/{movie_id}/credits                — Cast & crew
GET /movie/{movie_id}/similar                — Similar movies
GET /movie/{movie_id}/recommendations        — Recommended movies
GET /movie/{movie_id}/videos                 — Trailers & videos
GET /tv/popular                              — Popular TV shows
GET /tv/top_rated                            — Top rated TV shows
GET /tv/{tv_id}                              — TV show details
GET /tv/{tv_id}/season/{season_number}       — Season details (episodes)
GET /tv/{tv_id}/credits                      — Cast & crew
GET /tv/{tv_id}/similar                      — Similar shows
GET /tv/{tv_id}/videos                       — Trailers & videos
GET /search/multi                            — Multi-search (movie + TV + person)
GET /genre/movie/list                        — Movie genres
GET /genre/tv/list                           — TV genres
GET /discover/movie                          — Discover movies with filters
GET /discover/tv                             — Discover TV shows with filters
```

#### Image Sizes

| Type      | Sizes Available                                  | Recommended        |
|---------- |------------------------------------------------- |------------------- |
| Poster    | `w92`, `w154`, `w185`, `w342`, `w500`, `w780`, `original` | `w342` (card), `w500` (detail) |
| Backdrop  | `w300`, `w780`, `w1280`, `original`              | `w780` (card), `w1280` (hero)  |
| Profile   | `w45`, `w185`, `h632`, `original`                | `w185` (cast)                  |
| Still     | `w92`, `w185`, `w300`, `original`                | `w300` (episode)               |

#### Language & Region

```js
const params = {
  language: 'id-ID',        // Indonesian localization
  region: 'ID',             // Indonesian region for release dates
  include_adult: false,     // No adult content
};
```

---

### 2.2 Viduki.net Embed API

| Property        | Value                                             |
|---------------- |-------------------------------------------------- |
| Base URL        | `https://viduki.net`                               |
| Auth            | None required                                      |
| Embed Type      | iframe                                             |
| Tiers           | 4 (Multi Server, Multi Language, Multi Embeds, Premium) |
| Color Param     | Optional `?color={hex}` for accent color           |

#### API Tiers

| Tier | URL Pattern              | Label              | Description                   |
|----- |------------------------- |------------------- |------------------------------ |
| 1    | `/1/movie/{id}` or `/1/tv/{id}/{s}/{e}` | Multi Server  | Multiple server backends      |
| 2    | `/2/movie/{id}` or `/2/tv/{id}/{s}/{e}` | Multi Language | Multi-language subtitles       |
| 3    | `/3/movie/{id}` or `/3/tv/{id}/{s}/{e}` | Multi Embeds  | Multiple embed sources         |
| 4    | `/4/movie/{id}` or `/4/tv/{id}/{s}/{e}` | Premium       | Premium quality streams        |

#### iframe Implementation

```html
<iframe
  id="viduki-player"
  src="https://viduki.net/1/movie/597?color=e50914"
  frameborder="0"
  allowfullscreen
  allow="autoplay; encrypted-media; picture-in-picture"
  referrerpolicy="origin"
  style="width: 100%; aspect-ratio: 16/9; border: none;"
></iframe>
```

#### Fallback Event Handler

```js
// Viduki server failure detection
window.addEventListener("message", (event) => {
  if (event.origin !== "https://www.viduki.net") return;
  
  if (event.data?.type === "viduki:all-servers-failed") {
    // event.data.status  === 404
    // event.data.message === "content not found 404"
    // event.data.stage   === "initial" | "manual-switch" | "playback-error"
    // event.data.media   === { type, tmdbid, season?, episode? }
    handleFallback(event.data);
  }
});

function handleFallback(data) {
  const currentApi = getCurrentApi(); // 1, 2, 3, or 4
  const nextApi = currentApi + 1;
  
  if (nextApi > 4) {
    showError("Content not available on any server.");
    return;
  }
  
  showToast(`Server ${currentApi} failed. Switching to Server ${nextApi}...`);
  switchToApi(nextApi, data.media);
}
```

#### Watch Progress Event Handler

```js
// Viduki watch progress tracking
window.addEventListener("message", (event) => {
  if (event.origin !== "https://www.viduki.net") return;
  
  if (event.data?.type === "MEDIA_DATA") {
    const mediaData = event.data.data;
    localStorage.setItem("filmku-watchHistory", JSON.stringify(mediaData));
  }
});
```

#### Watch Progress Data Schema

```js
// Movie progress
{
  "597": {
    "id": "597",
    "type": "movie",
    "title": "Titanic",
    "poster_path": "/path.jpg",
    "backdrop_path": "/path.jpg",
    "progress": {
      "watched": 3706.89,
      "duration": 11689.66
    },
    "last_updated": 1744442389334
  }
}

// TV progress
{
  "1399": {
    "id": "1399",
    "type": "tv",
    "title": "Game of Thrones",
    "poster_path": "/path.jpg",
    "backdrop_path": "/path.jpg",
    "progress": {
      "watched": 948.14,
      "duration": 3376.21
    },
    "last_updated": 1744443112702,
    "number_of_episodes": 73,
    "number_of_seasons": 8,
    "last_season_watched": "1",
    "last_episode_watched": "9",
    "show_progress": {
      "s1e1": {
        "season": "1",
        "episode": "1",
        "progress": { "watched": 0.58, "duration": 3696.14 },
        "last_updated": 1744442564248
      }
    }
  }
}
```

---

## 3. Client-Side Storage

### 3.1 localStorage

| Key                    | Type    | Max Size  | Description                      |
|----------------------- |-------- |---------- |--------------------------------- |
| `filmku-watchHistory`  | Object  | ~2MB      | Watch progress (Viduki format)   |
| `filmku-bookmarks`     | Array   | ~500KB    | Bookmarked content               |
| `filmku-preferences`   | Object  | ~1KB      | User settings                    |
| `filmku-searchHistory` | Array   | ~5KB      | Recent search queries (max 10)   |

### 3.2 sessionStorage

| Key                     | Type    | Description                      |
|------------------------ |-------- |--------------------------------- |
| `filmku-cache-{endpoint}`| Object | API response cache (per session) |

---

## 4. Fonts (Google Fonts)

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@600;700;800&display=swap" rel="stylesheet">
```

| Font     | Weights         | Usage                          |
|--------- |---------------- |------------------------------- |
| Inter    | 400, 500, 600, 700 | Body text, labels, buttons  |
| Outfit   | 600, 700, 800   | Headings, hero text, logo      |

---

## 5. Icons

Use **inline SVG** icons for performance. No icon library dependency.

Essential icons needed:
- Search (magnifying glass)
- Bookmark (heart/bookmark)
- Play (play triangle)
- Arrow left/right (navigation)
- Star (rating)
- Clock (duration)
- Calendar (release date)
- Home, Film, TV, List (navigation)
- Menu (hamburger)
- Close (X)
- Chevron up/down/left/right
- Volume (on/off)
- Fullscreen
- Info (i circle)
- Check (checkmark)
- Loader (spinner)

---

## 6. Development Tools

| Tool          | Purpose                                        |
|-------------- |----------------------------------------------- |
| Vite          | Dev server + bundler                           |
| ESLint        | Code linting (optional)                        |
| Prettier      | Code formatting (optional)                     |
| Git           | Version control                                |
| npm           | Package management                             |

### Package.json Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

---

## 7. Deployment Options

| Platform       | Cost   | Custom Domain | SSL  | CDN  |
|--------------- |------- |-------------- |----- |----- |
| Vercel         | Free   | ✅            | ✅   | ✅   |
| Netlify        | Free   | ✅            | ✅   | ✅   |
| GitHub Pages   | Free   | ✅            | ✅   | ❌   |
| Cloudflare Pages| Free  | ✅            | ✅   | ✅   |

---

## 8. Security Considerations

| Concern              | Mitigation                                            |
|--------------------- |------------------------------------------------------ |
| TMDB API Key exposure | Keys are in client-side code; TMDB keys are read-only and non-sensitive. Use env vars to avoid hardcoding. |
| XSS via search input  | Sanitize all user inputs before DOM insertion.        |
| iframe security       | Set `referrerpolicy="origin"` on Viduki iframe.       |
| localStorage tampering | Validate data shape on read; graceful fallback.      |
| Mixed content         | All external URLs must use HTTPS.                    |
