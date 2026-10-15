import { PeopleDetail } from '@/site/pages/people.tsx'
import { authorParams } from '@/lib/source.ts'

const LOCALE = 'en'

export default function Detail({ slugs }: { slugs: string[] }) {
  return <PeopleDetail locale={LOCALE} slugs={slugs} />
}

/** Only this locale's entries are prerendered; an untranslated page has no path. */
export async function getConfig() {
  // Prerendered at build time, with document SSR disabled (see AGENTS.md).
  return { render: 'static', staticPaths: authorParams(LOCALE), unstable_disableSSR: true } as const
}
