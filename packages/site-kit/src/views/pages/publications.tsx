import * as stylex from '@stylexjs/stylex'

import { styles as blockStyles } from '../../components/block.stylex.ts'
import { BlockHeading } from '../../components/block.tsx'
import { CitationItem } from '../../components/citation.tsx'
import { siteContext } from '../../site-context.ts'
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
export function PublicationsList() {
  const { source } = siteContext()
  const frontMatter = source.findPage(['publications'])
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
          {source.sortedPublications().map(page => (
            <CitationItem key={page.url} page={page} />
          ))}
        </div>
      </div>
    </>
  )
}

export function PublicationsDetail({ slugs }: { slugs: string[] }) {
  const { source } = siteContext()
  const page = source.findPublication(slugs)
  if (!page) return null
  return <PublicationDetail page={page} />
}

export { styles }
