import { Hero } from '../components/hero.tsx'
import { PeopleGrid } from '../components/people.tsx'
import { renderInlineMarkdown } from '../content/inline-markdown.tsx'
import { resolveInternal } from '../content/links.ts'
import { siteContext } from '../site-context.ts'
import { Collection } from './collection.tsx'
import { Resume } from './resume-section.tsx'

/**
 * Landing page renderer.
 *
 * Every page in `content/pages/` is a `sections:` array, which
 * `partials/landing_page.html` walked over. Each entry names a block and carries
 * its `content`/`design`; the blocks themselves live in `src/components/`.
 */

export interface LandingPageProps {
  /**
   * Slugs identifying the page inside the `pages` collection; absent for the
   * home page, which the `/` route renders.
   */
  slugs?: string[]
}

export function LandingPage({ slugs = [] }: LandingPageProps) {
  const { source } = siteContext()
  const page = source.findPage(slugs)
  if (!page) return null

  const resolve = (url: string) => resolveInternal(url)
  const spacing = page.data.design.spacing

  return (
    <>
      {page.data.sections.map((section, index) => {
        const key = section.id ?? `${section.block}-${String(index)}`
        const content = section.content

        switch (section.block) {
          case 'hero':
            return (
              <section
                id={section.id}
                key={key}
                style={{ padding: `${spacing} 0` }}
              >
                <Hero
                  announcement={content.announcement}
                  noPadding={section.design.no_padding}
                  primaryAction={content.primary_action}
                  resolve={resolve}
                  secondaryAction={content.secondary_action}
                  text={content.text}
                  title={content.title}
                />
              </section>
            )

          case 'collection':
            return (
              <section
                id={section.id}
                key={key}
                style={{ padding: `${spacing} 0` }}
              >
                <Collection
                  featuredOnly={content.filters.featured_only}
                  heading={content.title}
                  limit={
                    content.count === 0
                      ? Number.POSITIVE_INFINITY
                      : content.count
                  }
                  section={section}
                  subtitle={
                    content.subtitle.length > 0 ? content.subtitle : undefined
                  }
                  text={content.text}
                  type={
                    content.filters.folders.includes('funding')
                      ? 'funding'
                      : 'publication'
                  }
                />
              </section>
            )

          case 'community/people':
            return (
              <section
                id={section.id}
                key={key}
                style={{ padding: `${spacing} 0` }}
              >
                <PeopleGrid
                  groups={
                    content.user_groups.length > 0
                      ? content.user_groups
                      : source.peopleGroups()
                  }
                  intro={content.text.length > 0 ? content.text : undefined}
                  showInterests={section.design.show_interests}
                  showOrganizations={section.design.show_organizations}
                  showRole={section.design.show_role}
                  showSocial={section.design.show_social}
                  subtitle={renderInlineMarkdown(content.subtitle)}
                  title={content.title}
                />
              </section>
            )

          case 'resume-awards':
          case 'resume-biography':
          case 'resume-biography-3':
          case 'resume-experience':
            return (
              <section
                id={section.id}
                key={key}
                style={{ padding: `${spacing} 0` }}
              >
                <Resume section={section} />
              </section>
            )

          default:
            return null
        }
      })}
    </>
  )
}
