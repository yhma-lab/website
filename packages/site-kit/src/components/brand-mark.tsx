import type { StyleXStyles } from '@stylexjs/stylex'

import * as stylex from '@stylexjs/stylex'

import { theme } from '../styles/tokens.stylex.ts'

const DARK = '[data-theme="dark"]'

const styles = stylex.create({
  svg: {
    display: 'block',
    height: '100%',
    overflow: 'visible',
    width: '100%',
  },
  /**
   * The wordmark's loop is the same T–S cycle as the hero diagram, reduced to a
   * rounded rectangle with one state point inside. The point carries the accent;
   * the loop inherits the surrounding ink.
   */
  statePoint: {
    fill: {
      default: theme.accent,
      [stylex.when.ancestor(DARK)]: '#82a6ff',
    },
  },
})

export interface BrandMarkProps {
  xstyle?: StyleXStyles
}

export function BrandMark({ xstyle }: BrandMarkProps) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 22 22"
      {...stylex.props(styles.svg, xstyle)}
    >
      <rect
        fill="none"
        height="13"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.6"
        width="16"
        x="3"
        y="4.5"
      />
      <path
        d="M5.5 15.5 16.5 6.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.6"
      />
      <circle cx="16.5" cy="6.5" r="2.2" {...stylex.props(styles.statePoint)} />
    </svg>
  )
}
