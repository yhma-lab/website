# Dev Notes

## Stack

| Concern       | Choice                                                          |
| ------------- | --------------------------------------------------------------- |
| Build         | Waku (`waku build`), static output in `dist/public`             |
| Content model | fumadocs-mdx collections with zod front-matter schemas          |
| Styling       | StyleX, design tokens lifted from the previous Tailwind build   |
| Math          | `remark-math` + `rehype-katex` at build time, plus front matter |
| Host          | Cloudflare Pages                                                |

## Layout

- `content.generated/` — the content tree, one directory per entry.
- `src/pages/` — routes. `(site)/` is the English tree at the site root, `cn/` the
  Chinese tree under `/cn`; `_api/` holds `sitemap.xml`, `robots.txt` and `index.xml`.
- `src/site/` — the page implementations the route files delegate to.
- `src/components/` — StyleX-styled components shared by those pages.
- `src/lib/` — content loaders, ordering, formatting and locale helpers.
- `src/lib/content-schemas.ts` — the zod schema per collection.
- `scripts/` — migration and verification tooling. `check-route-parity.mjs` is the
  one that still runs after the migration; the other two need the Hugo inputs restored
  from git history and say so in their headers.

## Development

Requires Node.js 26+ and pnpm 11+.

```bash
pnpm install
pnpm dev        # http://localhost:3000
```

| Command                | Purpose                                                  |
| ---------------------- | -------------------------------------------------------- |
| `pnpm dev`             | Dev server with HMR                                      |
| `pnpm build`           | Static export to `dist/public`                           |
| `pnpm start`           | Serve the built output                                   |
| `pnpm typecheck`       | `tsc --noEmit`                                           |
| `pnpm lint`            | ESLint                                                   |
| `pnpm test`            | Vitest: schemas, author resolution, ordering, formatting |
| `pnpm content:codegen` | Regenerate `.source/` from the collections               |
| `pnpm typegen`         | Regenerate `.source/` and `src/pages.gen.ts` route types |

## Rendering

Every route is `render: 'static'` **and** `unstable_disableSSR: true`, so `waku build`
writes a fallback shell per route plus the RSC payload that fills it in. Measured on this
site, that means:

|                                       | shell HTML per route      | content in the served HTML        |
| ------------------------------------- | ------------------------- | --------------------------------- |
| `unstable_disableSSR: true` (current) | ~750 B                    | no — arrives with the RSC payload |
| flag removed                          | 40–420 KB (`/` is 420 KB) | yes                               |

Both flags live in each route's `getConfig` under `src/pages/**`. Removing
`unstable_disableSSR` makes the build emit server-rendered HTML, which is what a crawler,
a link preview or a reader without JavaScript sees; keeping it means none of them see any
page content. If that trade changes, edit the route files under `src/pages/**` and re-run `pnpm build`.

## Content

Every collection is declared in `src/lib/content-schemas.ts`; the collections themselves
are registered in `source.config.ts`. An entry is a directory with an `index.mdx`
(English) and an optional `index.cn.mdx` (Chinese):

```
content.generated/
  pages/index.mdx                 -> /
  pages/publications/index.mdx    -> /publications/
  publications/<slug>/index.mdx   -> /publication/<slug>/
  authors/<slug>/index.mdx        -> /people/<slug>/
  fundings/<slug>/index.mdx       -> /funding/<slug>/
  events/<slug>/index.mdx         -> /event/<slug>/
```

Front matter is validated by the schema at build time, so a typo fails the build with the
file and the offending key. `pnpm test` runs the same validation directly.

`.source/` and `src/pages.gen.ts` are generated, and both are needed before
`pnpm typecheck` can resolve front-matter types. `pnpm build` and `pnpm dev` write them,
so a fresh checkout goes `pnpm install && pnpm build && pnpm typecheck`. `pnpm typegen`
regenerates both without a build — run it after adding a collection or a route.
`waku router typegen` alone, without `.source/`, silently produces a `pages.gen.ts` whose
front matter is untyped, so always go through `pnpm typegen`.

## Styles

Component styles live in `*.stylex.ts` modules next to the components that use them, and
`src/styles/tokens.stylex.ts` holds the colour ramps, spacing and type scales. Two StyleX
constraints are worth knowing before editing those files:

- A condition value must be an inline literal. An imported constant binds as a StyleX
  value object, so `{ default: x, [DARK]: imported }` fails validation. Dark-mode
  conditions therefore repeat `stylex.when.ancestor('[data-theme="dark"]')` per module.
- Media queries must be literal `'@media (...)'` keys, for the same reason.

`public/` holds the files copied verbatim into the build: author avatars, publication PDFs,
the Inter variable font, KaTeX fonts and the Creative Commons badge.
