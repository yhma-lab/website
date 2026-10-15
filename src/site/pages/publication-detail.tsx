import type { Locale } from '@/lib/i18n.ts'
import type { PublicationPage } from '@/lib/source.ts'

import { styles as blockStyles } from '@/components/block.stylex.ts'
import { DetailRow } from '@/components/cards.tsx'
import { PublicationAuthors, PublicationDate } from '@/components/citation.tsx'
import { MathText } from '@/components/math-text.tsx'
import { getMdxComponents } from '@/components/mdx.tsx'
import { Attachments } from '@/components/view-links.tsx'
import { shared } from '@/components/views.stylex.ts'
import { translate } from '@/lib/strings.ts'
import * as stylex from '@stylexjs/stylex'

const styles = stylex.create({
  detail: {
    marginInline: 'auto',
    maxWidth: '65ch',
    paddingInline: '1.5rem',
  },
  header: {
    marginBlockEnd: '4rem',
    marginBlockStart: '1rem',
  },
  meta: {
    alignItems: 'center',
    columnGap: '0.375rem',
    display: 'flex',
    flexWrap: 'wrap',
    marginInlineStart: '0.25rem',
    rowGap: '0.5rem',
  },
})

export interface PublicationDetailProps {
  page: PublicationPage
  locale: Locale
}

/**
 * Publication page.
 *
 * Ports `layouts/publication/single.html`: an `h1`, the author/venue metadata
 * line, the large attachment buttons, then the `Cite` and `Abstract` rows above
 * the Markdown body.
 */
export function PublicationDetail({ locale, page }: PublicationDetailProps) {
  const labels = translate(locale)
  const MDX = page.data.body
  const abstract = page.data.abstract
  const summary = page.data.summary

  return (
    <div {...stylex.props(styles.detail)}>
      <div {...stylex.props(styles.header)}>
        <h1 {...stylex.props(shared.pageTitle)}>{page.data.title}</h1>
        <div {...stylex.props(shared.meta, styles.meta)}>
          <PublicationAuthors page={page} />
          {' · '}
          <PublicationDate page={page} />
          {page.data.publication.length > 0 ? (
            <span>{page.data.publication}</span>
          ) : null}
        </div>
        <div {...stylex.props(blockStyles.attachmentRow)}>
          <Attachments
            size="large"
            source={{ ...page.data, slugs: page.slugs }}
          />
        </div>
      </div>

      {abstract.length > 0 ? (
        <DetailRow label="Abstract">
          <p>
            <MathText text={abstract} />
          </p>
        </DetailRow>
      ) : null}
      {summary.length > 0 && summary !== abstract ? (
        <DetailRow label="Summary">
          <p>
            <MathText text={summary} />
          </p>
        </DetailRow>
      ) : null}
      <DetailRow label={labels.buttons.cite}>
        <p>
          <MathText text={citationLine(page)} />
        </p>
      </DetailRow>

      <div {...stylex.props(blockStyles.headingWrap)}>
        <MDX components={getMdxComponents()} />
      </div>
    </div>
  )
}

/** The APA line shown under `Cite`, matching `views/citation.html`. */
function citationLine(page: PublicationPage): string {
  const venue =
    page.data.publication_short.length > 0
      ? page.data.publication_short
      : page.data.publication
  const year = page.data.date.slice(0, 4)
  return `${page.data.authors.join(', ')} (${year}). ${page.data.title}. ${venue}.`
}
