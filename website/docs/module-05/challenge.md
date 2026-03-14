---
sidebar_position: 6
title: Challenge — Personal Blog
---

# Challenge — Personal Blog

## Objective

Build a two-page personal blog application using **vanilla TypeScript**, the DOM API, and localStorage — no frameworks.

## Pages

### `index.html` — New Post Form
- Input fields: title (text), author (text), content (textarea)
- Submit button — validates and saves to localStorage
- Link to `blog.html`
- Form should clear after successful submit

### `blog.html` — Posts Feed
- Displays all saved blog posts
- Each post shows: title, author, date, and content preview (first 150 chars)
- "Read more" toggles full content visible
- Delete button removes post from localStorage
- Dark mode toggle persists in localStorage
- Empty state message when no posts exist

## Data Shape

```ts
interface BlogPost {
  id: string;
  title: string;
  author: string;
  content: string;
  createdAt: string; // ISO date string
}
```

## Requirements

### Functionality (50 points)
- [ ] Add new post, saved to localStorage
- [ ] All posts display on `blog.html` on page load
- [ ] Delete post removes from storage and re-renders
- [ ] Form validation (no empty fields, error messages shown inline)
- [ ] Dark mode toggle persists across page loads

### Code Quality (30 points)
- [ ] TypeScript with `strict: true` — zero `tsc` errors
- [ ] Separate modules: `types.ts`, `storage.ts`, `form.ts`, `feed.ts`
- [ ] Event delegation used for delete/expand buttons
- [ ] No `innerHTML` with unsanitized user data (use `textContent`)

### UI (20 points)
- [ ] Uses Tailwind CSS (from previous module)
- [ ] Responsive on mobile and desktop
- [ ] Visible focus states on all interactive elements
- [ ] Dark mode styles on all components

## Grading

| Criteria | Points |
|----------|--------|
| Add, display, delete posts | 25 |
| Form validation | 15 |
| Dark mode + localStorage | 10 |
| TypeScript types | 15 |
| Code organization | 15 |
| UI quality | 20 |
| **Total** | **100** |
