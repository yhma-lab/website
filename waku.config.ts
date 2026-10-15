import type { PluginOption } from 'vite'

import stylex from '@stylexjs/unplugin'
import { fumadocsMdx } from 'fumadocs-mdx/vite'
import rehypeKatex from 'rehype-katex'
import remarkMath from 'remark-math'
import { defineConfig } from 'waku/config'

/**
 * Front matter carries LaTeX (`$\phi^{4}$`), which the old Hugo build rendered
 * with KaTeX at build time. Fumadocs compiles the same way: `remark-math` turns
 * `$...$` into math nodes and `rehype-katex` renders them to static HTML, so no
 * runtime math renderer is shipped.
 */
const mdxOptions = {
  rehypePlugins: [rehypeKatex],
  remarkPlugins: [remarkMath],
}

/**
 * `@stylexjs/unplugin`'s Vite entry is typed as `any`, so the array is annotated
 * explicitly to keep the surrounding config type-checked.
 */
const stylexPlugin: PluginOption = stylex.vite() as PluginOption

export default defineConfig({
  vite: {
    plugins: [
      // StyleX must compile in every environment (client, ssr, rsc) so that
      // server components can call `stylex.props()` without a client boundary.
      stylexPlugin,
      // The macro API is enabled so `defineDocs`/`defineCollections` calls in
      // `source.config.ts` are statically evaluated instead of run at runtime.
      fumadocsMdx({ globalOptions: { mdxOptions }, macro: {} }),
    ],
    resolve: {
      dedupe: ['waku'],
      tsconfigPaths: true,
    },
  },
})
