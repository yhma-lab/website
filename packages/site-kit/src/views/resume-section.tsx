import type { ReactNode } from 'react'
import type { ExperienceEntry } from '../components/bio-text.ts'
import type { PageSection } from '../content/schemas.ts'

import * as stylex from '@stylexjs/stylex'

import { AwardsList } from '../components/awards.tsx'
import { styles } from '../components/biography.stylex.ts'
import { ExperienceList } from '../components/experience.tsx'
import { Icon } from '../components/icon.tsx'
import { AuthorBio, PersonHeader } from '../components/resume.tsx'
import { normalizeEducation } from '../content/education.ts'
import { renderInlineMarkdown } from '../content/inline-markdown.tsx'
import { resolveInternal } from '../content/links.ts'
import { translate } from '../content/strings.ts'
import { siteContext } from '../site-context.ts'

export interface ResumeProps {
  section: PageSection
}

/**
 * Résumé blocks.
 *
 * `resume-biography` / `resume-biography-3` render the avatar, name, role,
 * affiliations, social icons and the author's Markdown body; `resume-experience`
 * renders the work and education timelines; `resume-awards` renders the awards
 * list. All three read `content.username`, which is the author directory name.
 */
export function Resume({ section }: ResumeProps) {
  const { locale, source } = siteContext()
  const author = source.findAuthor([section.content.username])
  if (!author) return null

  const labels = translate(locale)
  const role =
    section.content.text.length > 0 ? section.content.text : author.data.role

  switch (section.block) {
    case 'resume-biography':
    case 'resume-biography-3': {
      const data = author.data
      const education = normalizeEducation(data.education)
      const button = section.content.button

      return (
        <div {...stylex.props(styles.container)}>
          <div {...stylex.props(styles.column)}>
            <PersonHeader
              author={author}
              role={section.block === 'resume-biography-3' ? role : undefined}
              social={data.profiles
                .filter(profile => profile.url.length > 0)
                .map(profile => (
                  <li key={profile.icon}>
                    <a
                      aria-label={profile.icon}
                      href={profile.url}
                      rel="noopener noreferrer"
                      target={
                        profile.url.startsWith('http') ? '_blank' : undefined
                      }
                      title={profile.label}
                    >
                      <Icon name={profile.icon} size="large" />
                    </a>
                  </li>
                ))}
            />
          </div>

          <div {...stylex.props(styles.bioColumn)}>
            <div {...stylex.props(styles.bio)}>
              <AuthorBio body={author.data.body} />
            </div>

            {button ? (
              <p>
                <a
                  href={resolveInternal(button.url)}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {button.text}
                </a>
              </p>
            ) : null}

            <div {...stylex.props(styles.gridTwo)}>
              {data.interests.length > 0 ? (
                <div>
                  <div {...stylex.props(styles.sectionHeading)}>
                    {labels.interests}
                  </div>
                  <ul {...stylex.props(styles.interests)}>
                    {data.interests.map(interest => (
                      <li key={interest} {...stylex.props(styles.interestItem)}>
                        {interest}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {education.length > 0 ? (
                <div>
                  <div {...stylex.props(styles.sectionHeading)}>
                    {labels.education}
                  </div>
                  <ul {...stylex.props(styles.interests)}>
                    {education.map((entry, index) => (
                      <li
                        key={`${entry.area ?? entry.course ?? ''}-${String(index)}`}
                        {...stylex.props(styles.interestItem)}
                      >
                        <span {...stylex.props(styles.iconWrap)}>
                          <Icon name="academic-cap" />
                        </span>{' '}
                        {entry.area ?? entry.course ?? ''}
                        {(entry.year ?? '').length > 0
                          ? `, ${entry.year ?? ''}`
                          : ''}
                        <br />
                        <span {...stylex.props(styles.muted)}>
                          {entry.institution ?? ''}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )
    }

    case 'resume-experience': {
      const work = author.data.work
      const education = normalizeEducation(author.data.education)
      return (
        <div {...stylex.props(styles.container, styles.experienceWrap)}>
          <ExperienceList
            entries={work}
            heading={labels.experience}
            icon="building-office"
            presentLabel={labels.present}
          />
          <ExperienceList
            entries={education}
            heading={labels.education}
            icon="academic-cap"
            presentLabel={labels.present}
          />
        </div>
      )
    }

    case 'resume-awards':
      return (
        <div {...stylex.props(styles.container)}>
          <AwardsList
            awards={author.data.awards}
            dateFormat="year"
            heading={
              section.content.title.length > 0
                ? section.content.title
                : labels.awards
            }
            renderSummary={(text: string): ReactNode =>
              renderInlineMarkdown(text)
            }
          />
        </div>
      )

    default:
      return null
  }
}
