import type { PublicationPage } from '../content/source.ts'

import * as stylex from '@stylexjs/stylex'

import { formatDate, formatYear } from '../content/format.ts'
import { translate } from '../content/strings.ts'
import { siteContext } from '../site-context.ts'
import { MathText } from './math-text.tsx'
import { Attachments } from './view-links.tsx'
import { citation } from './views.stylex.ts'

export interface PublicationItemProps {
  page: PublicationPage
}

export interface PublicationListProps {
  items: readonly PublicationPage[]
  yearAs?: 'h2' | 'h3'
}

/**
 * Publication index.
 *
 * Groups entries by publication year so a thirty-nine-entry archive stays
 * scannable, and keeps the year as a margin label rather than repeating it on
 * every row. `yearAs` lets an archive page use `h2` while the landing section,
 * whose own heading is `h2`, uses `h3`.
 */
export function PublicationList({
  items,
  yearAs = 'h3',
}: PublicationListProps) {
  const groups = groupByYear(items)
  const Year = yearAs

  return (
    <div>
      {groups.map(group => (
        <section
          aria-labelledby={`publication-year-${group.year}`}
          key={group.year}
          {...stylex.props(citation.group)}
        >
          <Year
            id={`publication-year-${group.year}`}
            {...stylex.props(citation.year)}
          >
            {group.year}
          </Year>
          <div {...stylex.props(citation.rows)}>
            {group.items.map(page => (
              <CitationItem key={page.url} page={page} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

interface YearGroup {
  items: PublicationPage[]
  year: string
}

function groupByYear(items: readonly PublicationPage[]): YearGroup[] {
  const groups: YearGroup[] = []
  for (const page of items) {
    const year = formatYear(page.data.date)
    const last = groups.at(-1)
    if (last?.year !== year) {
      groups.push({ items: [page], year })
    } else {
      last.items.push(page)
    }
  }
  return groups
}

/**
 * APA-style citation entry.
 *
 * Authors on one line, the title as the link, the venue in italic serif with the
 * year beside it, and the attachment chips at the right edge. Lab authors are
 * emphasised because the visitor scanning the list is usually looking for what
 * *this* group published.
 */
export function CitationItem({ page }: PublicationItemProps) {
  const { locale, source } = siteContext()
  const labels = translate(locale).buttons
  const authors = source.resolveAuthors(
    page.data.authors,
    page.data.author_notes,
  )
  const venue =
    page.data.publication_short.length > 0
      ? page.data.publication_short
      : page.data.publication
  const year = formatYear(page.data.date)

  return (
    <article {...stylex.props(citation.entry)}>
      <div {...stylex.props(citation.body)}>
        <p {...stylex.props(citation.authors)}>
          {authors.map((author, index) => (
            <span key={`${author.id}-${String(index)}`}>
              {index > 0 ? ', ' : ''}
              <span {...stylex.props(author.highlight && citation.bold)}>
                {author.page ? (
                  <a
                    href={author.page.url}
                    {...stylex.props(citation.authorLink)}
                  >
                    {author.name}
                  </a>
                ) : (
                  author.name
                )}
              </span>
            </span>
          ))}
        </p>
        <a href={page.url} {...stylex.props(citation.title)}>
          <MathText text={page.data.title} />
        </a>
        {venue.length > 0 || year.length > 0 ? (
          <p {...stylex.props(citation.venue)}>
            {venue}
            {venue.length > 0 && year.length > 0 ? ' ' : null}
            {year.length > 0 ? (
              <span {...stylex.props(citation.yearInline)}>({year})</span>
            ) : null}
          </p>
        ) : null}
      </div>
      <div {...stylex.props(citation.attachments)}>
        <Attachments
          labels={labels}
          size="small"
          source={{ ...page.data, slugs: page.slugs }}
        />
      </div>
    </article>
  )
}

export interface PublicationAuthorsProps {
  page: PublicationPage
}

/** Comma-separated author line; lab members keep their emphasis. */
export function PublicationAuthors({ page }: PublicationAuthorsProps) {
  const { source } = siteContext()
  const authors = source.resolveAuthors(
    page.data.authors,
    page.data.author_notes,
  )
  return (
    <>
      {authors.map((author, index) => (
        <span key={`${author.id}-${String(index)}`}>
          {index > 0 ? ', ' : ''}
          <span {...stylex.props(author.highlight && citation.bold)}>
            {author.page ? (
              <a href={author.page.url} {...stylex.props(citation.authorLink)}>
                {author.name}
              </a>
            ) : (
              author.name
            )}
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
  return formatted.length > 0 ? (
    <time dateTime={page.data.date}>{formatted}</time>
  ) : null
}
