# FilmKu — Product Requirements Document (PRD)

> **Version**: 1.0  
> **Last Updated**: 2026-09-03  
> **Status**: Draft — Awaiting Approval

---

## 1. Executive Summary

**FilmKu** adalah website streaming film dan serial TV statis (tanpa backend) dengan tampilan premium ala Netflix. Website ini menggunakan **TMDB API** untuk data metadata film/TV dan **Viduki.net** sebagai embed player. Semua data pengguna (riwayat tonton, bookmark, preferensi) disimpan di `localStorage`.

### Tujuan Utama
- Menyediakan pengalaman menonton film/TV yang seamless dan gratis
- UI/UX premium setara Netflix dengan dark theme dan animasi halus
- Zero maintenance — 100% static, bisa di-host di GitHub Pages/Vercel/Netlify
- Fallback otomatis antar API Viduki untuk keandalan playback

---

## 2. Target Audience

| Segmen            | Deskripsi                                                          |
|------------------ |------------------------------------------------------------------- |
| Primary           | Pengguna Indonesia yang ingin menonton film/TV secara gratis       |
| Secondary         | Pengguna internasional yang familiar dengan streaming platform     |
| Device Profile    | Mobile (60%), Desktop (30%), Tablet (10%)                          |

---

## 3. Core Features

### 3.1 Homepage / Landing Page

**Deskripsi**: Halaman utama yang menampilkan hero banner dan baris-baris konten terkurasi.

**Requirements**:
- [x] Hero banner besar dengan film/TV trending, auto-rotate setiap 8 detik
- [x] Tombol "Play" dan "More Info" di hero banner
- [x] Row "Continue Watching" (dari localStorage) — hanya muncul jika ada data
- [x] Row "Trending Now" (TMDB trending/day)
- [x] Row "Popular Movies" (TMDB popular movies)
- [x] Row "Popular TV Shows" (TMDB popular TV)
- [x] Row "Top Rated" (TMDB top rated)
- [x] Row "Upcoming" (TMDB upcoming movies)
- [x] Setiap row bisa di-scroll horizontal (drag & touch support)
- [x] Hover effect pada card: scale up, tampilkan info ringkas (judul, rating, tahun)
- [x] Infinite scroll atau "Load More" untuk konten tambahan

### 3.2 Browse / Explore

**Deskripsi**: Halaman eksplorasi dengan filter genre dan kategori.

**Requirements**:
- [x] Tab/toggle antara "Movies" dan "TV Shows"
- [x] Dropdown filter genre (Action, Comedy, Drama, Horror, dll.)
- [x] Sort by: Popularity, Rating, Release Date, Title (A-Z)
- [x] Grid layout responsif dengan kartu film
- [x] Infinite scroll pagination
- [x] Skeleton loader saat data loading
- [x] State kosong dengan pesan "No results found"

### 3.3 Search

**Deskripsi**: Pencarian film dan TV show secara real-time.

**Requirements**:
- [x] Search bar di navbar — selalu visible
- [x] Live search suggestions (debounced 300ms)
- [x] Hasil pencarian campuran (movie + TV) dengan label tipe
- [x] Riwayat pencarian terakhir (localStorage, max 10)
- [x] Tampilan "No results" dengan suggestions
- [x] Keyboard navigation (arrow keys, Enter, Escape)

### 3.4 Movie Detail Page

**Deskripsi**: Halaman detail film lengkap dengan player.

**Requirements**:
- [x] Backdrop besar sebagai background (blur + gradient overlay)
- [x] Poster, judul, tahun, rating, runtime, genre tags
- [x] Sinopsis/overview
- [x] Tombol "Watch Now" — navigasi ke halaman watch
- [x] Tombol "Add to My List" (bookmark toggle)
- [x] Cast & Crew section (horizontal scroll)
- [x] "Similar Movies" row
- [x] "Recommendations" row
- [x] Trailer modal (YouTube embed jika tersedia dari TMDB)
- [x] Rating badge dengan warna (hijau > 7, kuning > 5, merah ≤ 5)

### 3.5 TV Show Detail Page

**Deskripsi**: Halaman detail TV show dengan pemilih season/episode.

**Requirements**:
- [x] Semua fitur Movie Detail Page
- [x] Season selector dropdown
- [x] Episode list dengan:
  - Thumbnail/still image
  - Nomor & judul episode
  - Deskripsi singkat
  - Air date
  - Runtime
  - Progress bar jika sudah pernah ditonton
- [x] Auto-highlight episode terakhir ditonton
- [x] Tombol "Watch" per episode

### 3.6 Watch Page (Video Player)

**Deskripsi**: Halaman menonton full-screen dengan iframe Viduki.

**Requirements**:
- [x] Layout full-width, iframe responsif (16:9 aspect ratio)
- [x] **API Selector** — dropdown/tabs untuk memilih API tier (1-4)
  - Default: API 1
  - Label: "Server 1 (Multi Server)", "Server 2 (Multi Language)", "Server 3 (Multi Embeds)", "Server 4 (Premium)"
