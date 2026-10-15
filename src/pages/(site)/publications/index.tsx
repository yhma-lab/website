import { PublicationsList } from '@/site/pages/publications.tsx'

/** The `Publications` landing page from `content/publications.md`. */
export default function PublicationsPage() {
  return <PublicationsList locale="en" />
}

export async function getConfig() {
  // Prerendered at build time, with document SSR disabled (see AGENTS.md).
  return { render: 'static', unstable_disableSSR: true } as const
}
