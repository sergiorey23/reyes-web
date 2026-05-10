# OpenCode Agent Instructions: reyes-web

## Architecture & Stack
- **Framework:** Astro 6.x with SSR enabled (`output: 'server'`).
- **Deployment:** Vercel serverless adapter (`@astrojs/vercel`).
- **Styling:** Tailwind CSS v4 via `@tailwindcss/vite` plugin (configured in `astro.config.mjs`), NOT the legacy `@astrojs/tailwind` integration.
- **Node Engine:** Requires Node >= 22.12.0 (ES Modules enabled via `"type": "module"` in `package.json`).

## Conventions & Quirks
- **Database / State:** The project currently uses an in-memory database simulator at `src/db.js` for reviews. Do not try to read/write to `reviews.db` (which is an unused artifact). The long-term plan is Turso/LibSQL, but currently API endpoints (like `src/pages/api/reviews.js`) import functions directly from `src/db.js`.
- **API Endpoints:** Placed in `src/pages/api/` as standard `.js` files using Astro's server endpoints.

## Important Commands
- `npm run dev` - Start local dev server (localhost:4321).
- `npm run build` - Build the project for production into `dist/`.
- `npm run preview` - Preview the production build locally.
