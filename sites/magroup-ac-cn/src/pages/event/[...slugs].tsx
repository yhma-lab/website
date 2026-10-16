import { source } from '@/lib/source.ts'
import { EventsDetail } from '@yhma/site-kit/views'

export default function Detail({ slugs }: { slugs: string[] }) {
  return <EventsDetail slugs={slugs} />
}

/** Only this site's entries are prerendered; the paths come from the loader. */
export async function getConfig() {
  // Prerendered at build time, with document SSR disabled (see AGENTS.md).
  return {
    render: 'static',
    staticPaths: source.eventParams(),
    unstable_disableSSR: true,
  } as const
}
