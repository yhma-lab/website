import { PeopleList } from '@/site/pages/people.tsx'

const LOCALE = 'cn'

export default function ListPage() {
  return <PeopleList locale={LOCALE} />
}

export async function getConfig() {
  // Prerendered at build time, with document SSR disabled (see AGENTS.md).
  return { render: 'static', unstable_disableSSR: true } as const
}
