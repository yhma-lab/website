import type { ReactNode } from 'react'

import * as stylex from '@stylexjs/stylex'

import { styles } from './block.stylex.ts'

export interface BlockHeadingProps {
  title?: string | undefined
  /** Inline markdown already parsed to nodes; `**People**` appears in the hero. */
  subtitle?: ReactNode
  /**
   * The heading level the surrounding page needs. Section headings default to
   * `h2`; an archive page uses `h1` because the heading is the page title.
   */
  as?: 'h1' | 'h2'
  id?: string
}

/** The left-aligned title/lead pair rendered above a section. */
export function BlockHeading({
  as = 'h2',
  id,
  subtitle,
  title,
}: BlockHeadingProps) {
  if (!title && !subtitle) return null
  const Heading = as
  return (
    <div {...stylex.props(styles.headingWrap)}>
      {title ? (
        <Heading id={id} {...stylex.props(styles.heading)}>
          {title}
        </Heading>
      ) : null}
      {subtitle ? <p {...stylex.props(styles.lead)}>{subtitle}</p> : null}
    </div>
  )
}
