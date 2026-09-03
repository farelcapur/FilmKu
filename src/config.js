export const config = {
  tmdb: {
    apiKey: import.meta.env.VITE_TMDB_API_KEY,
    baseUrl: 'https://api.themoviedb.org/3',
    imageBaseUrl: 'https://image.tmdb.org/t/p/',
    posterSizes: {
      small: 'w185',
      medium: 'w342',
      large: 'w500',
      original: 'original',
    },
    backdropSizes: {
      small: 'w780',
      large: 'w1280',
      original: 'original',
    },
    profileSizes: {
      small: 'w45',
      medium: 'w185',
      original: 'original',
    },
    stillSizes: {
      small: 'w185',
      medium: 'w300',
      original: 'original',
    },
    defaultParams: {
      language: 'id-ID',
      include_adult: false,
    },
  },
  viduki: {
    baseUrl: 'https://viduki.net',
    defaultColor: 'e50914',
    apiTiers: {
      1: { label: 'Server 1 (Multi Server)', path: '/1' },
      2: { label: 'Server 2 (Multi Language)', path: '/2' },
      3: { label: 'Server 3 (Multi Embeds)', path: '/3' },
      4: { label: 'Server 4 (Premium)', path: '/4' },
    },
  },
  cache: {
    ttl: 5 * 60 * 1000,
  },
  search: {
    maxHistory: 10,
    debounceDelay: 300,
    maxSuggestions: 8,
  },
  watchHistory: {
    maxItems: 20,
  },
};
