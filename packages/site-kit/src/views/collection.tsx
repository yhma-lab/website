import type { ReactNode } from 'react'

import * as stylex from '@stylexjs/stylex'

import { styles as blockStyles } from '../components/block.stylex.ts'
import { BlockHeading } from '../components/block.tsx'
import { FundingCard } from '../components/cards.tsx'
import { PublicationList } from '../components/citation.tsx'
import { card as cardStyles } from '../components/views.stylex.ts'
import { siteContext } from '../site-context.ts'

const styles = stylex.create({
  intro: {
    marginBlockEnd: 'clamp(1.5rem, 3vw, 2.25rem)',
    maxWidth: '58ch',
  },
})

export interface CollectionProps {
  type: 'funding' | 'publication'
  /** `content.count`, where `0` means "all". */
  limit: number
  featuredOnly: boolean
  heading: string
  subtitle?: ReactNode
  text?: ReactNode
}

/**
 * Collection block.
 *
 * Publications render as the shared year-grouped index; fundings render as the
 * system's one card grid. `design.columns` is no longer honoured: the index has
 * its own measure and the funding grid its own breakpoints, so a page cannot
 * squeeze either into an unreadable column count.
 */
export function Collection({
  featuredOnly,
  heading,
  limit,
  subtitle,
  text,
  type,
}: CollectionProps) {
  const { source } = siteContext()

  const publicationItems = featuredOnly
    ? source.sortedPublications().filter(page => page.data.featured)
    : source.sortedPublications()
  const fundingItems = source.sortedFundings()

  return (
    <div {...stylex.props(blockStyles.column)}>
      <div {...stylex.props(blockStyles.measure)}>
        <BlockHeading subtitle={subtitle} title={heading} />
        {text ? <div {...stylex.props(styles.intro)}>{text}</div> : null}
        {type === 'funding' ? (
          <div {...stylex.props(cardStyles.grid)}>
            {take(fundingItems, limit).map(page => (
              <FundingCard key={page.url} page={page} />
            ))}
          </div>
        ) : (
          <PublicationList items={take(publicationItems, limit)} yearAs="h3" />
        )}
      </div>
    </div>
  )
}

function take<T>(items: T[], limit: number): T[] {
  return Number.isFinite(limit) ? items.slice(0, limit) : items
}
