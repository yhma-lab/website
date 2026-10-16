import * as stylex from '@stylexjs/stylex'

import { ICONS } from './icon-data.ts'

const styles = stylex.create({
  default: {
    display: 'inline-block',
    height: '1em',
    verticalAlign: '-0.125em',
    width: '1em',
  },
  large: {
    height: '1.5rem',
    width: '1.5rem',
  },
})

export interface IconProps {
  /** Icon key from the previous build, e.g. `academicons/arxiv` or `at-symbol`. */
  name: string
  size?: 'default' | 'large'
  /** Accessible name; the icon is decorative and hidden from AT when omitted. */
  label?: string
}

/**
 * Inline icon.
 *
 * Icon keys came from Hugo data (`icon: academicons/google-scholar`), so unknown
 * keys render nothing rather than throwing: a missing icon must not break a page.
 */
export function Icon({ label, name, size = 'default' }: IconProps) {
  // Front matter names icons freely (`sparkles`, `academicons/arxiv`); an
  // unknown key renders nothing rather than breaking the page.
  const icon = ICONS[name]
  if (icon === undefined) return null

  return (
    <svg
      aria-hidden={label ? undefined : true}
      aria-label={label}
      dangerouslySetInnerHTML={{ __html: icon.body }}
      focusable="false"
      role={label ? 'img' : undefined}
      viewBox={icon.viewBox}
      {...stylex.props(styles.default, size === 'large' && styles.large)}
    />
  )
}
