import { defineCollections, defineDocs } from 'fumadocs-mdx/config'

import { schemas } from './src/lib/content-schemas.ts'

/**
 * Collections.
 *
 * The zod schemas live in `src/lib/content-schemas.ts` so tests can apply the
 * same validation to the migrated front matter. This file may only export
 * collections: `fumadocs-mdx` rejects any other export at config load time.
 */

export const authorDocs = defineCollections({
  dir: 'content/authors',
  files: ['*/index.mdx'],
  schema: schemas.authors,
  type: 'doc',
})

export const eventDocs = defineCollections({
  dir: 'content/events',
  files: ['*/index.mdx'],
  schema: schemas.events,
  type: 'doc',
})

export const fundingDocs = defineCollections({
  dir: 'content/fundings',
  files: ['*/index.mdx'],
  schema: schemas.fundings,
  type: 'doc',
})

export const publicationDocs = defineCollections({
  dir: 'content/publications',
  // Patents live one level deeper (`pat/<slug>/index.mdx`), matching the Hugo
  // content tree, so the glob is recursive.
  files: ['**/index.mdx'],
  schema: schemas.publications,
  type: 'doc',
})

/** Landing pages, listing pages and legal pages, with their section tree. */
export const pageDocs = defineDocs({
  dir: 'content/pages',
  docs: { schema: schemas.pages },
})
