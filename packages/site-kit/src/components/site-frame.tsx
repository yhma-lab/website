import type { ReactNode } from 'react'

import * as stylex from '@stylexjs/stylex'

import { translate } from '../content/strings.ts'
import { siteContext } from '../site-context.ts'
import { frameStyles } from '../styles/frame.stylex.ts'
import { Footer } from './footer.tsx'
import { Navbar } from './navbar.tsx'

export interface SiteFrameProps {
  children: ReactNode
}

/**
 * Page frame.
 *
 * The document's `<html>` owns the StyleX theme marker and `data-theme` for all
 * descendants. Everything the frame renders comes from the site context, so the
 * same frame serves both sites; only the app's route wiring differs.
 *
 * The skip link is the first focusable element and targets `<main>`, which is
 * programmatically focusable so the jump actually moves the reading position.
 */
export function SiteFrame({ children }: SiteFrameProps) {
  const { locale } = siteContext()
  const t = translate(locale)

  return (
    <div {...stylex.props(frameStyles.shell)}>
      <a href="#main" {...stylex.props(frameStyles.skipLink)}>
        {t.skipToContent}
      </a>
      <Navbar />
      <main id="main" tabIndex={-1} {...stylex.props(frameStyles.main)}>
        <div {...stylex.props(frameStyles.body)}>{children}</div>
      </main>
      <Footer />
    </div>
  )
}
