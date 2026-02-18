# RoboFriends (React + Vite)

I built RoboFriends as a clean, portfolio-friendly React app that demonstrates component-driven UI, client-side data fetching, fast search filtering, and a modern Vite-based developer workflow.

This project is intentionally small and readable: it’s designed to be easy to extend (new components, new API data, new UI behavior) without introducing framework complexity.

## What I Built

- **Searchable “robot friends” directory**: I fetch a list of users from `https://jsonplaceholder.typicode.com/users`, then render each as a card with a RoboHash avatar.
- **Instant client-side filtering**: As you type in the search box, I filter the list by name (case-insensitive) and re-render the card grid.
- **Reusable React components**: I keep UI pieces focused and composable (`Card`, `CardList`, `SearchBox`, `Scroll`).
- **Loading state**: I render a simple “Loading…” state while the initial network request is in-flight.
- **Resilient loading + search UX**: if the API request fails I fall back to local seed data and show a Retry button; and when a search matches nothing I display a “No robots found.” message.

## Design & UI Notes (First Person)

- I use **Tachyons utility classes** to style quickly and consistently (spacing, layout, hover/grow effects, borders).
- I apply a **full-page gradient background** and keep the layout centered to make the UI feel deliberate and polished.
- I constrain the card list inside a **scrollable container** so the header + search input stays visible while browsing many cards.
- I use a **custom SEGA-style header font** via `src/containers/SEGA.TTF` and the `.sega-text` class in `src/containers/App.css`.

## Development & Engineering Highlights

- **React 19 + StrictMode**: I render the app under `StrictMode` to catch unsafe patterns early.
- **Hooks-based App**: `App` is implemented as a function component using hooks (`useEffect` for fetching, `useMemo` for filtering).
- **Vite dev workflow**: fast startup, fast rebuilds, and a production build pipeline via `vite build`.
- **ESLint configured**: a lightweight linting setup to keep code quality consistent.
- **Tests (Vitest + Testing Library)**: basic component tests cover loading, filtering, empty results, and fallback/retry behavior.
- **Service worker caching**: I register a service worker on page load. It provides basic offline caching (cache-first for built/static assets, and network-first caching for the JSONPlaceholder users API). Note: the first visit still requires a network connection—offline support kicks in after the assets/API response have been cached.
- **CSS build compatibility fix**: I vendor a cleaned Tachyons stylesheet (`src/tachyons-clean.css`) to remove legacy hack declarations (e.g. `*zoom`, `_display`) that modern CSS tooling can flag.

## Project Structure

- `src/main.jsx`: React entry point (creates root, renders `App`, registers service worker)
- `src/containers/App.jsx`: data fetching, search state, filtering, and layout
- `src/containers/App.css`: SEGA font-face + `.sega-text` styling
- `src/containers/App.test.jsx`: component tests (Vitest + Testing Library)
- `src/components/`: presentational components
- `src/index.css`: global background + layout basics
- `src/test/setup.js`: test setup (jest-dom matchers + DOM cleanup)
- `public/sw.js`: service worker file
- `src/robots.js`: fallback robot seed data (used if the JSONPlaceholder request fails)

## Getting Started

**Prereqs**
- Node.js 18+ recommended

**Install**
- `npm install`

**Run in development**
- `npm run dev`

**Build for production**
- `npm run build`

Vite outputs the production build to `dist/`.

**Preview the production build**
- `npm run preview`

**Lint**
- `npm run lint`

**Tests**
- `npm test`
