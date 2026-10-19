import type { EventPage } from '../../content/source.ts'

import * as stylex from '@stylexjs/stylex'

import { BackLink } from '../../components/back-link.tsx'
import { styles as blockStyles } from '../../components/block.stylex.ts'
import { BlockHeading } from '../../components/block.tsx'
import { DetailRow } from '../../components/cards.tsx'
import { MathText } from '../../components/math-text.tsx'
import { getMdxComponents } from '../../components/mdx.tsx'
import { Attachments } from '../../components/view-links.tsx'
import { shared } from '../../components/views.stylex.ts'
import { formatLongDate } from '../../content/format.ts'
import { translate } from '../../content/strings.ts'
import { siteContext } from '../../site-context.ts'
import { navFor } from '../../site/nav.ts'
import {
  FONT_SANS,
  FONT_SERIF,
  MOTION,
  TEXT,
  theme,
} from '../../styles/tokens.stylex.ts'

const DARK = '[data-theme="dark"]'

const styles = stylex.create({
  entry: {
    borderBlockEndColor: {
      default: theme.border,
      [stylex.when.ancestor(DARK)]: '#232d35',
    },
    borderBlockEndStyle: 'solid',
    borderBlockEndWidth: 1,
    columnGap: '2rem',
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1fr)',
    paddingBlock: '1.25rem',
    rowGap: '0.375rem',
    '@media (min-width: 768px)': {
      gridTemplateColumns: '10rem minmax(0, 1fr)',
    },
  },
  date: {
    color: {
      default: theme.fgSubtle,
      [stylex.when.ancestor(DARK)]: '#7f8b92',
    },
    fontFamily: FONT_SANS.family,
    fontSize: TEXT.micro,
    fontVariantNumeric: 'tabular-nums',
    lineHeight: 1.6,
  },
  meta: {
    color: {
      default: theme.fgSubtle,
      [stylex.when.ancestor(DARK)]: '#7f8b92',
    },
    fontFamily: FONT_SANS.family,
    fontSize: TEXT.small,
    lineHeight: 1.55,
    marginBlock: 0,
  },
  summary: {
    color: {
      default: theme.fgMuted,
      [stylex.when.ancestor(DARK)]: '#a9b4ba',
    },
    fontFamily: FONT_SANS.family,
    fontSize: TEXT.small,
    lineHeight: 1.6,
    marginBlock: '0.25rem 0',
    maxWidth: '62ch',
  },
  title: {
    color: {
      default: theme.fg,
      [stylex.when.ancestor(DARK)]: '#e9eeec',
    },
    fontFamily: FONT_SERIF.family,
    fontSize: TEXT.body,
    fontWeight: 600,
    lineHeight: 1.4,
    textDecorationColor: {
      default: theme.accent,
      [stylex.when.ancestor(DARK)]: '#82a6ff',
    },
    textDecorationLine: 'none',
    textUnderlineOffset: 3,
    textWrap: 'pretty',
    transitionDuration: MOTION.hover,
    transitionProperty: 'color',
    transitionTimingFunction: MOTION.easeOut,
    '@media (hover: hover) and (pointer: fine)': {
      ':hover': {
        textDecorationLine: 'underline',
      },
    },
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
  },
})

/**
 * `/event/`: talks and conference contributions.
 *
 * An archive row rather than a card: the date is the left column, the title is
 * the link and the venue sits under it. Seven entries do not need thumbnails.
 */
export function EventsList() {
  const { locale, source } = siteContext()
  const frontMatter = source.findPage(['events'])
  const heading =
    frontMatter === undefined
      ? translate(locale).events
      : frontMatter.data.title

  return (
    <div {...stylex.props(shared.page)}>
      <div {...stylex.props(blockStyles.measure)}>
        <BlockHeading as="h1" title={heading} />
        <div {...stylex.props(styles.list)}>
          {source.sortedEvents().map(page => (
            <EventRow key={page.url} page={page} />
          ))}
        </div>
      </div>
    </div>
  )
}

function EventRow({ page }: { page: EventPage }) {
  const external = page.data.event_url.length > 0
  const meta = [page.data.event, page.data.location]
    .filter(value => value.length > 0)
    .join(', ')

  return (
    <article {...stylex.props(styles.entry)}>
      <time dateTime={page.data.date} {...stylex.props(styles.date)}>
        {formatLongDate(page.data.date)}
      </time>
      <div>
        <a
          href={external ? page.data.event_url : page.url}
          {...(external
            ? { rel: 'noopener noreferrer', target: '_blank' }
            : {})}
          {...stylex.props(styles.title)}
        >
          {page.data.title}
        </a>
        {page.data.summary.length > 0 ? (
          <p {...stylex.props(styles.summary)}>{page.data.summary}</p>
        ) : null}
        {meta.length > 0 ? <p {...stylex.props(styles.meta)}>{meta}</p> : null}
      </div>
    </article>
  )
}

/** `/event/<slug>/`: one talk, with its abstract and Markdown body. */
export function EventsDetail({ slugs = [] }: { slugs?: string[] }) {
  const { locale, source } = siteContext()
  const page = source.findEvent(slugs)
  if (!page) return null
  const labels = translate(locale)
  const MDX = page.data.body
  const abstract = page.data.abstract
  const meta = [page.data.event, page.data.location]
    .filter(value => value.length > 0)
    .join(', ')
  const backLabel =
    navFor(locale).find(item => item.to === '/event')?.label ?? labels.events

  return (
    <div {...stylex.props(shared.page)}>
      <BackLink href="/event/">{backLabel}</BackLink>
      <header {...stylex.props(shared.header)}>
        <h1 {...stylex.props(shared.title)}>{page.data.title}</h1>
        <div {...stylex.props(shared.meta)}>
          {meta.length > 0 ? (
            <div {...stylex.props(shared.metaLine)}>{meta}</div>
          ) : null}
          <div {...stylex.props(shared.metaInline)}>
            <time dateTime={page.data.date}>
              {formatLongDate(page.data.date)}
            </time>
          </div>
        </div>
        <div {...stylex.props(shared.actions)}>
          <Attachments
            includeCite={false}
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
        <div {...stylex.props(shared.body)}>
          <MDX components={getMdxComponents()} />
        </div>
      </div>
    </div>
  )
}
