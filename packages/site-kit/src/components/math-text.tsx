import type { ReactNode } from 'react'

import katex from 'katex'

/**
 * Render the LaTeX inside a plain-text value.
 *
 * MDX bodies get math through `remark-math` + `rehype-katex` (configured in
 * `waku.config.ts`), but front matter is plain YAML: `abstract` fields such as
 * `stochastic $\\phi^{4}$ model` and `H_c \\equiv H(\\langle \\phi \\rangle = 0)`
 * reach the page as text. Hugo piped those through its KaTeX renderer, so the
 * same delimiters (`$$…$$` for display, `$…$` for inline) are handled here.
 *
 * `throwOnError: false` keeps a malformed formula from failing a build; KaTeX
 * renders it in red so the mistake is visible without breaking the page.
 */

const SEGMENT = /(\$\$[\s\S]+?\$\$|\$[^$\n]+?\$)/g

const KATEX_OPTIONS = {
  output: 'html',
  throwOnError: false,
  trust: false,
} as const

export function MathText({ text }: { text: string }): ReactNode {
  if (!text.includes('$')) return text

  return (
    <>
      {text.split(SEGMENT).map((segment, index) => {
        const key = `${segment.slice(0, 12)}-${String(index)}`
        if (
          segment.startsWith('$$') &&
          segment.endsWith('$$') &&
          segment.length > 4
        ) {
          return (
            <span
              dangerouslySetInnerHTML={{
                __html: katex.renderToString(segment.slice(2, -2), {
                  ...KATEX_OPTIONS,
                  displayMode: true,
                }),
              }}
              key={key}
            />
          )
        }
        if (
          segment.length > 2 &&
          segment.startsWith('$') &&
          segment.endsWith('$')
        ) {
          return (
            <span
              dangerouslySetInnerHTML={{
                __html: katex.renderToString(segment.slice(1, -1), {
                  ...KATEX_OPTIONS,
                  displayMode: false,
                }),
              }}
              key={key}
            />
          )
        }
        return <span key={key}>{segment}</span>
      })}
    </>
  )
}
