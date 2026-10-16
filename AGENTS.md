# Website for BNU yhma Research Group

学术小组的主页：两个独立站点 + 一个共享包。

| 站点   | 目录                     | 语言 | Origin                 |
| ------ | ------------------------ | ---- | ---------------------- |
| 英文站 | `sites/yhma-yyds-group/` | `en` | https://yhmayyds.group |
| 中文站 | `sites/magroup-ac-cn/`   | `cn` | https://magroup.ac.cn  |

## Stack

- pnpm 12+ workspaces (`packages/*`, `sites/*`)
- TypeScript
- React 19
- Waku for SSG (`render: 'static'` everywhere; output in each site's `dist/public`)
- fumadocs-mdx for Content Management (collections + zod front-matter schemas)
- StyleX for styling React components

## Quick start

Requires Node.js 26+ and pnpm 11+.

```bash
pnpm install
pnpm dev          # both dev servers: :3000 English, :3001 Chinese
pnpm typegen      # .source/ + src/pages.gen.ts per site
pnpm typecheck
pnpm lint
pnpm test
pnpm format
```

Read [development guide](./docs-dev/README.md) for more information.

## Conventions

- **Routes are thin.** `sites/*/src/pages/**` only wires `getConfig` and delegates to a
  view in `packages/site-kit/src/views/`; the two apps' route trees are identical, so
  `pnpm check:routes` can compare them.
- **The apps differ only in configuration.** Each site has one `src/site.config.ts`
  (identity: origin, locale, menu language, the paired site) and one `src/lib/source.ts`
  (the generated collections handed to the kit). `src/lib/site-context.ts` defines both
  once at module load; `_root.tsx` and `_layout.tsx` import it, so every shared component
  below reads the site with `siteContext()`.
- **Content shape is a schema.** `packages/site-kit/src/content/schemas.ts` is the single
  source of truth; `packages/site-kit/src/content/collections.ts` registers the
  collections and `pnpm test` validates the front matter against the same schemas.
- **One content tree, two languages.** `content/` belongs to the repository, not to a
  site: an entry is `index.mdx` (English) plus an optional `index.cn.mdx` (Chinese), and
  the collection globs must match both names or a translation is never imported.
- **Styling is StyleX only.** No Tailwind, no handwritten CSS except
  `packages/site-kit/src/styles/global.css` (the `@font-face` and `color-scheme`) and the
  vendored KaTeX stylesheet. Two compiler constraints to respect:
  - conditional (e.g. dark-mode) values must be inline literals, because an imported
    constant binds as a StyleX value object and fails condition validation;
  - media queries must be literal `'@media (...)'` keys, for the same reason.
    See `packages/site-kit/src/styles/tokens.stylex.ts` and `README.md#styles`.
- **Generated files are not edited.** Each site generates its own `.source/` and
  `src/pages.gen.ts`; `packages/site-kit/src/components/icon-data.ts` comes from
  `scripts/generate-icon-data.mjs`.

## Rendering policy

Every route is `render: 'static'`, so each site is a pure static export: no server runtime
is needed and its `dist/public` is the publish directory. Waku does not pass the request
path to a layout, so the navbar marks the active entry from a pre-paint script in
`RootShell` instead, and the language switch derives its href the same way.
