import type { ReactNode } from 'react'
import type { SiteConfig } from '../site/types.ts'

import { HB_DARK } from '../styles/tokens.stylex.ts'
import {
  navigationBootstrap,
  THEME_DEFAULT,
  themeBootstrap,
} from './bootstrap.ts'

import 'katex/dist/katex.min.css'
import '../styles/global.css'

export interface RootShellProps {
  children: ReactNode
  site: SiteConfig
}

/**
 * Document shell.
 *
 * Per-site values (`lang`, title) come from the site config; the scripts that
 * have to run before hydration are in `./bootstrap.ts`.
 */
export function RootShell({ children, site }: RootShellProps) {
  return (
    <html data-theme-default={THEME_DEFAULT} lang={site.languageCode}>
      <head>
        <meta charSet="utf-8" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <meta content={HB_DARK} name="theme-color" />
        <meta content={site.description} name="description" />
        <title>{site.title}</title>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
        <script dangerouslySetInnerHTML={{ __html: navigationBootstrap }} />
      </head>
      <body>{children}</body>
    </html>
  )
}
