import type { EventPage } from '../../content/source.ts'

import * as stylex from '@stylexjs/stylex'

import { styles as blockStyles } from '../../components/block.stylex.ts'
import { BlockHeading } from '../../components/block.tsx'
import { DetailRow } from '../../components/cards.tsx'
import { MathText } from '../../components/math-text.tsx'
import { getMdxComponents } from '../../components/mdx.tsx'
import { Attachments } from '../../components/view-links.tsx'
import { card as cardStyles, shared } from '../../components/views.stylex.ts'
import { formatLongDate } from '../../content/format.ts'
import { siteContext } from '../../site-context.ts'

const styles = stylex.create({
  detail: {
    marginInline: 'auto',
    maxWidth: '65ch',
    paddingInline: '1.5rem',
  },
  meta: {
    marginBlock: '0.5rem 2rem',
  },
})

/**
 * `/events/`: talks.
 *
 * `content/event/` was not linked from the menu in the Hugo site but was
 * published at `/event/`, so the route is preserved here under `/events/`.
 */
export function EventsList() {
  const { source } = siteContext()
  const frontMatter = source.findPage(['events'])
  const heading =
    frontMatter === undefined ? 'Talks & Events' : frontMatter.data.title

  return (
    <>
      <BlockHeading title={heading} />
      <div {...stylex.props(blockStyles.centered)}>
        {source.sortedEvents().map(page => (
          <EventCard key={page.url} page={page} />
        ))}
      </div>
    </>
  )
}

export function EventsDetail({ slugs }: { slugs: string[] }) {
  const { source } = siteContext()
  const page = source.findEvent(slugs)
  if (!page) return null
  const MDX = page.data.body
  const abstract = page.data.abstract

  return (
    <div {...stylex.props(styles.detail)}>
      <h1 {...stylex.props(shared.pageTitle)}>{page.data.title}</h1>
      <div {...stylex.props(shared.meta, styles.meta)}>
        {page.data.event.length > 0 ? <div>{page.data.event}</div> : null}
        <div>
          <time dateTime={page.data.date}>
            {formatLongDate(page.data.date)}
          </time>
        </div>
      </div>
      <div {...stylex.props(blockStyles.attachmentRow)}>
        <Attachments
          size="large"
          source={{ ...page.data, slugs: page.slugs }}
        />
      </div>
      {abstract.length > 0 ? (
        <DetailRow label="Abstract">
          <p>
            <MathText text={abstract} />
          </p>
        </DetailRow>
      ) : null}
      <MDX components={getMdxComponents()} />
    </div>
  )
}

/** Talk card, reusing the project card's shape from the overridden `views/card.html`. */
function EventCard({ page }: { page: EventPage }) {
  const external = page.data.event_url.length > 0
  return (
    <a
      href={external ? page.data.event_url : page.url}
      {...(external ? { rel: 'noopener noreferrer', target: '_blank' } : {})}
      {...stylex.props(cardStyles.item)}
    >
      <div {...stylex.props(cardStyles.row)}>
        <div {...stylex.props(cardStyles.body)}>
          <div {...stylex.props(cardStyles.title)}>{page.data.title}</div>
          {page.data.summary.length > 0 ? (
            <p {...stylex.props(cardStyles.summary)}>{page.data.summary}</p>
          ) : null}
          <p {...stylex.props(shared.meta)}>
            <time dateTime={page.data.date}>
              {formatLongDate(page.data.date)}
            </time>
            {page.data.location.length > 0 ? ` · ${page.data.location}` : ''}
          </p>
        </div>
      </div>
    </a>
  )
}
