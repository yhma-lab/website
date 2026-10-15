import type { ReactNode } from 'react'

import { resolveInternal } from './links.ts'

/**
 * Inline markdown for the short authored fields.
 *
 * Subtitles and summaries use emphasis, links and inline code:
 * `check full list of all members in the **[People](/people/)** page`. The
 * previous build ran these through Hugo's `RenderString`; this covers the syntax
 * that actually appears, so no MDX compiler is needed to render a one-line string
 * inside a server component.
 */
export function renderInlineMarkdown(text: string, prefix: string): ReactNode {
  const parts = text
    .split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\)|`[^`]+`|_[^_]+_)/g)
    .filter(Boolean)

  return (
    <>
      {parts.map((part, index) => {
        const key = `${part}-${String(index)}`

        const bold = /^\*\*(.+)\*\*$/.exec(part)
        if (bold) return <strong key={key}>{bold[1]}</strong>

        const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part)
        if (link) {
          return (
            <a href={resolveInternal(prefix, link[2] ?? '')} key={key}>
              {link[1]}
            </a>
          )
        }

        const code = /^`(.+)`$/.exec(part)
        if (code) return <code key={key}>{code[1]}</code>

        const emphasis = /^_(.+)_$/.exec(part)
        if (emphasis) return <em key={key}>{emphasis[1]}</em>

        return <span key={key}>{part}</span>
      })}
    </>
  )
}
