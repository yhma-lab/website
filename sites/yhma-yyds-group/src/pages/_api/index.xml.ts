import { source } from '@/lib/source.ts'
import { site } from '@/site.config.ts'
import { feedRoute } from '@yhma/site-kit/routes'

/** RSS feed, published at the same `/index.xml` path as before. */
const route = feedRoute(site, source)

export const GET = route.GET
export const getConfig = route.getConfig
