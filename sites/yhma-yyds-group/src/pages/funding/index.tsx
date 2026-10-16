import { FundingsList } from '@yhma/site-kit/views'

export default function ListPage() {
  return <FundingsList />
}

export async function getConfig() {
  // Prerendered at build time, with document SSR disabled (see AGENTS.md).
  return { render: 'static', unstable_disableSSR: true } as const
}
