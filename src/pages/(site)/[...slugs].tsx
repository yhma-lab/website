import { pages, standalonePageParams } from '@/lib/source.ts'
import { LandingPage } from '@/site/landing.tsx'
import { unstable_notFound } from 'waku/router/server'

const LOCALE = 'en'

/**
 * Standalone pages such as `/privacy/` and `/terms/`.
 *
 * The home, listing and collection archives have their own routes; this catches
 * everything else the `pages` collection publishes. `localizedParams` supplies the
 * concrete paths, so a page that is not in the collection cannot be reached.
 */
export default function Page({ slugs }: { slugs: string[] }) {
  const exists = pages
    .getPages(LOCALE)
    .some(page => sameSlugs(page.slugs, slugs))
  if (!exists) unstable_notFound()
  return <LandingPage prefix="" slugs={slugs} />
}

function sameSlugs(a: string[], b: string[]): boolean {
  return (
    a.length === b.length && a.every((segment, index) => segment === b[index])
  )
}

export async function getConfig() {
  // Prerendered at build time, with document SSR disabled: see AGENTS.md and the
  // rendering-policy note in README.md before changing either flag.
  return {
    render: 'static',
    staticPaths: standalonePageParams(LOCALE),
    unstable_disableSSR: true,
  } as const
}
