import { unstable_notFound } from 'waku/router/server'

import { siteContext } from '../../site-context.ts'
import { LandingPage } from '../landing.tsx'

/**
 * A standalone page from the `pages` collection, e.g. `/privacy/` or `/terms/`.
 *
 * Ports the previous `[...slugs]` route file: the home, listing and archive
 * routes are entries of their own in the shared table, and this is what renders
 * everything else that collection publishes. A page the source does not know
 * about is a 404 rather than an empty document, so a translation that never got
 * imported fails the build instead of publishing a blank page.
 */
export function StandalonePage({ slugs = [] }: { slugs?: string[] }) {
  const { source } = siteContext()
  if (!source.findPage(slugs)) unstable_notFound()
  return <LandingPage slugs={slugs} />
}
