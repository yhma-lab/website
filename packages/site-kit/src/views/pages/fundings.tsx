import * as stylex from '@stylexjs/stylex'

import { styles as blockStyles } from '../../components/block.stylex.ts'
import { BlockHeading } from '../../components/block.tsx'
import { DetailRow, FundingCard } from '../../components/cards.tsx'
import { MathText } from '../../components/math-text.tsx'
import { getMdxComponents } from '../../components/mdx.tsx'
import { shared } from '../../components/views.stylex.ts'
import { formatDate } from '../../content/format.ts'
import { siteContext } from '../../site-context.ts'

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
export function FundingsList() {
  const { source } = siteContext()
  const frontMatter = source.findPage(['fundings'])
  const heading =
    frontMatter === undefined ? 'Fundings' : frontMatter.data.title

  return (
    <>
      <BlockHeading title={heading} />
      <div {...stylex.props(blockStyles.centered)}>
        {source.sortedFundings().map(page => (
          <FundingCard key={page.url} page={page} />
        ))}
      </div>
    </>
  )
}

export function FundingsDetail({ slugs = [] }: { slugs?: string[] }) {
  const { source } = siteContext()
  const page = source.findFunding(slugs)
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
