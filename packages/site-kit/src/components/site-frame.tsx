import type { ReactNode } from 'react'

import * as stylex from '@stylexjs/stylex'

import { frameStyles } from '../styles/frame.stylex.ts'
import { themeMarker } from '../styles/tokens.stylex.ts'
import { Footer } from './footer.tsx'
import { Navbar } from './navbar.tsx'

export interface SiteFrameProps {
  children: ReactNode
}

/**
 * Page frame.
 *
 * The previous `_default/baseof.html` stacked a sticky `.page-header`, a
 * `.page-body` and a `.page-footer`; `page-wrapper` made the body a three-row
 * grid so the footer sits at the bottom of short pages. `themeMarker` is what
 * every dark-mode condition in the StyleX styles keys off.
 *
 * What the frame renders comes from the site context, so the same frame serves
 * both sites; only the app's `_layout.tsx` differs.
 */
export function SiteFrame({ children }: SiteFrameProps) {
  return (
    <div {...stylex.props(themeMarker, frameStyles.shell)}>
      <Navbar />
      <div {...stylex.props(frameStyles.body)}>{children}</div>
      <Footer />
    </div>
  )
}
