# Dev Notes

## Stack

| Concern       | Choice                                                                    |
| ------------- | ------------------------------------------------------------------------- |
| Workspace     | pnpm workspaces: `packages/*` (shared kit) and `sites/*` (two Waku apps)  |
| Build         | Waku (`waku build`), one static export per site in its `dist/public`      |
| Content model | fumadocs-mdx collections with zod front-matter schemas                    |
| Styling       | StyleX over one shared token system (editorial serif + Inter, light/dark) |
| Controls      | React Aria Components for buttons/disclosure; native server action links  |
| Math          | `remark-math` + `rehype-katex` at build time, plus front matter           |
| Host          | Cloudflare Pages, one project per site                                    |

## Layout

- `content/` — the one content tree, one directory per entry. It belongs to the
  repository, not to a site.
- `public/` — the one asset tree (avatars, PDFs, badges). Both sites build with
  `publicDir` pointed here.
- `packages/site-kit/` — everything shared:
  - `src/components/` — StyleX-styled components used by both sites' views.
  - `src/content/` — content model: `schemas.ts` (zod per collection),
    `collections.ts` (the collection definitions each app re-exports from its
    `source.config.ts`), `source.ts` (`createSource`, the locale-bound accessors),
    `i18n.ts` (`createSiteI18n`), plus ordering, formatting and link helpers.
  - `src/views/` — the page implementations the route table names.
  - `src/router/` — the route table both sites publish (`shared-routes.ts`), the
    Waku config-based registration of it (`register.ts`), the site-owned file routes
    (`file-routes.ts`) and the document shell and frame (`document.tsx`). See
    [Routing](#routing).
  - `src/site/` — `SiteConfig` and the localized menu.
  - `src/shell/` — the document shell (theme + language-switch bootstrap) and the 404
    body; `src/routes/` — the `sitemap.xml` / `robots.txt` / `index.xml` handlers.
  - `src/styles/` — `tokens.stylex.ts` (palette, type scale, widths, radii, motion),
    `frame.stylex.ts` (page grid and skip link), `global.css` (font faces, document
    palette, current-nav marker, KaTeX overflow) and `fonts/` (self-hosted Source Serif 4
    and Inter variable Latin subsets with their OFL licences).
  - `src/site-context.ts` — `defineSite()` / `siteContext()`: the per-process site
    registry the shared components read. A React context is not an option here, because
    server components run against React's `react-server` build, which has no
    `createContext`.
  - `src/waku-config.ts` — `createWakuConfig()`, the shared Vite/Waku configuration.
- `sites/yhma-yyds-group/` (English, https://yhmayyds.group) and
  `sites/magroup-ac-cn/` (Chinese, https://magroup.ac.cn) — an app is:
  `package.json`, `tsconfig.json`, `waku.config.ts`, `source.config.ts`,
  `wrangler.toml`, `src/site.config.ts`, `src/lib/source.ts`, `src/waku.server.tsx`
  and the `src/pages/**` files only that site publishes. The two apps' route sets are
  identical because they share one table, not because two file trees happen to match;
  `pnpm check:routes` compares what the two builds published.
- `scripts/` — migration and verification tooling. `check-route-parity.mjs` is the one
  that still runs after the migration; the other two need the Hugo inputs restored from
  git history and say so in their headers.

## Design system

The two sites share one editorial system — ink on paper, a scientific serif for reading,
Inter for the interface, and a single cobalt accent that marks anything interactive.

- **Concept.** "State functions": the site reads like a well-set scientific monograph. The
  one bold move is the home hero's temperature–entropy diagram, which sets the ideal
  Carnot cycle (dashed) against the finite-time cycle the lab actually studies (solid).
  Everything around it stays quiet: hairlines instead of card borders, no uppercase
  labels, no decorative gradients, no second accent.
- **Colour.** Paper/ink neutrals plus cobalt (`#1d4ed8` light, `#82a6ff` dark) and a warm
  tone used only in the diagram and the news marker. Every text pair is AA in both
  themes. Dark mode is expressed through the documented
  `stylex.when.ancestor('[data-theme="dark"]')` condition; the theme marker lives on
  `<html>`.
- **Type.** Source Serif 4 carries headings, publication titles and long-form prose;
  Inter carries navigation, metadata and controls. Tracking is size-specific (tight on
  display type, near zero on body) and dates use tabular figures. The Chinese site falls
  back to PingFang SC / Songti SC rather than downloading a CJK web font.
- **Layout.** `WIDTH.page` is the one alignment edge (hero, section headings, year
  labels, page titles); reading content sits in narrower left-aligned measures
  (`WIDTH.measure`, `WIDTH.prose`). Section rhythm belongs to the design system, not to an
  authored `design.spacing` value.
- **Motion.** One orchestrated entrance on the home hero (copy rises in 60ms steps, the
  finite-time loop draws once). Press feedback is a 140ms `scale(0.97)` on pointer-down;
  hover states are behind `@media (hover: hover) and (pointer: fine)`; `prefers-reduced-motion`
  keeps the finished state instead of hiding content.
- **Accessibility.** Skip link to `<main>`, visible 2px accent focus ring, one `h1` per
  page, `aria-current` styled on the nav, icon-only controls keep labels, the diagram has a
  localized accessible name and a text legend, KaTeX display math scrolls instead of
  forcing the page sideways, and the mobile menu keeps React Aria's disclosure semantics.

## Development

Use a Node.js version satisfying `package.json` (`>=26.12.1`) and pnpm 12+.
The current `mise.toml` pin is older than that engine range; select a compatible
runtime locally rather than lowering the engine requirement.

```bash
pnpm install
pnpm dev          # both sites: http://localhost:3000 (en), http://localhost:3001 (cn)
pnpm dev:en
pnpm dev:cn
```

| Command                | Purpose                                                           |
| ---------------------- | ----------------------------------------------------------------- |
| `pnpm dev`             | Both dev servers with HMR (3000 / 3001)                           |
| `pnpm build`           | Static export of both sites                                       |
| `pnpm build:en`        | `sites/yhma-yyds-group` only                                      |
| `pnpm build:cn`        | `sites/magroup-ac-cn` only                                        |
| `pnpm typecheck`       | Root tooling plus `tsc --noEmit` in every workspace package       |
| `pnpm lint`            | ESLint across the workspace (per-file tsconfig lookup)            |
| `pnpm test`            | Fast Node Vitest: content, routes, authors, formatting, bootstrap |
| `pnpm test:dev`        | Real Waku dev + Chromium smoke check (requires both dev servers)  |
| `pnpm test:ui`         | Chromium component tests with real React Aria and compiled StyleX |
| `pnpm check:routes`    | Both builds publish the same URLs                                 |
| `pnpm content:codegen` | Regenerate each site's `.source/` from the collections            |
| `pnpm typegen`         | Regenerate each site's `.source/`                                 |
| `pnpm start`           | Serve a built site (`cd sites/<name> && pnpm start`)              |

## Run browser checks

After installing dependencies, install Playwright's Chromium once:

```bash
pnpm exec playwright install chromium
pnpm test:ui
```

The browser suite is separate from `pnpm test`; it compiles StyleX and exercises
real React Aria components in Chromium, including keyboard focus, pending/disabled
buttons, responsive disclosure, theme changes and native links. It does not mock
React Aria, StyleX or media queries. The browser config lives in
[vitest.ui.config.ts](../packages/site-kit/vitest.ui.config.ts).

Also test Waku's actual development environments, preferably after a fresh start:

```bash
# Terminal 1 (repository root)
pnpm dev

# Terminal 2 (after both servers report ready)
pnpm test:dev
```

[The dev smoke check](../scripts/check-dev.mjs) connects to ports 3000 and 3001; it
never starts or stops servers. It checks the RSC response, four page types per site,
theme styling, mobile keyboard navigation and missing URLs. A successful static build
or a 200 fallback HTML response alone cannot catch development-only module resolution
errors. This check does not cover HMR.

SSR stays disabled, but Waku still needs the `react-server` condition in its RSC
environment. The [shared Vite config](../packages/site-kit/src/waku-config.ts) keeps
`react-server-dom-webpack` in that environment's transform pipeline so Waku can patch
it. Do not set a process-wide `NODE_OPTIONS=--conditions=react-server`: browser/HTML
rendering needs ordinary React. The [shared package](../packages/site-kit/package.json)
also declares React as a peer dependency so plugin-rsc discovers its React Aria
dependency tree instead of loading those components against a separate native React
instance in dev.

For release smoke testing, build both sites, run `pnpm check:routes`, and serve each
site's `dist/public` directory. Check the home, people, publication and event pages in
both languages; test desktop/mobile navigation, keyboard focus, theme reloads (including
blocked storage), and alternate-site links with a query and hash. Component tests alone
do not verify the fallback HTML → RSC document mount.

## Deploying

Each site is its own Cloudflare Pages project, configured by its own `wrangler.toml`
(`yhma-yyds-group`, `magroup-ac-cn`), both publishing `<site>/dist/public`:

```bash
pnpm build:en && (cd sites/yhma-yyds-group && wrangler pages deploy)
pnpm build:cn && (cd sites/magroup-ac-cn   && wrangler pages deploy)
```

Wrangler reads `.env` from its working directory, which is now the site package rather
than the repository root; export `CLOUDFLARE_ACCOUNT_ID` (see the root `.env`) in the
shell, or add a per-site `.env`, before deploying.

If the current `/cn/...` URLs were ever published from the previous single-site build,
add `public/_redirects`-style rules on the _English_ project
(`/cn/* https://magroup.ac.cn/:splat 301`); the Waku port never published them, so this is
only needed if a preview deployment did.

## Rendering

Every route is `render: 'static'` **and** `unstable_disableSSR: true`, so `waku build`
writes a fallback shell per route plus the RSC payload that fills it in. Measured on the
English site, that means:

|                                       | shell HTML per route      | content in the served HTML        |
| ------------------------------------- | ------------------------- | --------------------------------- |
| `unstable_disableSSR: true` (current) | ~3.1 KB, with bootstrap   | no — arrives with the RSC payload |
| flag removed                          | 40–420 KB (`/` is 420 KB) | yes                               |

Both flags are set once, for every route, in
`packages/site-kit/src/router/register.ts` (`createSharedRoutes`) and
`packages/site-kit/src/router/file-routes.ts` (`createFileRoutes`). Removing
`unstable_disableSSR` makes the build emit server-rendered HTML, which is what a crawler,
a link preview or a reader without JavaScript sees; keeping it means none of them see any
page content. If that trade changes, edit those two files and re-run `pnpm build`.

## Routing

Both sites are one Waku app each, and both drive Waku's config-based router
(`createPages` → `createPage` / `createLayout` / `createRoot` / `createApi`) from one
shared table.

- **`packages/site-kit/src/router/shared-routes.ts`** — every route both sites publish,
  as entries of `sitePages` (and `siteApis` for the feed and the two crawler files). Each
  entry names the languages that serve it:

  ```ts
  { component: PeopleList, locales: ['cn', 'en'], path: '/people' }
  ```

  `locales` is exhaustive: a language that is not listed does not serve the route, and
  `createSharedRoutes` refuses to register it for that language. A route that only one
  language should serve lists only that language; a route that needs a different
  component or param set per language is two entries with disjoint `locales`. The
  components read their language from `siteContext()`, so one entry normally serves both.
  The catch-all `/[...slugs]` is last in the table: it claims the standalone pages the
  entries above it have not claimed.

- **`sites/<name>/src/waku.server.tsx`** — the app's entry: it imports its site context
  and calls `createSharedRoutes(fns, context)` for its own language, then
  `createFileRoutes(fns, import.meta.glob('./pages/**/*', { eager: true }), shared)` for
  the routes only it publishes. Every created page carries the language it was created
  for, and the app declares the table's slug-less paths (`SharedPaths`) as
  `RouteConfig.paths`.

- **File-based routes** live in `sites/<name>/src/pages/`, one module per route, in that
  site's language: `blog/index.tsx` → `/blog`, `join-us.tsx` → `/join-us`, and
  `blog/[...slugs].tsx` → `/blog/[...slugs]` with `staticPaths` exported. Segments
  starting with `_` or `.` are ignored, so co-located modules are possible. Waku cannot
  run its file-system router in the same app as the config-based one the table uses
  (`fsRouter` is a translator over `createPage`, and it is not composable), so
  `file-routes.ts` implements that small subset; `_layout`, `_root`, `_api` and `_slices`
  are not part of it, because the document, the frame and the crawler files are shared. A
  file route that repeats a path the shared table serves in that language is an error, not
  an override.

`pnpm test` asserts the table's invariants — every route names a language, no path repeats
within a language, both languages get the same paths — and `pnpm check:routes` compares
what the two builds published.

## Localization

One content tree serves both sites. An entry is a directory with an `index.mdx`
(English) and an optional `index.cn.mdx` (Chinese):

```
content/
  pages/index.mdx                 -> /
  pages/publications/index.mdx    -> /publications/
  publications/<slug>/index.mdx   -> /publication/<slug>/
  authors/<slug>/index.mdx        -> /people/<slug>/
  fundings/<slug>/index.mdx       -> /funding/<slug>/
  events/<slug>/index.mdx         -> /event/<slug>/
```

The collection's `files` glob has to match **both** names: the i18n `dot` parser only
assigns a language to files the collection already imported, so a pattern of
`*/index.mdx` publishes the English body and drops every translation.
`packages/site-kit/src/__tests__/collections.test.ts` guards that.

Each site then picks one storage of the same tree:

- English site: `getPages('en')`, `hideLocale: 'default-locale'` (nothing is prefixed).
- Chinese site: `getPages('cn')` with `fallbackLanguage: 'en'` and
  `hideLocale: 'always'`. The `cn` storage inherits the English one, so an untranslated
  entry still has a page — it just renders the English body — and the route sets of the
  two sites stay identical, which is what makes the language switch a plain
  path-preserving link. For untranslated entries the Chinese site prefers the authored
  `title_zh` / `abstract_zh` front matter when it exists.
- `content/pages/index.mdx` (the home page) has no Chinese translation yet, so the
  Chinese home page still renders the English hero until `content/pages/index.cn.mdx`
  exists.

Front matter is validated by the schema at build time, so a typo fails the build with the
file and the offending key. `pnpm test` runs the same validation directly.

Each site's `.source/` is generated, and it is needed before `pnpm typecheck` can resolve
front-matter types. `pnpm build` and `pnpm dev` write it, so a fresh checkout goes
`pnpm install && pnpm typegen && pnpm typecheck`. `pnpm typegen` regenerates it without a
build — run it after adding a collection. Route types are not generated any more: they
come from the shared table (`SharedPaths`), which the app's entry declares.

## Shared UI boundaries

The kit's internal components are deliberately small, not a public UI package:

- [Button](../packages/site-kit/src/components/ui/button.tsx) is a client React Aria
  button. RAC owns press events, keyboard/pointer behavior, slots, controlled props,
  refs and render props. The default type is `button`; `isPending` does not imply
  `isDisabled` (pending remains focusable).
- [ActionLink](../packages/site-kit/src/components/ui/action-link.tsx) is a server-safe
  native anchor with a required `href`. Hero CTAs, attachment links and the résumé
  CTA use it; MDX prose, cards, social and navigation links remain native anchors.
  Native URL, target, modifier-key and download behavior is not intercepted.
- Both accept `xstyle?: StyleXStyles`. Composition is base → state → caller `xstyle`.
  Generated **class names and inline styles** are retained; caller `className` is
  appended and caller inline `style` wins. `Button` retains RAC's function-valued
  `children`, `className` and `style`; `style` is never repurposed as StyleX input.
- Navbar resolves site data, URLs and localized labels on the server. Its
  [disclosure island](../packages/site-kit/src/components/navigation-disclosure.tsx)
  receives native link children and owns only open/focus state. At 1024px it is
  expanded; mobile starts closed. This is navigation, not an ARIA menu or focus trap.
- Browser-derived alternate URLs and `aria-current` have one owner: the document
  bootstrap. It handles navigation mounted after the RSC payload, replacements and
  `hashchange`/`popstate`. Do not introduce a competing React location store.
- The shared Waku config injects bootstrap scripts into the actual fallback HTML in
  dev and production. Do not put them in `RootShell`: script elements mounted through
  RSC do not execute. A filtered theme observer restores `data-theme` if React clears
  the document singleton's attributes while mounting.
- Theme bootstrap chooses an initial stored/system theme; the theme button observes
  and toggles `html.dataset.theme`, persisting under `theme`. It does not follow later
  OS preference changes. `<html>` carries both `stylex.defaultMarker()` and `data-theme`,
  matching the default marker used by `stylex.when.ancestor()`.

Do not pass server-only site registries, URL resolver functions or MDX/content objects
through a client boundary. Adding a control does not require moving its whole view to
`'use client'`, or introducing a global router/theme provider. Static routes still use
the SSR-disabled rendering policy described above.

## Styles

Component styles live in `*.stylex.ts` modules next to the components that use them, and
`packages/site-kit/src/styles/tokens.stylex.ts` holds the colour ramps, spacing and type
scales. Two StyleX constraints are worth knowing before editing those files:

- A condition value must be an inline literal. An imported constant binds as a StyleX
  value object, so `{ default: x, [DARK]: imported }` fails validation. Dark-mode
  conditions therefore repeat `stylex.when.ancestor('[data-theme="dark"]')` per module.
- Media queries must be literal `'@media (...)'` keys, for the same reason.

`pnpm dev` serves the stylesheet from `/virtual:stylex.css`, loaded by the tags
`documentShell()` in `packages/site-kit/src/waku-config.ts` adds. The plugin that owns
that endpoint injects them with Vite's `transformIndexHtml` hook, and Waku only runs that
hook for an app that ships its own `index.html` — not for the fallback document every
route here renders, since they all set `unstable_disableSSR`. Builds are unaffected; the
rules land in the site's stylesheet either way.

`public/` holds the files copied verbatim into each build: author avatars, publication
PDFs, the Inter variable font, KaTeX fonts and the Creative Commons badge.
