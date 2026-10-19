import type { ReactNode } from 'react'
import type { SiteConfig } from '../site/types.ts'

import * as stylex from '@stylexjs/stylex'

import { HB_DARK, themeMarker } from '../styles/tokens.stylex.ts'
import { THEME_DEFAULT } from './bootstrap.ts'

import 'katex/dist/katex.min.css'
import '../styles/global.css'

/**
 * The favicon repeats the wordmark: an ink tile with the cycle loop in paper and
 * the state point in the dark-mode accent. Inlined as a data URI because the
 * shared `public/` tree is deployment-managed and a favicon must not depend on a
 * build step to appear.
 */
const FAVICON = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#171b1e"/><rect x="5.5" y="8.5" width="21" height="17" rx="2.5" fill="none" stroke="#f4f5f3" stroke-width="2"/><path d="M9 22 24 10.5" stroke="#f4f5f3" stroke-width="2" stroke-linecap="round"/><circle cx="24" cy="10.5" r="2.75" fill="#82a6ff"/></svg>',
)}`

export interface RootShellProps {
  children: ReactNode
  site: SiteConfig
}

/**
 * Document shell.
 *
 * Per-site values (`lang`, title) come from the site config. Waku's actual
 * fallback HTML runs `./bootstrap.ts`; inline scripts mounted through RSC would
 * be inert. The browser chrome colour is declared for both scheme preferences so
 * the title bar matches the page before the bootstrap resolves the stored theme.
 */
export function RootShell({ children, site }: RootShellProps) {
  return (
    <html
      data-theme-default={THEME_DEFAULT}
      lang={site.languageCode}
      {...stylex.props(themeMarker)}
    >
      <head>
        <meta charSet="utf-8" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <meta content="light dark" name="color-scheme" />
        <meta
          content="#f4f5f3"
          media="(prefers-color-scheme: light)"
          name="theme-color"
        />
        <meta
          content={HB_DARK}
          media="(prefers-color-scheme: dark)"
          name="theme-color"
        />
        <meta content={site.description} name="description" />
        <link href={FAVICON} rel="icon" type="image/svg+xml" />
        <title>{site.title}</title>
      </head>
      <body>{children}</body>
    </html>
  )
}
