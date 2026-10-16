import { createSource } from '@yhma/site-kit/content'

import {
  authorDocs,
  eventDocs,
  fundingDocs,
  pageDocs,
  publicationDocs,
} from '../../.source/server.ts'
import { site } from '../site.config.ts'

/**
 * This site's content source.
 *
 * The generated collections come from `fumadocs-mdx` (`.source/`, built from the
 * shared `content/` tree) and the kit turns them into locale-bound accessors. The
 * route files and `_layout.tsx` are the only consumers.
 */
export const source = createSource(
  { authorDocs, eventDocs, fundingDocs, pageDocs, publicationDocs },
  site,
)
