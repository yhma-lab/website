import type { ReactNode } from 'react'

import { SiteFrame } from '@/components/site-frame.tsx'

/** Layout for the Chinese route group, served under `/cn`. */
export default function CnLayout({ children }: { children: ReactNode }) {
  return (
    <SiteFrame current="" prefix="/cn">
      {children}
    </SiteFrame>
  )
}

export async function getConfig() {
  // Prerendered at build time, with document SSR disabled (see AGENTS.md).
  return { render: 'static', unstable_disableSSR: true } as const
}
