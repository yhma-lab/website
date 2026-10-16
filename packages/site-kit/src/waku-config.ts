import type { UserOptions } from '@stylexjs/unplugin'
import type { Plugin, PluginOption } from 'vite'
import type { Config } from 'waku/config'

import path from 'node:path'

import babelPlugin from '@rolldown/plugin-babel'
import stylex from '@stylexjs/unplugin'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import browserslist from 'browserslist'
import { fumadocsMdx } from 'fumadocs-mdx/vite'
import { browserslistToTargets } from 'lightningcss'
import rehypeKatex from 'rehype-katex'
import remarkMath from 'remark-math'
import { defineConfig } from 'waku/config'

/**
 * Build configuration shared by the two sites.
 *
 * Waku takes its root from `process.cwd()`, so each app runs this factory with
 * its own directory as cwd and the only absolute paths here are the two shared
 * trees at the repository root: `content/` and `public/`.
 */

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

const stylexOptions: Partial<UserOptions> = {
  useCSSLayers: true,
  devMode: 'full',
  devPersistToDisk: true,
  runtimeInjection: false,
  treeshakeCompensation: true,
  // Preserve modern media features used by the component package.
  enableMediaQueryOrder: false,
  lightningcssOptions: {
    minify: process.env['NODE_ENV'] !== 'development',
    targets: browserslistToTargets(browserslist('>= 5%')),
  },
}

/** `<repo>`, one level above `sites/<name>/` and `packages/<name>/`. */
function repoRoot(): string {
  return path.resolve(process.cwd(), '../..')
}

/**
 * Watch the shared content tree.
 *
 * Vite watches the project root and any file it has already loaded, so the
 * modules in `.source/` keep working. Watching `content/` up front additionally
 * catches *new* files, which fumadocs-mdx's index-file plugin needs in order to
 * regenerate `.source/` during development.
 */
function sharedContentWatcher(): Plugin {
  return {
    configureServer(server) {
      server.watcher.add(path.join(repoRoot(), 'content'))
    },
    name: 'yhma:watch-shared-content',
  }
}

export function createWakuConfig(): Config {
  return defineConfig({
    vite: {
      plugins: [
        // StyleX must compile in every environment (client, ssr, rsc) so that
        // server components can call `stylex.props()` without a client boundary.
        stylex.vite(stylexOptions) as PluginOption,
        // The macro API is enabled so `defineDocs`/`defineCollections` calls in
        // `source.config.ts` are statically evaluated instead of run at runtime.
        fumadocsMdx({ globalOptions: { mdxOptions } }),
        babelPlugin({ presets: [reactCompilerPreset()] }),
        react(),
        sharedContentWatcher(),
      ],
      // The assets are shared by both sites; Vite copies this directory into
      // `dist/public` for each build.
      publicDir: path.join(repoRoot(), 'public'),
      resolve: { dedupe: ['waku'], tsconfigPaths: true },
      optimizeDeps: {
        include: ['@stylexjs/babel-plugin'],
      },
      server: {
        fs: {
          // The content tree and the shared assets live outside the app root.
          allow: [repoRoot()],
        },
      },
    },
  })
}
