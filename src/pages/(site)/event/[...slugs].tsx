import { EventsDetail } from '@/site/pages/events.tsx'
import { localizedParams } from '@/lib/source.ts'
import { events } from '@/lib/source.ts'

const LOCALE = 'en'

export default function Detail({ slugs }: { slugs: string[] }) {
  return <EventsDetail locale={LOCALE} slugs={slugs} />
}

/** Only this locale's entries are prerendered; an untranslated page has no path. */
export async function getConfig() {
  // Prerendered at build time, with document SSR disabled (see AGENTS.md).
  return { render: 'static', staticPaths: localizedParams(events, LOCALE), unstable_disableSSR: true } as const
}
