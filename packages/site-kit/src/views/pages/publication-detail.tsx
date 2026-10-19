import type { PublicationPage } from '../../content/source.ts'

import * as stylex from '@stylexjs/stylex'

import { BackLink } from '../../components/back-link.tsx'
import { DetailRow } from '../../components/cards.tsx'
import {
  PublicationAuthors,
  PublicationDate,
} from '../../components/citation.tsx'
import { MathText } from '../../components/math-text.tsx'
import { getMdxComponents } from '../../components/mdx.tsx'
import { Attachments } from '../../components/view-links.tsx'
import { shared } from '../../components/views.stylex.ts'
import { formatYear } from '../../content/format.ts'
import { translate } from '../../content/strings.ts'
import { siteContext } from '../../site-context.ts'
import { navFor } from '../../site/nav.ts'

const styles = stylex.create({
  /** The citation line reads as a quoted reference, not as interface text. */
  cite: {
    marginBlock: 0,
    textWrap: 'pretty',
  },
})

export interface PublicationDetailProps {
  page: PublicationPage
}

/**
 * Publication page.
 *
 * Title and authors are the header; the labeled rows (`Abstract`, `Summary`,
 * `Cite`) are a definition list of reading content; the Markdown body follows at
 * the same measure. The old layout put those rows in a two-column grid that left
 * a third of the page empty on desktop — the labels are now a narrow column and
 * the text keeps a readable measure.
 */
export function PublicationDetail({ page }: PublicationDetailProps) {
  const { locale, source } = siteContext()
  const labels = translate(locale)
  const MDX = page.data.body
  const abstract = page.data.abstract
  const summary = page.data.summary
  const venue =
    page.data.publication_short.length > 0
      ? page.data.publication_short
      : page.data.publication
  const backLabel =
    navFor(locale).find(item => item.to === '/publications')?.label ??
    labels.buttons.cite
  const authorNames = source
    .resolveAuthors(page.data.authors, page.data.author_notes)
    .map(author => author.name)
  const citation = `${authorNames.join(', ')} (${formatYear(page.data.date)}). ${page.data.title}. ${venue}.`

  return (
    <div {...stylex.props(shared.page)}>
      <BackLink href="/publications/">{backLabel}</BackLink>
      <header {...stylex.props(shared.header)}>
        <h1 {...stylex.props(shared.title)}>
          <MathText text={page.data.title} />
        </h1>
        <div {...stylex.props(shared.meta)}>
          <div {...stylex.props(shared.metaLine)}>
            <PublicationAuthors page={page} />
          </div>
          <div {...stylex.props(shared.metaInline)}>
            {venue.length > 0 ? (
              <span {...stylex.props(shared.venue)}>{venue},</span>
            ) : null}
            <PublicationDate page={page} />
          </div>
        </div>
        <div {...stylex.props(shared.actions)}>
          <Attachments
            labels={labels.buttons}
            size="large"
            source={{ ...page.data, slugs: page.slugs }}
          />
        </div>
      </header>

      <div {...stylex.props(shared.reading)}>
        {abstract.length > 0 ? (
          <DetailRow label={labels.abstract}>
            <MathText text={abstract} />
          </DetailRow>
        ) : null}
        {summary.length > 0 && summary !== abstract ? (
          <DetailRow label={labels.summary}>
            <MathText text={summary} />
          </DetailRow>
        ) : null}
        <DetailRow label={labels.buttons.cite}>
          <p {...stylex.props(styles.cite)}>
            <MathText text={citation} />
          </p>
        </DetailRow>

        <div {...stylex.props(shared.body)}>
          <MDX components={getMdxComponents()} />
        </div>
      </div>
    </div>
  )
}
