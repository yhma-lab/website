import { localizedParams, publications } from '@/lib/source.ts'
import { PublicationsDetail } from '@/site/pages/publications.tsx'

const LOCALE = 'en'

export default function Detail({ slugs }: { slugs: string[] }) {
  return <PublicationsDetail locale={LOCALE} slugs={slugs} />
}

/** Only this locale's entries are prerendered; an untranslated page has no path. */
export async function getConfig() {
  // Prerendered at build time, with document SSR disabled: see AGENTS.md and the
  // rendering-policy note in README.md before changing either flag.
  return {
    render: 'static',
    staticPaths: localizedParams(publications, LOCALE),
    unstable_disableSSR: true,
  } as const
}
