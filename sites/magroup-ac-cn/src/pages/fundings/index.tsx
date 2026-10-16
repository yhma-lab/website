import { FundingsList } from '@yhma/site-kit/views'

/** The `Fundings` landing page from `content/pages/fundings/index.mdx`. */
export default function FundingsPage() {
  return <FundingsList />
}

export async function getConfig() {
  // Prerendered at build time, with document SSR disabled (see AGENTS.md).
  return { render: 'static', unstable_disableSSR: true } as const
}
