import type { Locale } from '@/lib/i18n.ts'

import { styles as blockStyles } from '@/components/block.stylex.ts'
import { BlockHeading } from '@/components/block.tsx'
import { CitationItem } from '@/components/citation.tsx'
import { sortedPublications } from '@/lib/sort.ts'
import { pages, publications } from '@/lib/source.ts'
import * as stylex from '@stylexjs/stylex'

import { PublicationDetail } from './publication-detail.tsx'

const styles = stylex.create({
  list: {
    display: 'flex',
    flexDirection: 'column',
    paddingInline: '1.5rem',
  },
})

/**
 * `/publications/`.
 *
 * The heading and intro come from `content/pages/publications/index.mdx`, the
 * same front matter the Hugo collection block read, so the page stays
 * data-driven rather than hard-coded here.
 */
export function PublicationsList({ locale }: { locale: Locale }) {
  const frontMatter = pages
    .getPages(locale)
    .find(page => page.slugs.length === 1 && page.slugs[0] === 'publications')
  const heading =
    frontMatter === undefined ? 'Publications' : frontMatter.data.title
  const intro = frontMatter?.data.sections[0]?.content.text ?? ''

  return (
    <>
      <BlockHeading
        subtitle={intro.length > 0 ? intro : undefined}
        title={heading}
      />
      <div {...stylex.props(blockStyles.centered)}>
        <div {...stylex.props(styles.list)}>
          {sortedPublications().map(page => (
            <CitationItem key={page.url} page={page} />
          ))}
        </div>
      </div>
    </>
  )
}

export function PublicationsDetail({
  locale,
  slugs,
}: {
  locale: Locale
  slugs: string[]
}) {
  const page = publications
    .getPages(locale)
    .find(candidate => sameSlugs(candidate.slugs, slugs))
  if (!page) return null
  return <PublicationDetail locale={locale} page={page} />
}

function sameSlugs(a: string[], b: string[]): boolean {
  return (
    a.length === b.length && a.every((segment, index) => segment === b[index])
  )
}

export { styles }
