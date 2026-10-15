import * as stylex from '@stylexjs/stylex'

import { SiteFrame } from '@/components/site-frame.tsx'

const styles = stylex.create({
  body: {
    paddingBlock: '6rem',
    textAlign: 'center',
  },
  link: {
    textDecorationLine: 'underline',
  },
  title: {
    fontSize: '2.25rem',
    fontWeight: 700,
    marginBlockEnd: '1rem',
  },
})

/**
 * Not-found page.
 *
 * Replaces Hugo's `404.html`. Waku writes it to `404.html` at the output root,
 * which is the file Cloudflare Pages serves for unmatched paths.
 */
export default function NotFound() {
  return (
    <SiteFrame current="" prefix="">
      <div {...stylex.props(styles.body)}>
        <h1 {...stylex.props(styles.title)}>404 Page not found</h1>
        <p>
          The page you are looking for does not exist. <a href="/" {...stylex.props(styles.link)}>Back home</a>.
        </p>
      </div>
    </SiteFrame>
  )
}

export async function getConfig() {
  // Prerendered at build time, with document SSR disabled (see AGENTS.md).
  return { render: 'static', unstable_disableSSR: true } as const
}
