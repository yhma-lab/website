import type { Page, PageData } from 'fumadocs-core/source'
import type {
  DocCollectionEntry,
  DocsCollectionEntry,
} from 'fumadocs-mdx/runtime/server'
import type { DocData } from 'fumadocs-mdx/runtime/types'
import type { z } from 'zod'
import type { Locale, SiteConfig } from '../site/types.ts'
import type { ResolvedAuthor } from './authors.ts'
// `schemas` is only read for its inferred types here; the collection definitions
// that consume it at runtime live in `collections.ts`.
import type { PageFrontmatter, schemas } from './schemas.ts'

import { loader } from 'fumadocs-core/source'
import { toFumadocsSource } from 'fumadocs-mdx/runtime/server'

import { authorProfiles, resolveAuthors } from './authors.ts'
import { createSiteI18n } from './i18n.ts'
import {
  byDateDesc,
  findBySlugs,
  peopleByGroup as groupPeople,
  peopleGroups,
} from './sort.ts'

/**
 * The content pipeline for one site.
 *
 * This is the seam between the two apps and the shared kit: an app owns the
 * generated collections (`<app>/.source/server.ts`, produced by fumadocs-mdx
 * from the shared content tree) and its site identity, and gets back a single
 * object whose accessors are already bound to that site's language. Everything
 * else — the loaders, URL shapes, the translation fallback, the Chinese
 * front-matter overlay — stays behind this interface.
 */

export type AuthorData = z.infer<typeof schemas.authors>
export type EventData = z.infer<typeof schemas.events>
export type FundingData = z.infer<typeof schemas.fundings>
export type PublicationData = z.infer<typeof schemas.publications>

/**
 * A loaded content page, as the fumadocs loader returns it: the validated front
 * matter plus the compiled MDX body and TOC that only exist at runtime.
 */
export type StoredPage<Data extends PageData> = Page<
  string | undefined,
  Data & DocData
>
export type AuthorPage = StoredPage<AuthorData>
export type EventPage = StoredPage<EventData>
export type FundingPage = StoredPage<FundingData>
export type PagePage = StoredPage<PageFrontmatter>
export type PublicationPage = StoredPage<PublicationData>

/** Every supported page per language. */
export type AnyPage =
  AuthorPage | EventPage | FundingPage | PagePage | PublicationPage

/**
 * The generated collections an app hands to {@link createSource}.
 *
 * The app's `source.config.ts` re-exports the shared collection definitions, so
 * these entries carry the shared schemas' data types.
 */
export interface ContentInput {
  authorDocs: DocCollectionEntry<string, AuthorData>[]
  eventDocs: DocCollectionEntry<string, EventData>[]
  fundingDocs: DocCollectionEntry<string, FundingData>[]
  pageDocs: Pick<
    DocsCollectionEntry<string, PageFrontmatter>,
    'toFumadocsSource'
  >
  publicationDocs: DocCollectionEntry<string, PublicationData>[]
}

export interface ContentSource {
  /** The language this source is bound to. */
  locale: Locale
  allAuthors(): AuthorPage[]
  allEvents(): EventPage[]
  allFundings(): FundingPage[]
  allPages(): PagePage[]
  allPublications(): PublicationPage[]
  findAuthor(slugs: string[]): AuthorPage | undefined
  findEvent(slugs: string[]): EventPage | undefined
  findFunding(slugs: string[]): FundingPage | undefined
  findPage(slugs: string[]): PagePage | undefined
  findPublication(slugs: string[]): PublicationPage | undefined
  sortedEvents(): EventPage[]
  sortedFundings(): FundingPage[]
  sortedPublications(): PublicationPage[]
  featuredPublications(): PublicationPage[]
  peopleGroups(): string[]
  peopleByGroup(groups?: readonly string[]): {
    group: string
    people: AuthorPage[]
  }[]
  resolveAuthors(
    ids: readonly string[],
    notes?: readonly string[],
  ): ResolvedAuthor[]
  authorParams(): string[][]
  eventParams(): string[][]
  fundingParams(): string[][]
  /**
   * Params for the standalone pages: every entry of the `pages` collection
   * except the site root, which the `/` route renders itself. Which of these
   * the catch-all actually publishes is the router's business — it drops the
   * paths another route has already claimed.
   */
  pageParams(): string[][]
  publicationParams(): string[][]
  /** Whether the `cn` storage holds a real `index.cn.mdx` for this URL. */
  hasTranslation(url: string): boolean
}

/** The locale that holds the translations; the `en` storage is the source language. */
const TRANSLATION_LOCALE = 'cn' as const

/**
 * Route parameters for a Waku catch-all page inside one language.
 *
 * `generateParams()` lists every language in the loader's i18n config, so the
 * site's own language is filtered out here; on the Chinese site the inherited
 * English entries are already part of the `cn` storage, which is what keeps the
 * two sites' route sets identical.
 */
function paramsFor(
  source: { generateParams: () => { lang: string; slug: string[] }[] },
  locale: Locale,
): string[][] {
  return source
    .generateParams()
    .filter(entry => entry.lang === locale)
    .map(entry => entry.slug)
}

