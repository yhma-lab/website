import type { ExperienceEntry } from './bio-text.ts'

import * as stylex from '@stylexjs/stylex'

import { renderInlineMarkdown } from '../content/inline-markdown.tsx'
import { entrySubtitle, entryTitle, entryYears } from './bio-text.ts'
import { styles } from './biography.stylex.ts'
import { Icon } from './icon.tsx'

export interface ExperienceListProps {
  /** `i18n "experience"` / `i18n "education"`. */
  heading: string
  icon: string
  entries: readonly ExperienceEntry[]
  /** Localized `Present`, used when an entry has no end date. */
  presentLabel: string
}

/**
 * Résumé timeline, porting `partials/blox/resume-experience.html`.
 *
 * The original drew a bordered `<ol>` with an absolutely positioned icon dot per
 * entry and a `date_start – date_end` line, falling back to `Present`.
 */
export function ExperienceList({
  entries,
  heading,
  icon,
  presentLabel,
}: ExperienceListProps) {
  if (entries.length === 0) return null

  return (
    <div>
      <h3 {...stylex.props(styles.sectionHeading)}>{heading}</h3>
      <ol {...stylex.props(styles.timeline)}>
        {entries.map((entry, index) => {
          const years = entryYears(entry)
          return (
            <li
              key={`${entryTitle(entry)}-${String(index)}`}
              {...stylex.props(styles.timelineEntry)}
            >
              <span {...stylex.props(styles.timelineDot)}>
                <Icon name={icon} />
              </span>
              <h3 {...stylex.props(styles.timelineTitle)}>
                {entryTitle(entry)}
              </h3>
              {entrySubtitle(entry).length > 0 ? (
                <span {...stylex.props(styles.timelineOrg, styles.muted)}>
                  {entrySubtitle(entry)}
                </span>
              ) : null}
              <time {...stylex.props(styles.timelineTime, styles.muted)}>
                {formatRange(years, presentLabel)}
              </time>
              {entry.summary ? (
                <div {...stylex.props(styles.timelineSummary, styles.muted)}>
                  {renderInlineMarkdown(entry.summary)}
                </div>
              ) : null}
            </li>
          )
        })}
      </ol>
    </div>
  )
}

function formatRange(years: string[], presentLabel: string): string {
  const [start, end] = years
  if (start === undefined) return ''
  if (end === undefined) return `${start} – ${presentLabel}`
  return `${start} – ${end}`
}
