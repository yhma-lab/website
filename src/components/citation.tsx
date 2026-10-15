import * as stylex from '@stylexjs/stylex'

import { resolveAuthors } from '../lib/authors.ts'
import { formatDate, formatYear } from '../lib/format.ts'

import { styles as blockStyles } from './block.stylex.ts'
import { Icon } from './icon.tsx'
import { MathText } from './math-text.tsx'
import { Attachments } from './view-links.tsx'
import { citation } from './views.stylex.ts'

import type { PublicationPage } from '../lib/source.ts'

export interface PublicationItemProps {
  page: PublicationPage
}

/**
 * APA-style citation entry, porting `layouts/partials/views/citation.html`.
 *
 * The shape is: highlighted authors, `(year).`, a link to the publication page,
 * the shortened venue, then the attachment buttons.
 */
export function CitationItem({ page }: PublicationItemProps) {
  const authors = resolveAuthors(page.data.authors, page.data.author_notes)
  const venue = page.data.publication_short.length > 0 ? page.data.publication_short : page.data.publication

  return (
    <div {...stylex.props(citation.item)}>
      <span {...stylex.props(citation.authors)}>
        {authors.map((author, index) => (
          <span key={`${author.id}-${String(index)}`}>
            {index > 0 ? ', ' : ''}
            <span {...stylex.props(author.highlight && citation.bold)}>
              {author.page ? <a href={author.page.url}>{author.name}</a> : author.name}
            </span>
          </span>
        ))}
      </span>{' '}
      ({formatYear(page.data.date)}).{' '}
      <a href={page.url} {...stylex.props(citation.title)}>
        <MathText text={page.data.title} />
      </a>
      {venue.length > 0 ? `. ${venue}.` : '.'}
      <div {...stylex.props(blockStyles.attachmentRow)}>
        <Attachments size="small" source={{ ...page.data, slugs: page.slugs }} />
      </div>
    </div>
  )
}

export interface PublicationAuthorsProps {
  page: PublicationPage
}

/** `partials/page_metadata_authors.html`: comma-separated, highlighted authors. */
export function PublicationAuthors({ page }: PublicationAuthorsProps) {
  const authors = resolveAuthors(page.data.authors, page.data.author_notes)
  return (
    <>
      {authors.map((author, index) => (
        <span key={`${author.id}-${String(index)}`}>
          {index > 0 ? ', ' : ''}
          <span {...stylex.props(author.highlight && citation.bold)}>
            {author.page ? <a href={author.page.url}>{author.name}</a> : author.name}
          </span>
        </span>
      ))}
    </>
  )
}

export interface PublicationDateProps {
  page: PublicationPage
}

export function PublicationDate({ page }: PublicationDateProps) {
  const formatted = formatDate(page.data.date)
  return formatted.length > 0 ? <time dateTime={page.data.date}>{formatted}</time> : null
}

export interface AttachmentIconProps {
  name: string
}

export function AttachmentIcon({ name }: AttachmentIconProps) {
  return (
    <span {...stylex.props(blockStyles.attachmentIcon)}>
      <Icon name={name} />
    </span>
  )
}
