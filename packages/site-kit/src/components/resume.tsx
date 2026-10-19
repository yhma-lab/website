import type { MDXContent } from 'mdx/types'
import type { ReactNode } from 'react'
import type { AuthorPage } from '../content/source.ts'
import type { ExperienceEntry } from './bio-text.ts'

import * as stylex from '@stylexjs/stylex'

import {
  entrySubtitle,
  entryTitle,
  entryYears,
  formatRange,
} from './bio-text.ts'
import { styles } from './biography.stylex.ts'
import { Icon } from './icon.tsx'
import { getMdxComponents } from './mdx.tsx'
import { avatarFor } from './people.tsx'

/** Profile links are labelled by their authored label, falling back to the icon key. */
function profileLabel(profile: {
  icon: string
  label?: string | undefined
}): string {
  const label = profile.label ?? ''
  return label.length > 0 ? label : profile.icon
}

/** Renders an author's Markdown body with the shared prose mapping. */
export function AuthorBio({ body }: { body: MDXContent }) {
  const MDX = body
  return <MDX components={getMdxComponents()} />
}

export interface PersonHeaderProps {
  author: AuthorPage
  role?: string | undefined
  /** `author.data.profiles`; only entries with a URL are rendered. */
  profiles?: AuthorPage['data']['profiles']
  /** The home biography sits under the hero's `h1`, so it uses `h2`. */
  nameAs?: 'h1' | 'h2'
}

/**
 * The identity block of a biography: portrait, name, role, affiliations and
 * profile links. The portrait is decorative (the name is beside it), so it keeps
 * an empty `alt` and the page has one clear heading instead of two names.
 */
export function PersonHeader({
  author,
  nameAs = 'h1',
  profiles = [],
  role,
}: PersonHeaderProps) {
  const Name = nameAs
  const avatar = avatarFor(author.slugs.at(-1))
  const organizations = author.data.organizations
  const visibleProfiles = profiles.filter(profile => profile.url.length > 0)

  return (
    <div {...stylex.props(styles.profile)}>
      <div {...stylex.props(styles.avatarWrap)}>
        {avatar.length > 0 ? (
          <img
            alt=""
            height={152}
            src={avatar}
            width={152}
            {...stylex.props(styles.avatar)}
          />
        ) : null}
      </div>
      <Name {...stylex.props(styles.name)}>{author.data.title}</Name>
      {role ? <p {...stylex.props(styles.role)}>{role}</p> : null}
      {organizations.length > 0 ? (
        <div {...stylex.props(styles.orgs)}>
          {organizations.map(organization => (
            <p key={organization.name} {...stylex.props(styles.org)}>
              <ExternalLink
                href={
                  organization.url.length > 0 ? organization.url : undefined
                }
              >
                {organization.name}
              </ExternalLink>
            </p>
          ))}
        </div>
      ) : null}
      {visibleProfiles.length > 0 ? (
        <ul {...stylex.props(styles.profileList)}>
          {visibleProfiles.map(profile => (
            <li key={profile.icon}>
              <a
                aria-label={profileLabel(profile)}
                href={profile.url}
                rel="noopener noreferrer"
                target={profile.url.startsWith('http') ? '_blank' : undefined}
                title={profile.label}
                {...stylex.props(styles.socialLink)}
              >
                <Icon name={profile.icon} size="large" />
              </a>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}

export function ExternalLink({
  children,
  href,
}: {
  children: ReactNode
  href: string | undefined
}) {
  if (!href) return <>{children}</>
  return (
    <a
      href={href}
      rel="noopener noreferrer"
      target="_blank"
      {...stylex.props(styles.orgLink)}
    >
      {children}
    </a>
  )
}

export interface ProfileFactsProps {
  interests: readonly string[]
  education: readonly ExperienceEntry[]
  labels: { education: string; interests: string; present: string }
}

/**
 * The two facts a visitor scans for before reading a biography: research
 * interests and education. They live in the profile column so the prose does not
 * have to carry a second, denser block of information.
 */
export function ProfileFacts({
  education,
  interests,
  labels,
}: ProfileFactsProps) {
  if (interests.length === 0 && education.length === 0) return null

  return (
    <div {...stylex.props(styles.facts)}>
      {interests.length > 0 ? (
        <div {...stylex.props(styles.factBlock)}>
          <h2 {...stylex.props(styles.factLabel)}>{labels.interests}</h2>
          <ul {...stylex.props(styles.factList)}>
            {interests.map(interest => (
              <li key={interest} {...stylex.props(styles.factItem)}>
                {interest}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {education.length > 0 ? (
        <div {...stylex.props(styles.factBlock)}>
          <h2 {...stylex.props(styles.factLabel)}>{labels.education}</h2>
          <ul {...stylex.props(styles.factList)}>
            {education.map((entry, index) => {
              const years = entryYears(entry)
              return (
                <li
                  key={`${entryTitle(entry)}-${String(index)}`}
                  {...stylex.props(styles.factItem)}
                >
                  {entryTitle(entry)}
                  <br />
                  <span {...stylex.props(styles.factMuted)}>
                    {entrySubtitle(entry)}
                  </span>
                  {years.length > 0 ? (
                    <>
                      <br />
                      <span {...stylex.props(styles.factMuted)}>
                        {formatRange(years, labels.present)}
                      </span>
                    </>
                  ) : null}
                </li>
              )
            })}
          </ul>
        </div>
      ) : null}
    </div>
  )
}
