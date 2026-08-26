# Upstream

Scaffolded from SanityPress (no fork history).

- Source: https://github.com/nuotsu/sanitypress
- Ref: `ae51a8e07f43addb9cdebc55a1bacdcec6752525` (v0.0.138)

```sh
git remote add upstream https://github.com/nuotsu/sanitypress.git
git fetch upstream
git diff ae51a8e07f43addb9cdebc55a1bacdcec6752525 upstream/main -- src/
```

## Divergences

- Removed: blog stack, search-module, form-module, person-list, breadcrumbs,
  accordion-list, card-list, step-list, skill doc, llms.txt / agents.md / api/md.
- Removed deps: `@sanity/assist`, `sanity-plugin-dashboard-widget-vercel`.
- Added deps: `@vidstack/react`, `@iframe-resizer/react`.
- `next.config` redirects() falls back to static redirects if Sanity is down.
- pnpm `nodeLinker: hoisted` (upstream builds with bun).
- `lint` script replaced with `format:check` (`next lint` gone in Next 16;
  upstream ships no ESLint config).
- Token layer in `src/tokens.css` mirrors Appian's Figma variables.

## Pending setup

- **Sanity revalidate webhook is not configured yet.** `/api/revalidate` is built
  and verified locally, but no webhook exists. Every route builds with
  `cacheLife: sanity` (Revalidate 1y), so published edits will not go live until
  it is wired. See the route's own comment for the exact webhook config.
- **`SANITY_API_READ_TOKEN` currently has write scope.** Rotate to a Viewer token
  before launch — it is embedded as `browserToken` in `defineLive`.
- **Redirect edits need a rebuild.** `next.config` resolves `redirect` documents at
  build time, so `/api/revalidate` cannot pick them up. Point a Vercel Deploy Hook
  at a second Sanity webhook filtered to `_type == 'redirect'`.
