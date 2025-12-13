# Performance Audit and Optimization Plan (Mobile Focus)

## Diagnosis
- **API-gated hero causes late LCP/FCP.** The hero image and article data are fetched client-side (`HeroSection` runs a Supabase query on mount), so the HTML contains no hero image URL. The browser can only request the LCP asset after the Supabase round trip and React render, causing a large render delay flagged by Lighthouse ("LCP request is not discoverable in initial document").【F:src/components/sections/HeroSection.tsx†L43-L98】【F:src/components/sections/HeroSection.tsx†L121-L197】
- **Client-side image hydration still waits for data.** Even with WebP and responsive `OptimizedImage`, the hero remains blocked by data fetch; priority hints only apply after render, so perceived load stays slow.【F:src/components/ui/OptimizedImage.tsx†L64-L118】
- **Single bundle, no critical path hints.** The SPA boot must download JS, then fetch Supabase, then render. No preloaded data or images exist in `index.html`/`main.tsx`, so the critical path is long for first navigation.【F:src/main.tsx†L1-L10】【F:index.html†L1-L24】
- **No fallback shell for hero.** Cached hero data exists in `localStorage`, but the render still waits for Supabase to mark `loading=false`, so first paint on a cold visit is blocked by network latency. The skeleton also hides any early text, reducing FCP.

## Phase 1 – Quick wins (no architecture change)
1. **Inline cached hero shell (stale-first).**
   - Files: `src/components/sections/HeroSection.tsx`.
   - Change: Render cached hero immediately (if present) and keep showing it until fresh data arrives; only show skeleton when no cache. Start Supabase fetch but avoid gating paint on it (do not set `loading=true` when cache exists).
   - Impact: Removes render delay for repeat visitors (LCP ~1s faster on second load); no backend changes.
   - Risk: Slightly stale hero for up to 5 minutes (already accepted via cache).

2. **Preconnect and DNS-prefetch for Supabase and Pexels.**
   - Files: `index.html` (head), `src/main.tsx` (if using `Helmet` alternative add via React root provider).
   - Change: Add `<link rel="preconnect" href="https://<supabase-project>.supabase.co" crossorigin>` and for Pexels CDN; include `dns-prefetch` as backup.
   - Impact: Shaves 50–150ms on mobile RTT before the first fetch/image request; no behavioral risk.
   - Risk: Minimal; keep hostnames accurate to avoid unnecessary connections.

3. **Preload hero data via lightweight bootstrap.**
   - Files: `index.html`.
   - Change: Add a small inline script that fetches the hero query endpoint (Supabase RPC or REST) and writes the result to `localStorage` under the same cache key before React loads. Use `requestIdleCallback` fallback.
   - Impact: Moves data fetch earlier (parallel with JS download), potentially cutting LCP by ~300–500ms on cold load.
   - Risk: Slight extra bytes; ensure script guards against errors and respects existing cache expiry.

4. **Inline low-quality placeholder (LQIP) for hero.**
   - Files: `src/components/articles/ArticleCardHero.tsx` and `OptimizedImage`.
   - Change: Support an optional tiny base64 placeholder prop; render it as background or blur-up until main image loads.
   - Impact: Improves perceived LCP/FCP even if actual hero image arrives later; low bandwidth.
   - Risk: Need a way to store placeholder in Supabase or derive via query parameter (e.g., `w=20&q=10`).

5. **Font loading guard.**
   - Files: `index.html`.
   - Change: Add `font-display: swap` (already implied) and ensure preload uses `crossorigin`; consider `rel=preconnect` to fonts.gstatic.com.
   - Impact: Avoids any chance of render-blocking fonts; small improvement to FCP.
   - Risk: Minor flash of fallback text.

## Phase 2 – Structural SPA improvements (still client-rendered)
1. **Static hero fallback in HTML.**
   - Files: `index.html`, `src/components/sections/HeroSection.tsx`.
   - Change: Embed last-published hero data (from build time) into `window.__HERO_DATA__` JSON in `index.html`, hydrated by HeroSection before Supabase fetch. Build step fetches from Supabase once (`npm script` hitting REST) and writes JSON.
   - Impact: Makes hero discoverable in initial document for the very first visit, improving LCP detectability and render delay.
   - Risk: Build pipeline needs Supabase service key; data can become stale between deploys.

2. **Split bundles and defer non-critical JS.**
   - Files: `vite.config.ts`, `src/App.tsx` (dynamic imports for carousels/category pages), `src/components/sections/CategoryCarousel.tsx`.
   - Change: Code-split heavy carousels and category routes with `React.lazy`; keep hero and above-the-fold minimal in main bundle.
   - Impact: Faster JS parse/execute → earlier render on mobile; reduces FCP by ~200–400ms on slower devices.
   - Risk: Introduces suspense boundaries; ensure fallbacks don’t shift layout.

3. **Serve hero image via optimized CDN URL.**
   - Files: `OptimizedImage`, hero fetch logic.
   - Change: Cache a deterministic, size-appropriate hero URL (e.g., `w=1200&q=80&fm=webp`) in data so it can be inlined/preloaded directly; avoid client-side URL manipulation for the LCP image.
   - Impact: Allows `<link rel="preload" as="image">` with exact URL in `index.html`, eliminating discovery delay.
   - Risk: Slightly larger metadata; must ensure URLs stay stable.

## Phase 3 – Optional SSR/SSG path (bigger lift)
1. **Adopt Vite SSR to HTML-stream hero.**
   - Files: `vite.config.ts`, `src/entry-server.tsx`, `netlify.toml`.
   - Change: Enable Vite SSR with a Netlify adapter (Edge Functions/Lambdas) to render hero server-side; hydrate on client.
   - Impact: LCP becomes server-rendered; mobile scores can reach 90+ if TTFB is reasonable.
   - Risk: Netlify free tier limits compute; more complex deploy/runtime.

2. **Prerender (SSG) homepage and category pages.**
   - Files: `package.json` script, `vite.config.ts`, `netlify.toml`.
   - Change: Use `vite-plugin-ssg` or `@vitejs/plugin-ssr` to prerender static HTML at build, fetching Supabase data once. Serve prerendered HTML via Netlify; client hydrates SPA navigation.
   - Impact: Best improvement for first load (hero HTML + LCP URL in document); likely path to 90+ without design changes.
   - Risk: Content freshness depends on rebuild cadence; need webhooks or periodic rebuilds.

## Low-value / Not recommended right now
- **Further image format tweaks** (already WebP/srcset/fetchpriority): diminishing returns without addressing data gating.
- **Micro-optimizing Tailwind or minor JS refactors:** TBT is already ~0; won’t improve LCP.
- **Aggressive lazy-loading above-the-fold:** Hero must stay priority; carousels already deferred.
- **Switching fonts again:** Current non-blocking setup is adequate; focus on data and critical path instead.

## Success criteria
- Phase 1 should lift mobile Lighthouse performance from ~70–75 to low/mid 80s by cutting hero render delay and improving perceived paint.
- Phase 2 adds discoverability/preload and bundle slimming, likely reaching high 80s.
- Phase 3 (SSR/SSG) is the path to 90+ if operationally acceptable.

## Cum testăm și validăm în Lighthouse
- Ghid detaliat (setup local, preview server, pași Lighthouse, deploy pe Netlify): vezi [`docs/lighthouse-testing.md`](./lighthouse-testing.md).
- Pentru comparații corecte, rulează Lighthouse pe build-ul de producție (`npm run build && npm run preview`) în Incognito, cu cache gol pentru „cold” și o a doua rulare pentru „warm cache”.
