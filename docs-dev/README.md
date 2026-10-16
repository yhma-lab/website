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
  - `src/views/` — the page implementations the route files delegate to.
  - `src/site/` — `SiteConfig` and the localized menu.
  - `src/shell/` — the document shell (theme + language-switch bootstrap) and the 404
    body; `src/routes/` — the `sitemap.xml` / `robots.txt` / `index.xml` factories.
  - `src/site-context.ts` — `defineSite()` / `siteContext()`: the per-process site
    registry the shared components read. A React context is not an option here, because
    server components run against React's `react-server` build, which has no
    `createContext`.
  - `src/waku-config.ts` — `createWakuConfig()`, the shared Vite/Waku configuration.
- `sites/yhma-yyds-group/` (English, https://yhmayyds.group) and
  `sites/magroup-ac-cn/` (Chinese, https://magroup.ac.cn) — an app is:
  `package.json`, `tsconfig.json`, `waku.config.ts`, `source.config.ts`,
  `wrangler.toml`, `src/site.config.ts`, `src/lib/source.ts`, `src/waku.server.tsx`
  and `src/pages/**`. The two `src/pages/**` trees are identical file for file, which
  is what `pnpm check:routes` asserts.
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

| Command                | Purpose                                                       |
| ---------------------- | ------------------------------------------------------------- |
| `pnpm dev`             | Both dev servers with HMR (3000 / 3001)                       |
| `pnpm build`           | Static export of both sites                                   |
| `pnpm build:en`        | `sites/yhma-yyds-group` only                                  |
| `pnpm build:cn`        | `sites/magroup-ac-cn` only                                    |
| `pnpm typecheck`       | Root tooling plus `tsc --noEmit` in every workspace package   |
| `pnpm lint`            | ESLint across the workspace (per-file tsconfig lookup)        |
| `pnpm test`            | Vitest: schemas, collection globs, author resolution, sorting |
| `pnpm check:routes`    | Both apps declare, and both builds publish, the same routes   |
| `pnpm content:codegen` | Regenerate each site's `.source/` from the collections        |
| `pnpm typegen`         | Regenerate each site's `.source/` and `src/pages.gen.ts`      |
| `pnpm start`           | Serve a built site (`cd sites/<name> && pnpm start`)          |

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

Both flags live in each route's `getConfig` under `sites/*/src/pages/**`. Removing
`unstable_disableSSR` makes the build emit server-rendered HTML, which is what a crawler,
a link preview or a reader without JavaScript sees; keeping it means none of them see any
page content. If that trade changes, edit the route files and re-run `pnpm build`.

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

Each site's `.source/` and `src/pages.gen.ts` are generated, and both are needed before
`pnpm typecheck` can resolve front-matter types. `pnpm build` and `pnpm dev` write them,
so a fresh checkout goes `pnpm install && pnpm typegen && pnpm typecheck`. `pnpm typegen`
regenerates both without a build — run it after adding a collection or a route.
`waku router typegen` alone, without `.source/`, silently produces a `pages.gen.ts` whose
front matter is untyped, so always go through `pnpm typegen`.

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
