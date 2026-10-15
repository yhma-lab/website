import * as stylex from '@stylexjs/stylex'

import { styles } from './hero.stylex.ts'
import { Icon } from './icon.tsx'

export interface HeroAction {
  icon?: string | undefined
  text: string
  url: string
}

export interface HeroProps {
  /** `design.no_padding`: the hero sat flush against the navbar on the home page. */
  noPadding?: boolean
  title: string
  text: string
  announcement?:
    | { link?: { text: string; url: string } | undefined; text: string }
    | undefined
  primaryAction?: HeroAction | undefined
  secondaryAction?: HeroAction | undefined
  /** Renders an internal action URL through the locale prefix. */
  resolve: (url: string) => string
}

/**
 * Hero block, porting `layouts/partials/blox/hero.html`.
 *
 * `text` is authored as plain markdown paragraphs; the previous build ran it
 * through `RenderString`, so paragraph breaks are preserved here by splitting on
 * blank lines.
 */
export function Hero({
  announcement,
  noPadding = false,
  primaryAction,
  resolve,
  secondaryAction,
  text,
  title,
}: HeroProps) {
  return (
    <div {...stylex.props(styles.root)}>
      <div {...stylex.props(styles.inner, noPadding && styles.innerCompact)}>
        {announcement ? (
          <div {...stylex.props(styles.announcement)}>
            <span>{announcement.text}</span>
            <a
              href={announcement.link ? resolve(announcement.link.url) : '#'}
              {...stylex.props(styles.announcementLink)}
            >
              <span aria-hidden="true">
                {announcement.link?.text ?? ''}&rarr;
              </span>
            </a>
          </div>
        ) : null}

        <h1 {...stylex.props(styles.title)}>{title}</h1>

        {text.length > 0 ? (
          <div {...stylex.props(styles.subtitle)}>
            {text
              .split(/\n{2,}/)
              .filter(paragraph => paragraph.trim().length > 0)
              .map(paragraph => (
                <p key={paragraph}>{paragraph.trim()}</p>
              ))}
          </div>
        ) : null}

        {primaryAction || secondaryAction ? (
          <div {...stylex.props(styles.actionRow)}>
            {primaryAction ? (
              <a
                href={resolve(primaryAction.url)}
                {...stylex.props(styles.action, styles.primaryAction)}
              >
                {primaryAction.text}
                {primaryAction.icon ? (
                  <span {...stylex.props(styles.actionIcon)}>
                    <Icon name={primaryAction.icon} />
                  </span>
                ) : null}
              </a>
            ) : null}
            {secondaryAction ? (
              <a
                href={resolve(secondaryAction.url)}
                {...stylex.props(styles.secondaryAction)}
              >
                {secondaryAction.text} <span aria-hidden="true">→</span>
              </a>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  )
}
