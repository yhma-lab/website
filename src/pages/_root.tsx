import type { ReactNode } from 'react'

import { HB_DARK } from '@/styles/tokens.stylex.ts'

import 'katex/dist/katex.min.css'

import '../styles/global.css'

/** Applied to `<html>` by the theme bootstrap when no stored preference exists. */
const THEME_DEFAULT = 'system'

const themeBootstrap = `(function(){try{
var s=localStorage.getItem('theme');
var d=window.matchMedia('(prefers-color-scheme: dark)').matches;
document.documentElement.dataset['theme']=s==='dark'||s==='light'?s:(d?'dark':'light');
}catch(e){}})()`

export default function RootElement({ children }: { children: ReactNode }) {
  return (
    <html data-theme-default={THEME_DEFAULT} lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <meta content={HB_DARK} name="theme-color" />
        <title>yhma lab</title>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
      </head>
      <body>{children}</body>
    </html>
  )
}

export async function getConfig() {
  // Prerendered at build time, with document SSR disabled (see AGENTS.md).
  return { render: 'static', unstable_disableSSR: true } as const
}
