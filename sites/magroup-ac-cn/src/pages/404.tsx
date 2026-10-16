import { NotFound } from '@yhma/site-kit/shell'

import '@/lib/site-context.ts'

/**
 * Not-found page.
 *
 * Waku writes it to `404.html` at the output root, which is the file Cloudflare
 * Pages serves for unmatched paths. The frame comes from the root layout.
 */
export default function NotFoundPage() {
  return <NotFound />
}

export async function getConfig() {
  // Prerendered at build time, with document SSR disabled (see AGENTS.md).
  return { render: 'static', unstable_disableSSR: true } as const
}
