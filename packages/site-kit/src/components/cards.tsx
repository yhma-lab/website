import type { FundingPage } from '../content/source.ts'

import * as stylex from '@stylexjs/stylex'

import { formatDate } from '../content/format.ts'
import { MathText } from './math-text.tsx'
import { card as cardStyles, detail, shared } from './views.stylex.ts'

/**
 * Funding entry.
 *
 * Ports the project's overridden `layouts/partials/views/card.html`: an optional
 * square image beside a title, summary and date, linked through
 * `external_link` when present.
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
      <div {...stylex.props(cardStyles.row)}>
        <div {...stylex.props(cardStyles.body)}>
          <div {...stylex.props(cardStyles.title)}>{page.data.title}</div>
          {summary.length > 0 ? (
            <p {...stylex.props(cardStyles.summary)}>
              <MathText text={summary} />
            </p>
          ) : null}
          <p {...stylex.props(shared.meta)}>
            <time dateTime={page.data.date}>{formatDate(page.data.date)}</time>
          </p>
        </div>
      </div>
    </a>
  )
}

export interface DetailRowProps {
  label: string
  children: React.ReactNode
}

/** The `Abstract` / `Cite` two-column row used on a publication page. */
export function DetailRow({ children, label }: DetailRowProps) {
  return (
    <div {...stylex.props(detail.grid)}>
      <div {...stylex.props(detail.label)}>{label}</div>
      <div>{children}</div>
    </div>
  )
}
