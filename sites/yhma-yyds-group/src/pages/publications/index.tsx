import { PublicationsList } from '@yhma/site-kit/views'

/** The `Publications` landing page from `content/pages/publications/index.mdx`. */
export default function PublicationsPage() {
  return <PublicationsList />
}

export async function getConfig() {
  // Prerendered at build time, with document SSR disabled (see AGENTS.md).
  return { render: 'static', unstable_disableSSR: true } as const
}
