import type { ReactNode } from 'react'
import type { PageSection } from '../content/schemas.ts'

import * as stylex from '@stylexjs/stylex'

import { styles as blockStyles } from '../components/block.stylex.ts'
import { BlockHeading } from '../components/block.tsx'
import { FundingCard } from '../components/cards.tsx'
import { CitationItem } from '../components/citation.tsx'
import { siteContext } from '../site-context.ts'

const styles = stylex.create({
  columns: {
    columnGap: '1rem',
    display: 'grid',
    rowGap: '1rem',
  },
  intro: {
    marginBlockEnd: '1.5rem',
    maxWidth: '65ch',
    textAlign: 'center',
  },
})

export interface CollectionProps {
  section: PageSection
  type: 'funding' | 'publication'
  /** `content.count`, where `0` means "all". */
  limit: number
  featuredOnly: boolean
  heading: string
  subtitle?: ReactNode
  text: ReactNode
}

/**
 * Collection block, porting `partials/blox/collection.html`.
 *
 * Filtering follows the authored `filters.folders` and `filters.featured_only`,
 * which is all the landing pages use; `tag`/`category`/`author` filters were
 * never authored here, so they are intentionally not implemented.
 */
export function Collection({
  featuredOnly,
  heading,
  limit,
  section,
  subtitle,
  text,
  type,
}: CollectionProps) {
  const { source } = siteContext()
  const columns = section.design.columns

  const publicationItems = featuredOnly
    ? source.sortedPublications().filter(page => page.data.featured)
    : source.sortedPublications()
  const fundingItems = source.sortedFundings()

  return (
    <>
      <BlockHeading subtitle={subtitle} title={heading} />
      {text ? <div {...stylex.props(styles.intro)}>{text}</div> : null}
      <div {...stylex.props(blockStyles.centered)}>
        <div
          style={{
            gridTemplateColumns: `repeat(${String(columns)}, minmax(0, 1fr))`,
          }}
          {...stylex.props(styles.columns)}
        >
          {type === 'funding'
            ? take(fundingItems, limit).map(page => (
                <FundingCard key={page.url} page={page} />
              ))
            : take(publicationItems, limit).map(page => (
                <CitationItem key={page.url} page={page} />
              ))}
        </div>
      </div>
    </>
  )
}

function take<T>(items: T[], limit: number): T[] {
  return Number.isFinite(limit) ? items.slice(0, limit) : items
}
