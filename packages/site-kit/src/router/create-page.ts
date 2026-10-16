import type { CreatePage } from 'waku/router/server'
import type { Locale } from '../site/types.ts'
import type { CreatedPage, PageComponent } from './types.ts'

/**
 * The page object the registrar hands Waku.
 *
 * `locale` travels with it: Waku reads only the keys it knows and returns the
 * object unchanged, so the created page is also the registration record — the
 * language a route was built for is data, not a comment.
 */
export interface CreatedPageInput {
  component: PageComponent
  locale: Locale
  path: string
  render: 'static'
  staticPaths?: readonly string[] | readonly (readonly string[])[]
  unstable_disableSSR: true
}

/**
 * Waku's `createPage` is generic over a literal path and infers the component's
 * props from it; a route table entry is data, so that inference has nothing to
 * work with. This is the single place that bridges the two, and it is why the
 * pages the router returns are typed by `CreatedPage` instead: the paths an app
 * navigates by come from the table (`SharedPaths`), not from Waku's inference.
 */
export function createPageOf(
  createPage: CreatePage,
): (page: CreatedPageInput) => CreatedPage {
  return createPage as unknown as (page: CreatedPageInput) => CreatedPage
}
