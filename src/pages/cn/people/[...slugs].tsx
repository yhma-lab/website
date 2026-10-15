import { authorParams } from '@/lib/source.ts'
import { PeopleDetail } from '@/site/pages/people.tsx'

const LOCALE = 'cn'

export default function Detail({ slugs }: { slugs: string[] }) {
  return <PeopleDetail locale={LOCALE} slugs={slugs} />
}

/** Only translated profiles exist under `/cn`; English ones have no path here. */
export async function getConfig() {
  // Prerendered at build time, with document SSR disabled (see AGENTS.md).
  return {
    render: 'static',
    staticPaths: authorParams(LOCALE),
    unstable_disableSSR: true,
  } as const
}
