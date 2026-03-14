---
sidebar_position: 7
title: Challenge — Movie Dashboard
---

# Challenge — Movie Dashboard

## Objective

Build a React SPA that consumes the [TMDB API](https://www.themoviedb.org/documentation/api) to display and search movies.

## Requirements

### Core Features (60 points)

- [ ] Home page: trending movies grid (poster, title, rating)
- [ ] Search: search movies by title with debounced input
- [ ] Movie detail page: full info, cast, similar movies
- [ ] Favorites: save/remove movies with `localStorage` persistence
- [ ] Pagination or infinite scroll

### Technical Requirements (40 points)

- [ ] React Router with at least 3 routes: `/`, `/movie/:id`, `/favorites`
- [ ] TanStack Query for all data fetching (no raw `fetch` in components)
- [ ] Loading skeletons on all data-dependent views
- [ ] Error boundaries / error states
- [ ] TypeScript — no `any`, all API responses typed
- [ ] Tailwind CSS for styling

## Routes

```
/              — Trending movies + search
/movie/:id    — Movie detail
/favorites    — Saved favorites
```

## API Client

```ts
// src/lib/tmdb.ts
const BASE_URL = 'https://api.themoviedb.org/3';
const TOKEN = import.meta.env.VITE_TMDB_TOKEN;

async function tmdbFetch<T>(path: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(`${BASE_URL}${path}`);
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  }

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });

  if (!res.ok) throw new Error(`TMDB error: ${res.status}`);
  return res.json();
}

export const tmdb = {
  trending: () => tmdbFetch<MoviesResponse>('/trending/movie/week'),
  search: (query: string, page = 1) =>
    tmdbFetch<MoviesResponse>('/search/movie', { query, page: String(page) }),
  movie: (id: number) => tmdbFetch<MovieDetail>(`/movie/${id}`),
  credits: (id: number) => tmdbFetch<CreditsResponse>(`/movie/${id}/credits`),
};
```

## Grading

| Criteria | Points |
|----------|--------|
| Trending movies displayed | 10 |
| Search with debounce | 15 |
| Movie detail page | 15 |
| Favorites with localStorage | 10 |
| React Router navigation | 10 |
| TanStack Query usage | 10 |
| Loading and error states | 10 |
| TypeScript types for API | 10 |
| Responsive layout | 5 |
| Polished UI | 5 |
| **Total** | **100** |

## Bonus

- Dark mode toggle
- Genre filter on home page
- Watch trailer button (embed YouTube)
- Share button that copies the movie URL
- A11y: keyboard navigation, proper ARIA labels
