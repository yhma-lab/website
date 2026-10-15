import * as stylex from '@stylexjs/stylex'
import type { ReactNode } from 'react'

import { Footer } from '@/components/footer.tsx'
import { Navbar } from '@/components/navbar.tsx'
import { siteHref } from '@/lib/links.ts'
import { frameStyles } from '@/styles/frame.stylex.ts'
import { themeMarker } from '@/styles/tokens.stylex.ts'

export interface SiteFrameProps {
  children: ReactNode
  /** Locale prefix: `''` for English, `'/cn'` for Chinese. */
  prefix: string
  /** Pathname without the locale prefix, used for the active nav entry. */
  current: string
}

/**
 * Page frame.
 *
 * The previous `_default/baseof.html` stacked a sticky `.page-header`, a
 * `.page-body` and a `.page-footer`; `page-wrapper` made the body a three-row
 * grid so the footer sits at the bottom of short pages. `themeMarker` is what
 * every dark-mode condition in the StyleX styles keys off.
 */
export function SiteFrame({ children, current, prefix }: SiteFrameProps) {
  const href = (link: Parameters<typeof siteHref>[1]) => siteHref(prefix, link)

  return (
    <div {...stylex.props(themeMarker, frameStyles.shell)}>
      <Navbar current={current} href={href} prefix={prefix} />
      <div {...stylex.props(frameStyles.body)}>{children}</div>
      <Footer />
    </div>
  )
}
