import { loader } from 'fumadocs-core/source'
import { toFumadocsSource } from 'fumadocs-mdx/runtime/server'

import {
  authorDocs,
  eventDocs,
  fundingDocs,
  pageDocs,
  publicationDocs,
} from '../../.source/server.ts'
import { i18n } from './i18n.ts'

/**
 * Content loaders.
 *
 * Every collection keeps its own `baseUrl` so `page.url` is the real route, and
 * `generateParams()` can drive Waku's `staticPaths` directly.
 *
 * `create.doc()` yields a bare entry array and has no meta documents, so it is
 * wrapped with `toFumadocsSource(entries, [])`; `create.docs()` already exposes
 * the same method for its page/meta pair.
 */

export const authors = loader({
  baseUrl: '/people',
  i18n,
  source: toFumadocsSource(authorDocs, []),
})

/**
 * `baseUrl` matches the URL the Hugo site published, not the collection
 * directory: an entry is `/publication/<slug>/` while its files live under
 * `content/publications/`.
 */
export const publications = loader({
  baseUrl: '/publication',
  i18n,
  source: toFumadocsSource(publicationDocs, []),
})

export const fundings = loader({
  baseUrl: '/funding',
  i18n,
  source: toFumadocsSource(fundingDocs, []),
})

export const events = loader({
  baseUrl: '/event',
  i18n,
  source: toFumadocsSource(eventDocs, []),
})

export const pages = loader({
  baseUrl: '',
  i18n,
  source: pageDocs.toFumadocsSource(),
})

export type AuthorPage = ReturnType<typeof authors.getPages>[number]
export type EventPage = ReturnType<typeof events.getPages>[number]
export type FundingPage = ReturnType<typeof fundings.getPages>[number]
export type PagePage = ReturnType<typeof pages.getPages>[number]
export type PublicationPage = ReturnType<typeof publications.getPages>[number]

/** Route parameters for a Waku catch-all page inside one language. */
export function localizedParams(
  source: { generateParams: () => { lang: string; slug: string[] }[] },
  locale: string,
): string[][] {
  return source
    .generateParams()
    .filter(entry => entry.lang === locale)
    .map(entry => entry.slug)
}

/**
 * Author page parameters.
 *
 * `content/authors/misc/` is a placeholder with no `title`; Hugo never published
 * a page for it (`authors/_index.md` set `build.render: never`), so it is skipped
 * here rather than rendered as an untitled profile.
 */
export function authorParams(locale: string): string[][] {
  return authors
    .getPages(locale)
    .filter(page => page.data.title.length > 0)
    .map(page => page.slugs)
}

/**
 * Slugs that have their own route file rather than the `[...slugs]` catch-all.
 *
 * `LandingPage` renders the collection blocks, but `/publications/` and
 * `/fundings/` are implemented directly in `src/site/pages/`, so the catch-all
 * must not claim them: two route files for one path is a build error.
 */
const EXPLICIT_PAGE_SLUGS = new Set(['fundings', 'publications'])

/** `[...slugs]` parameters for the standalone pages, excluding the explicit ones. */
export function standalonePageParams(locale: string): string[][] {
  return localizedParams(pages, locale).filter(slugs => {
    const first = slugs[0]
    return first !== undefined && !EXPLICIT_PAGE_SLUGS.has(first)
  })
}
