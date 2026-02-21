# RoboFriends

A small React + Vite app that fetches a list of users and renders them as “robot friend” cards with fast client-side search.

- Live preview: https://robofriends.fcjamison.com/

## Features

- Fetches users from `https://jsonplaceholder.typicode.com/users`
- Renders cards with avatars from `https://robohash.org/<id>?200x200`
- Case-insensitive search filtering by name
- Loading state while the initial request is in flight
- Failure handling: falls back to local seed data and shows a Retry button
- Empty state: “No robots found.” when a search matches nothing

## Tech Stack

- React 19
- Vite (dev server + build)
- Tachyons for utility-first styling (vendored as `src/tachyons-clean.css`)
- ESLint (flat config)
- Vitest + Testing Library (React, user-event)
- Custom service worker for lightweight offline caching (`public/sw.js`)

## Quickstart

### Prerequisites

- Node.js 18+ (20+ also works)

### Install

```bash
npm install
```

### Run (dev)

```bash
npm run dev
```

Vite prints the local URL in the terminal (typically `http://localhost:5173`).

If you have a local domain set up for this project, you can also use:

- `http://robofriends.localhost:5173/`

### Build (prod)

```bash
npm run build
```

Build output is written to `dist/`.

### Preview (prod build locally)

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

### Test

```bash
npm test
```

Note: `npm test` runs `vitest run` (single run). For watch mode you can use `npx vitest`.

## NPM Scripts

| Command           | What it does                          |
| ----------------- | ------------------------------------- |
| `npm run dev`     | Starts the Vite dev server            |
| `npm run build`   | Creates a production build in `dist/` |
| `npm run preview` | Serves the production build locally   |
| `npm run lint`    | Runs ESLint across the repo           |
| `npm test`        | Runs the test suite once (Vitest)     |

## VS Code Tasks

This repo includes a couple of convenience tasks in `.vscode/tasks.json`:

- **npm: install + dev** — runs `npm install` and then starts `npm run dev`
- **Open in Browser (robofriends.localhost)** — opens `http://robofriends.localhost:5173/`

Run them via **Terminal → Run Task…**.

## Project Layout

- `index.html` — HTML shell and Vite entry
- `src/main.jsx` — React entry point; renders `App` and registers the service worker
- `src/containers/App.jsx` — data fetching, search state, filtering, and page layout
- `src/components/` — presentational components (`Card`, `CardList`, `SearchBox`, `Scroll`)
- `src/robots.js` — fallback seed data (used if the API request fails)
- `src/test/setup.js` — test setup for jest-dom matchers
- `src/containers/App.test.jsx` — app behavior tests
- `public/sw.js` — service worker implementation

## How It Works (High Level)

1. `App` fetches users from JSONPlaceholder on mount.
2. If the request succeeds, the response is stored in local state (`robots`).
3. If the request fails, the UI switches to fallback data (`src/robots.js`) and shows an error banner + Retry button.
4. The search input updates `searchField`; filtered results are derived with `useMemo`.
5. `CardList` renders one `Card` per robot, and each card uses RoboHash for its image.

## Service Worker / Offline Caching

This repo registers a service worker on page load (`src/registerServiceWorker.js`) that is served from `public/sw.js`.

Caching strategy in `public/sw.js`:

- App navigations (`request.mode === 'navigate'`): **network-first**, falls back to cached `index.html`
- Built/static assets (e.g. `/assets/*`, scripts/styles/fonts/images): **cache-first**
- Users API (`https://jsonplaceholder.typicode.com/users`): **network-first** with a cache fallback

Operational notes:

- First visit still needs the network; offline support improves after resources are cached.
- If you change caching behavior, bump `CACHE_VERSION` in `public/sw.js` to invalidate old caches.
- If the app behaves “stuck” after a deploy (common with service workers), unregister the service worker and clear site data in your browser devtools, then reload.

## Testing

Tests live in `src/containers/App.test.jsx` and cover:

- initial loading state
- rendering data from the API
- search filtering and empty state
- fallback data + retry flow when the API fails

Vitest is configured in `vite.config.js` with:

- `environment: 'jsdom'`
- `setupFiles: './src/test/setup.js'`

## Linting

ESLint is configured via `eslint.config.js` (flat config) and is run with `npm run lint`.

## Configuration Notes

- API endpoint lives in `src/containers/App.jsx` (`requestRobots`).
- The browser tab title is set in `index.html` (currently `robofriends`).

## Deployment

`npm run build` produces a static site in `dist/` that can be hosted on any static hosting provider.

Service worker reminders:

- Service workers require HTTPS in production (or `http://localhost` for local dev).
- `sw.js` is registered from the site root (`/sw.js`), so your hosting should serve it at that path.
