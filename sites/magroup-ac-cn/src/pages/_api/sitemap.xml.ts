import { source } from '@/lib/source.ts'
import { site } from '@/site.config.ts'
import { sitemapRoute } from '@yhma/site-kit/routes'

/** `sitemap.xml`, including `hreflang` alternates for translated pages. */
const route = sitemapRoute(site, source)

export const GET = route.GET
export const getConfig = route.getConfig
