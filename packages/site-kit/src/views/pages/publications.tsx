import * as stylex from '@stylexjs/stylex'

import { styles as blockStyles } from '../../components/block.stylex.ts'
import { BlockHeading } from '../../components/block.tsx'
import { PublicationList } from '../../components/citation.tsx'
import { shared } from '../../components/views.stylex.ts'
import { siteContext } from '../../site-context.ts'
import { PublicationDetail } from './publication-detail.tsx'

/**
 * `/publications/`.
 *
 * The heading and intro come from `content/pages/publications/index.mdx`, the
 * same front matter the old collection block read, so the page stays data-driven
 * rather than hard-coded here. The archive itself is the shared year-grouped
 * index, with `h2` year headings because the page owns the only `h1`.
 */
export function PublicationsList() {
  const { source } = siteContext()
  const frontMatter = source.findPage(['publications'])
  const heading =
    frontMatter === undefined ? 'Publications' : frontMatter.data.title
  const intro = frontMatter?.data.sections[0]?.content.text ?? ''

  return (
    <div {...stylex.props(shared.page)}>
      <div {...stylex.props(blockStyles.measure)}>
        <BlockHeading
          as="h1"
          subtitle={intro.length > 0 ? intro : undefined}
          title={heading}
        />
        <PublicationList items={source.sortedPublications()} yearAs="h2" />
      </div>
    </div>
  )
}

export function PublicationsDetail({ slugs = [] }: { slugs?: string[] }) {
  const { source } = siteContext()
  const page = source.findPublication(slugs)
  if (!page) return null
  return <PublicationDetail page={page} />
}
