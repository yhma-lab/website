import type { ReactNode } from 'react'

import * as stylex from '@stylexjs/stylex'

import { controlStyles } from './ui/control.stylex.ts'
import { shared } from './views.stylex.ts'

export interface BackLinkProps {
  href: string
  children: ReactNode
}

/**
 * The one navigation affordance a detail page needs: a way back to the archive
 * it came from. A left chevron plus the archive's own name, so the reader knows
 * where the link goes before clicking it.
 */
export function BackLink({ children, href }: BackLinkProps) {
  return (
    <a
      href={href}
      {...stylex.props(shared.back, controlStyles.nativeFocusVisible)}
    >
      <svg
        aria-hidden="true"
        fill="none"
        viewBox="0 0 12 12"
        {...stylex.props(shared.backIcon)}
      >
        <path
          d="M9.5 6h-7M5.5 3l-3 3 3 3"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
      </svg>
      {children}
    </a>
  )
}
