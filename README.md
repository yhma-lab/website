# BNU yhma Research Group website

- English: https://yhmayyds.group/ (`sites/yhma-yyds-group`)
- Chinese: https://magroup.ac.cn/ (`sites/magroup-ac-cn`)

Two static sites generated at build time by [Waku](https://waku.gg) from one shared
content tree (`content/`) and one shared component package (`packages/site-kit`), with
content modelled by [fumadocs-mdx](https://fumadocs.dev) and components styled with
[StyleX](https://stylexjs.com). Each site links to the other at the same page path.

```bash
pnpm install
pnpm typegen
pnpm dev        # :3000 English, :3001 Chinese
pnpm build      # both sites, each into its own dist/public
```
