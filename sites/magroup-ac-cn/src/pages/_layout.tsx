import type { ReactNode } from 'react'

import { SiteFrame } from '@yhma/site-kit'

// Defining the site context is what lets the shared frame and pages read this
// app's identity and content; see `src/lib/site-context.ts`.
import '@/lib/site-context.ts'

/**
 * Layout for this site.
 *
 * Both apps have the same layout: everything site-specific is injected by the
 * imported context module, so the frame itself is shared.
 */
export default function SiteLayout({ children }: { children: ReactNode }) {
  return <SiteFrame>{children}</SiteFrame>
}

export async function getConfig() {
  // Prerendered at build time, with document SSR disabled (see AGENTS.md).
  return { render: 'static', unstable_disableSSR: true } as const
}
