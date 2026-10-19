import * as stylex from '@stylexjs/stylex'

import { formatShortMonthYear } from '../content/format.ts'
import { awardStyles as styles } from './biography.stylex.ts'

export interface AwardEntry {
  awarder: string
  certificate_url: string
  date?: string | undefined
  icon: string
  summary: string
  title: string
  url: string
}

export interface AwardsListProps {
  /** `content.title`, defaulting to `Awards`. */
  heading: string
  awards: readonly AwardEntry[]
  /** Renders `summary` through the shared minimal markdown renderer. */
  renderSummary: (text: string) => React.ReactNode
  dateFormat: 'month' | 'year'
}

/**
 * Awards list.
 *
 * The same date-plus-reading-column rhythm as the experience timeline, so an
 * awards block placed after a résumé reads as one continuous record rather than
 * a second visual system.
 */
export function AwardsList({
  awards,
  dateFormat,
  heading,
  renderSummary,
}: AwardsListProps) {
  if (awards.length === 0) return null

  return (
    <section>
      <h2 {...stylex.props(styles.heading)}>{heading}</h2>
      {awards.map((award, index) => {
        const date =
          award.date === undefined
            ? ''
            : dateFormat === 'month'
              ? formatShortMonthYear(award.date)
              : award.date.slice(0, 4)
        return (
          <div
            key={`${award.title}-${String(index)}`}
            {...stylex.props(styles.row)}
          >
            <span {...stylex.props(styles.date)}>{date}</span>
            <div {...stylex.props(styles.body)}>
              <span {...stylex.props(styles.title)}>
                {award.url.length > 0 ? (
                  <a href={award.url} rel="noopener noreferrer" target="_blank">
                    {award.title}
                  </a>
                ) : (
                  award.title
                )}
              </span>
              {award.awarder.length > 0 ? (
                <span {...stylex.props(styles.awarder)}>{award.awarder}</span>
              ) : null}
              {award.summary.length > 0 ? (
                <p {...stylex.props(styles.summary)}>
                  {renderSummary(award.summary)}
                </p>
              ) : null}
            </div>
          </div>
        )
      })}
    </section>
  )
}
