import type { ReactNode } from 'react'

import * as stylex from '@stylexjs/stylex'

import { styles } from './block.stylex.ts'

export interface BlockProps {
  /** `design.spacing` from the page front matter, e.g. `3rem` or `2rem`. */
  spacing: string
  children: ReactNode
}

/** `<section class="relative hbb-section" style="padding: {spacing} 0">`. */
export function Block({ children, spacing }: BlockProps) {
  return (
    <section
      style={{ padding: `${spacing} 0` }}
      {...stylex.props(styles.block)}
    >
      {children}
    </section>
  )
}

export interface BlockHeadingProps {
  title?: string | undefined
  /** Inline markdown already parsed to nodes; `**People**` appears in the hero. */
  subtitle?: ReactNode
}

/** The centered title/subtitle pair rendered above a collection. */
export function BlockHeading({ subtitle, title }: BlockHeadingProps) {
  if (!title && !subtitle) return null
  return (
    <div {...stylex.props(styles.headingWrap)}>
      {title ? <div {...stylex.props(styles.heading)}>{title}</div> : null}
      {subtitle ? <p {...stylex.props(styles.bodyText)}>{subtitle}</p> : null}
    </div>
  )
}

/** `html:not(.dark)` equivalent: the inline-markdown links inside a subtitle. */
export function Muted({ children }: { children: ReactNode }) {
  return <span {...stylex.props(styles.muted)}>{children}</span>
}