function text(value: unknown): string | undefined {
  return typeof value === 'string' && value.length > 0 ? value : undefined
}

/**
 * Prefer the authored Chinese fields when a page has no translated body.
 *
 * Entries that already have `index.cn.mdx` bring their own title and abstract;
 * for the rest the front matter carries translations (`title_zh`,
 * `abstract_zh`) that the Chinese site can render instead of the English text.
 */
function withChineseFields<Data extends PageData>(
  page: Page<string | undefined, Data>,
): Page<string | undefined, Data> {
  const data = page.data as Data & {
    abstract?: string
    abstract_zh?: unknown
    title?: string
    title_zh?: unknown
  }
  const title = text(data.title_zh)
  const abstract = text(data.abstract_zh)
  if (title === undefined && abstract === undefined) return page

  // The overlay only replaces two already-optional string fields, so the result
  // still satisfies the schema's data type.
  const overlaid = {
    ...data,
    ...(title === undefined ? {} : { title }),
    ...(abstract === undefined ? {} : { abstract }),
  } as Data

  return { ...page, data: overlaid }
}

export function createSource(
  input: ContentInput,
  site: Pick<SiteConfig, 'locale'>,
): ContentSource {
  const locale = site.locale
  const i18n = createSiteI18n(locale)

  const authors = loader({
    baseUrl: '/people',
    i18n,
    source: toFumadocsSource(input.authorDocs, []),
  })
  /**
   * `baseUrl` matches the URL the previous site published, not the collection
   * directory: an entry is `/publication/<slug>/` while its files live under
   * `content/publications/`.
   */
  const publications = loader({
    baseUrl: '/publication',
    i18n,
    source: toFumadocsSource(input.publicationDocs, []),
  })
  const fundings = loader({
    baseUrl: '/funding',
    i18n,
    source: toFumadocsSource(input.fundingDocs, []),
  })
  const events = loader({
    baseUrl: '/event',
    i18n,
    source: toFumadocsSource(input.eventDocs, []),
  })
  const pages = loader({
    baseUrl: '',
    i18n,
    source: input.pageDocs.toFumadocsSource(),
  })

  const chinese = locale === TRANSLATION_LOCALE
  /**
   * `content/authors/misc/` is a placeholder with no `title`; the previous site
   * never published a page for it, so it is skipped rather than rendered as an
   * untitled profile.
   */
  const authorPages: AuthorPage[] = authors
    .getPages(locale)
    .filter(page => page.data.title.length > 0)
  const eventPages: EventPage[] = events.getPages(locale)
  const fundingPages: FundingPage[] = fundings.getPages(locale)
  const pagePages: PagePage[] = pages.getPages(locale)
  const publicationPages: PublicationPage[] = publications.getPages(locale)

  const localizedPublications = chinese
    ? publicationPages.map(withChineseFields)
    : publicationPages
  const localizedFundings = chinese
    ? fundingPages.map(withChineseFields)
    : fundingPages

  const profiles = authorProfiles(authorPages)

  /** URLs that have a real `index.cn.mdx`, for `hreflang` alternates. */
  const translatedUrls = new Set<string>()
  for (const source of [authors, events, fundings, pages, publications]) {
    for (const page of source.getPages(TRANSLATION_LOCALE)) {
      if (page.absolutePath?.endsWith(`.${TRANSLATION_LOCALE}.mdx`) === true) {
        translatedUrls.add(page.url)
      }
    }
  }

  return {
    locale,
    allAuthors: () => authorPages,
    allEvents: () => eventPages,
    allFundings: () => localizedFundings,
    allPages: () => pagePages,
    allPublications: () => localizedPublications,
    authorParams: () => authorPages.map(page => page.slugs),
    eventParams: () => paramsFor(events, locale),
    featuredPublications: () =>
      byDateDesc(localizedPublications).filter(page => page.data.featured),
    findAuthor: slugs => findBySlugs(authorPages, slugs),
    findEvent: slugs => findBySlugs(eventPages, slugs),
    findFunding: slugs => findBySlugs(localizedFundings, slugs),
    findPage: slugs => findBySlugs(pagePages, slugs),
    findPublication: slugs => findBySlugs(localizedPublications, slugs),
    fundingParams: () => paramsFor(fundings, locale),
    hasTranslation: url => translatedUrls.has(url),
    /** The site root is `[]`, and it is the `/` route's page, not a standalone one. */
    pageParams: () =>
      paramsFor(pages, locale).filter(slugs => slugs.length > 0),
    peopleByGroup: (groups?: readonly string[]) =>
      groupPeople(authorPages, groups),
    peopleGroups,
    publicationParams: () => paramsFor(publications, locale),
    resolveAuthors: (ids, notes = []) => resolveAuthors(profiles, ids, notes),
    sortedEvents: () => byDateDesc(eventPages),
    sortedFundings: () => byDateDesc(localizedFundings),
    sortedPublications: () => byDateDesc(localizedPublications),
  } satisfies ContentSource
}
