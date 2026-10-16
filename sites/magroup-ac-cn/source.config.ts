/**
 * Collections.
 *
 * The definitions — content directory, file patterns, schemas — live in the
 * shared kit so both sites read one content tree; this file only re-exports
 * them, which is all `fumadocs-mdx` accepts a `source.config.ts` to do.
 */
export {
  authorDocs,
  eventDocs,
  fundingDocs,
  pageDocs,
  publicationDocs,
} from '@yhma/site-kit/content/collections'
