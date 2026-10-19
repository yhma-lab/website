import type { FundingPage } from '../content/source.ts'

import * as stylex from '@stylexjs/stylex'

import { formatDate } from '../content/format.ts'
import { MathText } from './math-text.tsx'
import { card as cardStyles, detail } from './views.stylex.ts'

/**
 * Funding entry.
 *
 * A card is right here: four independent projects, each a self-contained thing.
 * The whole card is the link when an external page exists; a local funding page
 * is linked the same way. The title, summary and date are the only content the
 * schema carries.
 */
export function FundingCard({ page }: { page: FundingPage }) {
  const external = page.data.external_link.length > 0
  const href = external ? page.data.external_link : page.url
  const summary = page.data.summary

  return (
    <a
      href={href}
      {...(external ? { rel: 'noopener noreferrer', target: '_blank' } : {})}
      {...stylex.props(cardStyles.item)}
    >
      <span {...stylex.props(cardStyles.title)}>{page.data.title}</span>
      {summary.length > 0 ? (
        <p {...stylex.props(cardStyles.summary)}>
          <MathText text={summary} />
        </p>
      ) : null}
      <p {...stylex.props(cardStyles.meta)}>
        <time dateTime={page.data.date}>{formatDate(page.data.date)}</time>
      </p>
    </a>
  )
}

export interface DetailRowProps {
  label: string
  children: React.ReactNode
}

/** A labeled reading row (`Abstract`, `Cite`, `Summary`) on a detail page. */
export function DetailRow({ children, label }: DetailRowProps) {
  return (
    <div {...stylex.props(detail.grid)}>
      <div {...stylex.props(detail.label)}>{label}</div>
      <div {...stylex.props(detail.body)}>{children}</div>
    </div>
  )
}