- [x] **Auto-fallback**: Jika API 1 gagal, otomatis coba API 2, 3, 4
  - Listen `window.message` event dari Viduki
  - Handle stage: `initial`, `manual-switch`, `playback-error`
  - Tampilkan toast notification saat switching: "Server 1 failed, switching to Server 2..."
- [x] **Watch Progress Tracking**:
  - Listen `MEDIA_DATA` message dari Viduki
  - Simpan ke localStorage dengan format Viduki
  - Update "Continue Watching" di homepage
- [x] Back button untuk kembali ke detail page
- [x] Judul film/episode di atas player
- [x] Untuk TV: navigasi episode berikutnya/sebelumnya
- [x] Light/dark surrounding area saat menonton
- [x] Loading state saat iframe belum siap

### 3.7 Continue Watching

**Deskripsi**: Baris konten yang menampilkan film/TV yang sedang ditonton.

**Requirements**:
- [x] Muncul di homepage sebagai row pertama (setelah hero)
- [x] Tampilkan progress bar di bawah card poster
- [x] Untuk TV: tampilkan "S1 E3" badge di card
- [x] Klik card → langsung ke halaman watch (resume)
- [x] Tombol "Remove" per item
- [x] Sort berdasarkan `last_updated` (terbaru dulu)
- [x] Maksimal 20 item

### 3.8 My List / Bookmarks

**Deskripsi**: Halaman koleksi film/TV yang di-bookmark pengguna.

**Requirements**:
- [x] Grid layout dengan kartu film
- [x] Toggle bookmark dari detail page atau langsung dari card (icon bookmark)
- [x] Filter: All, Movies Only, TV Only
- [x] State kosong: "Your list is empty. Start adding movies and shows!"
- [x] Data disimpan di localStorage

### 3.9 Navigation & Global UI

**Requirements**:
- [x] **Navbar**:
  - Logo "FilmKu" di kiri
  - Links: Home, Movies, TV Shows, My List
  - Search icon → expand search bar
  - Navbar transparan di top, solid saat scroll
- [x] **Footer**:
  - Links: About, FAQ, Contact, Privacy, Terms
  - Copyright notice
  - Social media icons (decorative)
- [x] **Loading States**:
  - Skeleton loaders untuk setiap section
  - Shimmer animation effect
- [x] **Toast Notifications**:
  - "Added to My List", "Removed from My List"
  - "Switching to Server 2..." (saat fallback)
  - Auto-dismiss setelah 3 detik
- [x] **Scroll to Top** button saat scroll down
- [x] **Mobile Menu**: Hamburger menu untuk navigasi mobile

---

## 4. Non-Functional Requirements

### 4.1 Performance
| Metrik                | Target        |
|---------------------- |-------------- |
| First Contentful Paint | < 1.5s       |
| Largest Contentful Paint | < 2.5s    |
| Time to Interactive    | < 3.0s       |
| Bundle Size (gzipped)  | < 100KB      |
| Image lazy loading     | Required     |

### 4.2 Responsiveness
| Breakpoint | Min Width | Layout                   |
|----------- |---------- |------------------------- |
| Mobile S   | 320px     | 2 cards per row          |
| Mobile L   | 480px     | 3 cards per row          |
| Tablet     | 768px     | 4 cards per row          |
| Desktop    | 1024px    | 5-6 cards per row        |
| Desktop XL | 1280px    | 6-7 cards per row        |
| 4K         | 1536px+   | 7-8 cards per row        |

### 4.3 Browser Support
- Chrome 90+
- Firefox 90+
- Safari 15+
- Edge 90+
- Mobile Chrome & Safari

### 4.4 SEO
- Proper `<title>` dan `<meta>` tags
- Open Graph tags untuk sharing
- Semantic HTML structure
- Sitemap (optional, karena SPA)

### 4.5 Accessibility
- Keyboard navigable
- ARIA labels pada interactive elements
- Focus visible indicators
- Color contrast ratio ≥ 4.5:1
- Screen reader compatible structure

---

## 5. Design Specifications

### 5.1 Color Palette

```
Background Primary:    #0a0a0f (near-black)
Background Secondary:  #141420 (dark navy)
Background Tertiary:   #1a1a2e (dark purple-navy)
Surface:               #1e1e30 (elevated surface)
Surface Hover:         #2a2a40 (hover state)
Accent Primary:        #e50914 (Netflix red)
Accent Secondary:      #b20710 (dark red)
Accent Gradient:       linear-gradient(135deg, #e50914, #b20710)
Text Primary:          #ffffff
Text Secondary:        #a0a0b0
Text Muted:            #6b6b80
Success:               #46d369
Warning:               #f5c518
Error:                 #e50914
Glass Background:      rgba(20, 20, 32, 0.7)
Glass Border:          rgba(255, 255, 255, 0.08)
```

