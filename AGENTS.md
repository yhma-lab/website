# Website for BNU yhma Research Group

学术小组的主页

## Stack

- pnpm 12+
- TypeScript
- React 19
- Waku for SSG (`render: 'static'` everywhere; output in `dist/public`)
- fumadocs-mdx for Content Management (collections + zod front-matter schemas)
- StyleX for styling React components

## Quick start

Requires Node.js 26+ and pnpm 11+.

```bash
pnpm install
pnpm dev
pnpm typecheck
pnpm lint
pnpm test
```

## Conventions

- **Routes are thin.** `src/pages/**` only wires `getConfig` and delegates to a page
  component in `src/site/`. Everything else lives under `src/components/` or `src/lib/`.
- **Content shape is a schema.** `src/lib/content-schemas.ts` is the single source of
  truth; `source.config.ts` registers the collections and `pnpm test` validates the
  migrated front matter against the same schemas.
- **Styling is StyleX only.** No Tailwind, no handwritten CSS except
  `src/styles/global.css` (the `@font-face` and `color-scheme`) and the vendored KaTeX
  stylesheet. Two compiler constraints to respect:
  - conditional (e.g. dark-mode) values must be inline literals, because an imported
    constant binds as a StyleX value object and fails condition validation;
  - media queries must be literal `'@media (...)'` keys, for the same reason.
    See `src/styles/tokens.stylex.ts` and `README.md#styles`.
- **Generated files are not edited.** `.source/` and `src/pages.gen.ts` are produced by
  fumadocs-mdx and Waku; `src/components/icon-data.ts` comes from
  `scripts/generate-icon-data.mjs`.

## Rendering policy

Every route is `render: 'static'`, so the site is a pure static export: no server runtime
is needed and `dist/public` is the publish directory. Waku does not pass the request path
to a layout, so the navbar does not mark an active entry.
