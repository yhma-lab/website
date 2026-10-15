import * as stylex from '@stylexjs/stylex'

import { formatMonthYear } from '../lib/format.ts'

import { awardStyles as styles } from './biography.stylex.ts'
import { Icon } from './icon.tsx'


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
 * Awards block, porting `partials/blox/resume-awards.html`.
 *
 * The previous markup used `flex pt-12 pb-4` rows with the award icon in a
 * `place-self-center` column and the date under the awarder.
 */
export function AwardsList({ awards, dateFormat, heading, renderSummary }: AwardsListProps) {
  if (awards.length === 0) return null

  return (
    <div>
      <h2 {...stylex.props(styles.heading)}>{heading}</h2>
      {awards.map((award, index) => (
        <div key={`${award.title}-${String(index)}`} {...stylex.props(styles.row)}>
          <div {...stylex.props(styles.iconColumn)}>
            <Icon name={award.icon.length > 0 ? award.icon : 'trophy'} size="large" />
            {award.awarder.length > 0 ? <div {...stylex.props(styles.awarder)}>{award.awarder}</div> : null}
            {award.date ? (
              <div {...stylex.props(styles.date)}>
                {dateFormat === 'month' ? formatMonthYear(award.date) : award.date.slice(0, 4)}
              </div>
            ) : null}
          </div>
          <div {...stylex.props(styles.body)}>
            {award.url.length > 0 ? (
              <a href={award.url} rel="noopener noreferrer" target="_blank">
                {award.title}
              </a>
            ) : (
              <span>{award.title}</span>
            )}
            {award.summary.length > 0 ? <p {...stylex.props(styles.summary)}>{renderSummary(award.summary)}</p> : null}
          </div>
        </div>
      ))}
    </div>
  )
}
