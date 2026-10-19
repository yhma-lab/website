import type { StyleXStyles } from '@stylexjs/stylex'
import type { ComponentProps } from 'react'

import * as stylex from '@stylexjs/stylex'

import { controlStyles } from './control.stylex.ts'

export type ActionLinkProps = Omit<ComponentProps<'a'>, 'href'> & {
  href: string
  xstyle?: StyleXStyles
}

/** A server-capable action link: native navigation without a client boundary. */
export function ActionLink({
  className,
  style,
  xstyle,
  ...props
}: ActionLinkProps) {
  const generated = stylex.props(controlStyles.nativeFocusVisible, xstyle)

  return (
    <a
      {...props}
      className={[generated.className, className].filter(Boolean).join(' ')}
      style={{ ...generated.style, ...style }}
    />
  )
}
