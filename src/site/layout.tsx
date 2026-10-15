import { SiteFrame } from '@/components/site-frame.tsx'

import type { ReactNode } from 'react'

export interface LocalizedLayoutProps {
  children: ReactNode
  /** `''` for the English route group, `'/cn'` for the Chinese one. */
  prefix: string
}

/**
 * Route-group layout.
 *
 * Built from a helper so `/` and `/cn` cannot drift apart: the only difference is
 * the locale prefix, which flows into every internal link.
 *
 * Waku does not pass the request path to a layout, so the navbar cannot mark the
 * active entry from here; the previous build compared menu URLs against the page
 * permalink, which is the same information that is unavailable at this level.
 */
export function layout({ children, prefix }: LocalizedLayoutProps) {
  return (
    <SiteFrame current="" prefix={prefix}>
      {children}
    </SiteFrame>
  )
}
