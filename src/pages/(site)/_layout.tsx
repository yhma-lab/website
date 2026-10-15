import type { ReactNode } from 'react'

import { SiteFrame } from '@/components/site-frame.tsx'

/**
 * Layout for the English route group.
 *
 * `hideLocale: 'default-locale'` keeps English at the site root, so the prefix is
 * empty here and `'/cn'` in the sibling `(cn)` group.
 */
export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <SiteFrame current="" prefix="">
      {children}
    </SiteFrame>
  )
}

export async function getConfig() {
  // Prerendered at build time, with document SSR disabled (see AGENTS.md).
  return { render: 'static', unstable_disableSSR: true } as const
}
