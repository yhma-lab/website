# Dev Notes

## Stack

| Concern       | Choice                                                                   |
| ------------- | ------------------------------------------------------------------------ |
| Workspace     | pnpm workspaces: `packages/*` (shared kit) and `sites/*` (two Waku apps) |
| Build         | Waku (`waku build`), one static export per site in its `dist/public`     |
| Content model | fumadocs-mdx collections with zod front-matter schemas                   |
| Styling       | StyleX, design tokens lifted from the previous Tailwind build            |
| Math          | `remark-math` + `rehype-katex` at build time, plus front matter          |
| Host          | Cloudflare Pages, one project per site                                   |

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

## Development

Requires Node.js 26+ and pnpm 11+.

```bash
pnpm install
pnpm dev          # both sites: http://localhost:3000 (en), http://localhost:3001 (cn)
pnpm dev:en
pnpm dev:cn
```

| Command                | Purpose                                                          |
| ---------------------- | ---------------------------------------------------------------- |
| `pnpm dev`             | Both dev servers with HMR (3000 / 3001)                          |
| `pnpm build`           | Static export of both sites                                      |
| `pnpm build:en`        | `sites/yhma-yyds-group` only                                     |
| `pnpm build:cn`        | `sites/magroup-ac-cn` only                                       |
| `pnpm typecheck`       | Root tooling plus `tsc --noEmit` in every workspace package      |
| `pnpm lint`            | ESLint across the workspace (per-file tsconfig lookup)           |
| `pnpm test`            | Vitest: schemas, collection globs, route table, authors, sorting |
| `pnpm check:routes`    | Both builds publish the same URLs                                |
| `pnpm content:codegen` | Regenerate each site's `.source/` from the collections           |
| `pnpm typegen`         | Regenerate each site's `.source/`                                |
| `pnpm start`           | Serve a built site (`cd sites/<name> && pnpm start`)             |

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
| `unstable_disableSSR: true` (current) | ~750 B                    | no — arrives with the RSC payload |
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

## Styles

Component styles live in `*.stylex.ts` modules next to the components that use them, and
`packages/site-kit/src/styles/tokens.stylex.ts` holds the colour ramps, spacing and type
scales. Two StyleX constraints are worth knowing before editing those files:

- A condition value must be an inline literal. An imported constant binds as a StyleX
  value object, so `{ default: x, [DARK]: imported }` fails validation. Dark-mode
  conditions therefore repeat `stylex.when.ancestor('[data-theme="dark"]')` per module.
- Media queries must be literal `'@media (...)'` keys, for the same reason.

`pnpm dev` serves the stylesheet from `/virtual:stylex.css`, loaded by the tags
`stylexDevStyles()` in `packages/site-kit/src/waku-config.ts` adds. The plugin that owns
that endpoint injects them with Vite's `transformIndexHtml` hook, and Waku only runs that
hook for an app that ships its own `index.html` — not for the fallback document every
route here renders, since they all set `unstable_disableSSR`. Builds are unaffected; the
rules land in the site's stylesheet either way.

`public/` holds the files copied verbatim into each build: author avatars, publication
PDFs, the Inter variable font, KaTeX fonts and the Creative Commons badge.
