import { source } from '@/lib/source.ts'
import { LandingPage } from '@yhma/site-kit/views'
import { unstable_notFound } from 'waku/router/server'

/**
 * Standalone pages such as `/privacy/` and `/terms/`.
 *
 * The home, listing and collection archives have their own routes; this catches
 * everything else the `pages` collection publishes.
 */
export default function Page({ slugs }: { slugs: string[] }) {
  if (!source.findPage(slugs)) unstable_notFound()
  return <LandingPage slugs={slugs} />
}

export async function getConfig() {
  // Prerendered at build time, with document SSR disabled: see AGENTS.md and the
  // rendering-policy note in README.md before changing either flag.
  return {
    render: 'static',
    staticPaths: source.standalonePageParams(),
    unstable_disableSSR: true,
  } as const
}
