import * as stylex from '@stylexjs/stylex'

import { translate } from '../content/strings.ts'
import { siteContext } from '../site-context.ts'

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
 * Not-found body.
 *
 * Replaces Hugo's `404.html`. Waku writes it to `404.html` at the output root,
 * which is the file Cloudflare Pages serves for unmatched paths. The page frame
 * comes from the app's root layout, so this renders only what is specific to a
 * missing page.
 */
export function NotFound() {
  const { locale } = siteContext()

  return (
    <div {...stylex.props(styles.body)}>
      <h1 {...stylex.props(styles.title)}>{translate(locale).notFoundTitle}</h1>
      <p>
        {translate(locale).notFoundBody}{' '}
        <a href="/" {...stylex.props(styles.link)}>
          {translate(locale).notFoundHome}
        </a>
        .
      </p>
    </div>
  )
}