### 5.2 Typography

```
Font Family Primary:    'Inter', -apple-system, sans-serif
Font Family Display:    'Outfit', sans-serif (for headings)
Font Size XS:           0.75rem  (12px)
Font Size SM:           0.875rem (14px)
Font Size Base:         1rem     (16px)
Font Size LG:           1.25rem  (20px)
Font Size XL:           1.5rem   (24px)
Font Size 2XL:          2rem     (32px)
Font Size 3XL:          2.5rem   (40px)
Font Size Hero:         3.5rem   (56px)
Font Weight Normal:     400
Font Weight Medium:     500
Font Weight Semibold:   600
Font Weight Bold:       700
Font Weight Extrabold:  800
```

### 5.3 Spacing & Sizing

```
Spacing Unit:     4px
Border Radius SM: 4px
Border Radius MD: 8px
Border Radius LG: 12px
Border Radius XL: 16px
Border Radius Full: 9999px
Card Width:        160px (mobile) → 220px (desktop)
Card Aspect Ratio: 2:3 (poster)
Navbar Height:     64px
```

### 5.4 Animations

```
Transition Default:  300ms cubic-bezier(0.4, 0, 0.2, 1)
Transition Fast:     150ms cubic-bezier(0.4, 0, 0.2, 1)
Transition Slow:     500ms cubic-bezier(0.4, 0, 0.2, 1)
Card Hover Scale:    1.05 → 1.08 (featured)
Fade In Duration:    400ms
Slide Up Duration:   500ms
Skeleton Shimmer:    1.5s infinite linear
```

### 5.5 Glassmorphism

```css
.glass {
  background: rgba(20, 20, 32, 0.7);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}
```

---

## 6. Data Flow

```
┌─────────────┐     ┌──────────────┐     ┌──────────────────┐
│  TMDB API   │────▸│   FilmKu     │────▸│   Viduki.net     │
│  (metadata) │     │   (client)   │     │   (streaming)    │
└─────────────┘     └──────┬───────┘     └────────┬─────────┘
                           │                      │
                    ┌──────▼───────┐        ┌─────▼──────┐
                    │ localStorage │        │  postMessage│
                    │  - history   │◂───────│  - progress │
                    │  - bookmarks │        │  - fallback │
                    │  - prefs     │        └────────────┘
                    └──────────────┘
```

---

## 7. URL Routing (Hash-based)

| Route                                    | Page          | Description                      |
|----------------------------------------- |-------------- |--------------------------------- |
| `#/`                                     | Home          | Landing page                     |
| `#/movies`                               | Browse        | Browse movies                    |
| `#/tv`                                   | Browse        | Browse TV shows                  |
| `#/movie/:id`                            | MovieDetail   | Movie detail page                |
| `#/tv/:id`                               | TVDetail      | TV show detail page              |
| `#/watch/movie/:id`                      | Watch         | Watch movie                      |
| `#/watch/tv/:id/:season/:episode`        | Watch         | Watch TV episode                 |
| `#/search?q=:query`                      | Search        | Search results                   |
| `#/my-list`                              | Bookmarks     | User's saved content             |
| `#/*`                                    | NotFound      | 404 page                         |

---

## 8. localStorage Keys

| Key                       | Type          | Description                               |
|-------------------------- |-------------- |------------------------------------------ |
| `filmku-watchHistory`     | Object        | Watch progress data (Viduki format)        |
| `filmku-bookmarks`        | Array         | `[{id, type, title, poster_path, added_at}]` |
| `filmku-preferences`      | Object        | `{defaultApi, language}`                  |
| `filmku-searchHistory`    | Array         | `["query1", "query2", ...]` (max 10)      |

---

## 9. Error Handling

| Scenario                   | Behavior                                                    |
|--------------------------- |------------------------------------------------------------ |
| TMDB API rate limit        | Show cached data jika ada, retry setelah 10s                |
| TMDB API down              | Show "Service temporarily unavailable" + retry button       |
| Viduki API 1 fail          | Auto-switch ke API 2, toast notification                    |
| All Viduki APIs fail       | Show "Content not available" message + retry button         |
| No internet                | Show offline indicator + cached "Continue Watching"         |
| Invalid route              | Redirect ke 404 page                                        |
| localStorage full          | Hapus watch history tertua, simpan yang baru                |

---

## 10. Success Metrics (KPI)

| Metric                        | Target                                     |
|------------------------------- |------------------------------------------- |
| Page Load Time                 | < 2 seconds on 3G                          |
| User can play content          | Within 3 clicks from homepage              |
| Fallback success rate          | Content plays on ≥ 1 of 4 APIs            |
| Mobile usability               | No horizontal scroll, tap targets ≥ 44px  |
| Core Web Vitals                | All "Good" ratings                         |
