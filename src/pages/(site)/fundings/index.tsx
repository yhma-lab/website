import { FundingsList } from '@/site/pages/fundings.tsx'

/** The `Fundings` landing page from `content/fundings.md`. */
export default function FundingsPage() {
  return <FundingsList locale="en" />
}

export async function getConfig() {
  // Prerendered at build time, with document SSR disabled (see AGENTS.md).
  return { render: 'static', unstable_disableSSR: true } as const
}
