import type { ReactNode } from 'react'

import * as stylex from '@stylexjs/stylex'

import { styles } from './hero.stylex.ts'
import { Icon } from './icon.tsx'
import { actionLinkStyles } from './ui/action-link.stylex.ts'
import { ActionLink } from './ui/action-link.tsx'

export interface HeroAction {
  icon?: string | undefined
  text: string
  url: string
}

export interface HeroProps {
  /** The previous design's `design.no_padding`: the home hero could sit flush. */
  noPadding?: boolean
  title: string
  text: string
  announcement?:
    | { link?: { text: string; url: string } | undefined; text: string }
    | undefined
  primaryAction?: HeroAction | undefined
  secondaryAction?: HeroAction | undefined
  /** Resolves an authored internal URL (external links and anchors pass through). */
  resolve: (url: string) => string
  /**
   * Optional subject visual rendered in the second column. The home page passes
   * the thermodynamic diagram; the block stays usable without one.
   */
  visual?: ReactNode
}

/**
 * Opening hero: the lab's title page.
 *
 * A display serif headline, a short lead, one filled action and one quiet link,
 * beside a single subject visual. `text` is authored as plain markdown
 * paragraphs; paragraph breaks are preserved by splitting on blank lines.
 *
 * The entrance is the one orchestrated animation in the system: copy rises and
 * fades once, staggered by role (see `hero.stylex.ts`).
 */
export function Hero({
  announcement,
  noPadding = false,
  primaryAction,
  resolve,
  secondaryAction,
  text,
  title,
  visual,
}: HeroProps) {
  return (
    <div {...stylex.props(styles.root, noPadding && styles.rootCompact)}>
      <div
        {...stylex.props(styles.grid, visual ? styles.gridWithVisual : null)}
      >
        <div {...stylex.props(styles.copy)}>
          {announcement ? (
            <div {...stylex.props(styles.announcement, styles.enter)}>
              <span>{announcement.text}</span>
              {announcement.link ? (
                <ActionLink
                  href={resolve(announcement.link.url)}
                  xstyle={[
                    actionLinkStyles.base,
                    actionLinkStyles.announcement,
                  ]}
                >
                  {announcement.link.text}
                  <Chevron />
                </ActionLink>
              ) : null}
            </div>
          ) : null}

          <h1 {...stylex.props(styles.title, styles.enter)}>{title}</h1>

          {text.length > 0 ? (
            <div {...stylex.props(styles.enter, styles.enterMid)}>
              {text
                .split(/\n{2,}/)
                .filter(paragraph => paragraph.trim().length > 0)
                .map((paragraph, index) => (
                  <p
                    key={paragraph}
                    {...stylex.props(
                      styles.subtitle,
                      index > 0 && styles.subtitleParagraph,
                    )}
                  >
                    {paragraph.trim()}
                  </p>
                ))}
            </div>
          ) : null}

          {primaryAction || secondaryAction ? (
            <div
              {...stylex.props(
                styles.actionRow,
                styles.enter,
                styles.enterLate,
              )}
            >
              {primaryAction ? (
                <ActionLink
                  href={resolve(primaryAction.url)}
                  xstyle={[actionLinkStyles.base, actionLinkStyles.primary]}
                >
                  {primaryAction.text}
                  {primaryAction.icon ? (
                    <Icon name={primaryAction.icon} />
                  ) : null}
                </ActionLink>
              ) : null}
              {secondaryAction ? (
                <ActionLink
                  href={resolve(secondaryAction.url)}
                  xstyle={[actionLinkStyles.base, actionLinkStyles.secondary]}
                >
                  {secondaryAction.text}
                  <Chevron />
                </ActionLink>
              ) : null}
            </div>
          ) : null}
        </div>

        {visual ? <div {...stylex.props(styles.visual)}>{visual}</div> : null}
      </div>
    </div>
  )
}

function Chevron() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="12"
      viewBox="0 0 12 12"
      width="12"
    >
      <path
        d="M2.5 6h7M6.5 3l3 3-3 3"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  )
}
