import * as stylex from '@stylexjs/stylex'
import type { MDXComponents } from 'mdx/types'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'

import { prose } from './prose.stylex.ts'

import type { StyleXStyles } from '@stylexjs/stylex'

/**
 * MDX element mapping.
 *
 * `@tailwindcss/typography` styled long-form content through descendant
 * selectors hanging off a `.prose` root. StyleX has no descendant-selector
 * condition, so the values from `src/components/prose.stylex.ts` are attached to
 * each element here instead. Every element keeps its semantic tag, which is also
 * what the previous markup emitted.
 */

type ElementProps<Tag extends keyof React.JSX.IntrinsicElements> = Omit<
  ComponentPropsWithoutRef<Tag>,
  'className' | 'style'
>

function styled<Tag extends keyof React.JSX.IntrinsicElements>(
  tag: Tag,
  style: StyleXStyles,
  extra?: Record<string, unknown>,
) {
  const Element = tag
  const Comp = ({ children, ...props }: ElementProps<Tag> & { children?: ReactNode }) => (
    // @ts-expect-error -- `Element` is a dynamic intrinsic tag.
    <Element {...extra} {...props} {...stylex.props(style)}>
      {children}
    </Element>
  )
  Comp.displayName = `Mdx.${tag}`
  return Comp
}

/** External links open in a new tab; the original templates did the same. */
function Anchor({ children, href, ...props }: ElementProps<'a'>) {
  const external = typeof href === 'string' && /^https?:/i.test(href)
  return (
    <a
      {...props}
      href={href}
      {...(external ? { rel: 'noopener noreferrer', target: '_blank' } : {})}
      {...stylex.props(prose.a)}
    >
      {children}
    </a>
  )
}

export function getMdxComponents(overrides?: MDXComponents): MDXComponents {
  return {
    a: Anchor,
    blockquote: styled('blockquote', prose.blockquote),
    code: styled('code', prose.code),
    h1: styled('h1', prose.h1),
    h2: styled('h2', prose.h2),
    h3: styled('h3', prose.h3),
    h4: styled('h4', prose.h4),
    hr: styled('hr', prose.hr),
    img: styled('img', prose.img, { loading: 'lazy' }),
    li: styled('li', prose.li),
    ol: styled('ol', prose.ol),
    p: styled('p', prose.p),
    strong: styled('strong', prose.strong),
    table: styled('table', prose.table),
    td: styled('td', prose.td),
    th: styled('th', prose.th),
    ul: styled('ul', prose.ul),
    ...overrides,
  }
}
