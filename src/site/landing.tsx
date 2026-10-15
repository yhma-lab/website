import { Hero } from '@/components/hero.tsx'
import { PeopleGrid } from '@/components/people.tsx'
import { renderInlineMarkdown } from '@/lib/inline-markdown.tsx'
import { resolveInternal } from '@/lib/links.ts'
import { localeOf } from '@/lib/locale.ts'
import { peopleGroups } from '@/lib/sort.ts'
import { pages } from '@/lib/source.ts'
import { Collection } from '@/site/collection.tsx'
import { Resume } from '@/site/resume-section.tsx'

/**
 * Landing page renderer.
 *
 * Every page in `content/pages/` is a `sections:` array, which
 * `partials/landing_page.html` walked over. Each entry names a block and carries
 * its `content`/`design`; the blocks themselves live in `src/components/`.
 */

export interface LandingPageProps {
  /** `''` for English, `'/cn'` for Chinese. */
  prefix: string
  /** Slugs identifying the page inside the `pages` collection. */
  slugs: string[]
}

export function LandingPage({ prefix, slugs }: LandingPageProps) {
  const locale = localeOf(prefix)
  const page = pages
    .getPages(locale)
    .find(candidate => sameSlugs(candidate.slugs, slugs))
  if (!page) return null

  const resolve = (url: string) => resolveInternal(prefix, url)
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
                      : peopleGroups()
                  }
                  intro={content.text.length > 0 ? content.text : undefined}
                  showInterests={section.design.show_interests}
                  showOrganizations={section.design.show_organizations}
                  showRole={section.design.show_role}
                  showSocial={section.design.show_social}
                  subtitle={renderInlineMarkdown(content.subtitle, prefix)}
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
                <Resume locale={locale} prefix={prefix} section={section} />
              </section>
            )

          default:
            return null
        }
      })}
    </>
  )
}

function sameSlugs(a: string[], b: string[]): boolean {
  return (
    a.length === b.length && a.every((segment, index) => segment === b[index])
  )
}
