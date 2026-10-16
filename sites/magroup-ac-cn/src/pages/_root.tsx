import type { ReactNode } from 'react'

import { context } from '@/lib/site-context.ts'
import { RootShell } from '@yhma/site-kit/shell'

/** Document shell; the markup is shared, the language and title are not. */
export default function RootElement({ children }: { children: ReactNode }) {
  return <RootShell site={context.site}>{children}</RootShell>
}

export async function getConfig() {
  // Prerendered at build time, with document SSR disabled (see AGENTS.md).
  return { render: 'static', unstable_disableSSR: true } as const
}
