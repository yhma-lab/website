import { source } from '@/lib/source.ts'
import { PublicationsDetail } from '@yhma/site-kit/views'

export default function Detail({ slugs }: { slugs: string[] }) {
  return <PublicationsDetail slugs={slugs} />
}

/** Only this site's entries are prerendered; the paths come from the loader. */
export async function getConfig() {
  // Prerendered at build time, with document SSR disabled (see AGENTS.md).
  return {
    render: 'static',
    staticPaths: source.publicationParams(),
    unstable_disableSSR: true,
  } as const
}
