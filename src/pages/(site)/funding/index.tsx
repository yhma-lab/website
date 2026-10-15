import { FundingsList } from '@/site/pages/fundings.tsx'

const LOCALE = 'en'

export default function ListPage() {
  return <FundingsList locale={LOCALE} />
}

export async function getConfig() {
  // Prerendered at build time, with document SSR disabled (see AGENTS.md).
  return { render: 'static', unstable_disableSSR: true } as const
}
