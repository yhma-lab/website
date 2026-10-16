import * as stylex from '@stylexjs/stylex'

import { styles } from '../../components/biography.stylex.ts'
import { ExperienceList } from '../../components/experience.tsx'
import { PeopleGrid } from '../../components/people.tsx'
import { AuthorBio, PersonHeader } from '../../components/resume.tsx'
import { normalizeEducation } from '../../content/education.ts'
import { translate } from '../../content/strings.ts'
import { siteContext } from '../../site-context.ts'

const styles2 = stylex.create({
  detail: {
    marginInline: 'auto',
    maxWidth: '65ch',
    paddingInline: '1.5rem',
  },
})

/** `/people/`: the full team, grouped by `user_groups` in declaration order. */
export function PeopleList() {
  const { locale, source } = siteContext()

  return (
    <PeopleGrid
      groups={source.peopleGroups()}
      showInterests
      showOrganizations={false}
      showRole
      showSocial
      title={locale === 'cn' ? '全体成员' : 'Meet the team'}
    />
  )
}

/**
 * `/people/<slug>/`.
 *
 * Ports `content/people/<slug>.md`, whose landing sections were
 * `resume-biography` + `resume-experience` (+ `resume-awards` where enabled).
 */
export function PeopleDetail({ slugs = [] }: { slugs?: string[] }) {
  const { locale, source } = siteContext()
  const page = source.findAuthor(slugs)
  if (!page) return null
  const labels = translate(locale)

  return (
    <>
      <div {...stylex.props(styles2.detail)}>
        <PersonHeader author={page} role={page.data.role} social={undefined} />
      </div>
      <div {...stylex.props(styles2.detail, styles.bioColumn)}>
        <div {...stylex.props(styles.bio)}>
          <AuthorBio body={page.data.body} />
        </div>
      </div>
      <div {...stylex.props(styles2.detail)}>
        <ExperienceList
          entries={page.data.work}
          heading={labels.experience}
          icon="building-office"
          presentLabel={labels.present}
        />
        <ExperienceList
          entries={normalizeEducation(page.data.education)}
          heading={labels.education}
          icon="academic-cap"
          presentLabel={labels.present}
        />
      </div>
    </>
  )
}
