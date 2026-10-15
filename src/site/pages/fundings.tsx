import type { Locale } from '@/lib/i18n.ts'

import { styles as blockStyles } from '@/components/block.stylex.ts'
import { BlockHeading } from '@/components/block.tsx'
import { DetailRow, FundingCard } from '@/components/cards.tsx'
import { MathText } from '@/components/math-text.tsx'
import { getMdxComponents } from '@/components/mdx.tsx'
import { shared } from '@/components/views.stylex.ts'
import { formatDate } from '@/lib/format.ts'
import { sortedFundings } from '@/lib/sort.ts'
import { fundings, pages } from '@/lib/source.ts'
import * as stylex from '@stylexjs/stylex'

const styles = stylex.create({
  detail: {
    marginInline: 'auto',
    maxWidth: '65ch',
    paddingInline: '1.5rem',
  },
  title: {
    fontSize: '2.25rem',
    fontWeight: 700,
    marginBlock: '0.5rem 1rem',
  },
})

/** `/fundings/`: fund projects as cards, matching the overridden `views/card.html`. */
export function FundingsList({ locale }: { locale: Locale }) {
  const frontMatter = pages
    .getPages(locale)
    .find(page => page.slugs.length === 1 && page.slugs[0] === 'fundings')
  const heading =
    frontMatter === undefined ? 'Fundings' : frontMatter.data.title

  return (
    <>
      <BlockHeading title={heading} />
      <div {...stylex.props(blockStyles.centered)}>
        {sortedFundings().map(page => (
          <FundingCard key={page.url} page={page} />
        ))}
      </div>
    </>
  )
}

export function FundingsDetail({
  locale,
  slugs,
}: {
  locale: Locale
  slugs: string[]
}) {
  const page = fundings
    .getPages(locale)
    .find(candidate => sameSlugs(candidate.slugs, slugs))
  if (!page) return null
  const MDX = page.data.body

  return (
    <div {...stylex.props(styles.detail)}>
      <h1 {...stylex.props(shared.pageTitle, styles.title)}>
        {page.data.title}
      </h1>
      <p {...stylex.props(shared.meta)}>
        <time dateTime={page.data.date}>{formatDate(page.data.date)}</time>
      </p>
      {page.data.summary.length > 0 ? (
        <DetailRow label="Summary">
          <p>
            <MathText text={page.data.summary} />
          </p>
        </DetailRow>
      ) : null}
      <MDX components={getMdxComponents()} />
    </div>
  )
}

function sameSlugs(a: string[], b: string[]): boolean {
  return (
    a.length === b.length && a.every((segment, index) => segment === b[index])
  )
}
