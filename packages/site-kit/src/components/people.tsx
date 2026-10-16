import type { ReactNode } from 'react'
import type { AuthorPage } from '../content/source.ts'

import * as stylex from '@stylexjs/stylex'

import { siteContext } from '../site-context.ts'
import { styles as blockStyles } from './block.stylex.ts'
import { Icon } from './icon.tsx'
import { styles } from './people.stylex.ts'

export interface PeopleGridProps {
  /** `content.title` renders above the groups. */
  title?: string | undefined
  subtitle?: ReactNode
  /** `content.text`, already parsed. */
  intro?: ReactNode
  /** `content.user_groups`; only groups with members are rendered. */
  groups: readonly string[]
  showRole: boolean
  showSocial: boolean
  showInterests: boolean
  showOrganizations: boolean
}

/**
 * "Meet the incredible team", porting `partials/blox/community/people.html`.
 *
 * The original printed a group heading only when the block declared more than
 * one group, which is why a single-group grid has no heading here either.
 */
export function PeopleGrid({
  groups,
  intro,
  showInterests,
  showOrganizations,
  showRole,
  showSocial,
  subtitle,
  title,
}: PeopleGridProps) {
  const { source } = siteContext()
  const grouped = source.peopleByGroup(groups)
  const showGroupHeadings = groups.length > 1

  return (
    <div {...stylex.props(blockStyles.centered)}>
      {title ? (
        <div {...stylex.props(blockStyles.headingWrap)}>
          <h1 {...stylex.props(blockStyles.heading)}>{title}</h1>
          {subtitle ? (
            <p {...stylex.props(blockStyles.bodyText)}>{subtitle}</p>
          ) : null}
        </div>
      ) : null}
      {intro ? (
        <div {...stylex.props(blockStyles.centered)}>{intro}</div>
      ) : null}

      {grouped.map(group => (
        <div key={group.group} {...stylex.props(styles.groupWrap)}>
          {showGroupHeadings ? (
            <h2 {...stylex.props(styles.groupHeading)}>{group.group}</h2>
          ) : null}
          <div {...stylex.props(styles.grid)}>
            {group.people.map(person => (
              <Person
                key={person.url}
                person={person}
                showInterests={showInterests}
                showOrganizations={showOrganizations}
                showRole={showRole}
                showSocial={showSocial}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export interface PersonProps {
  person: AuthorPage
  showRole: boolean
  showSocial: boolean
  showInterests: boolean
  showOrganizations: boolean
}

function Person({
  person,
  showInterests,
  showOrganizations,
  showRole,
  showSocial,
}: PersonProps) {
  const slug = person.slugs.at(-1)
  const avatar = avatarFor(slug)
  const statusIcon = person.data.status?.icon ?? ''
  const organizations = person.data.organizations
  const interests = person.data.interests
  const profiles = person.data.profiles

  return (
    <div {...stylex.props(styles.person)}>
      {avatar.length > 0 ? (
        <div {...stylex.props(styles.avatarWrap)}>
          <a href={person.url}>
            <img
              alt=""
              height={100}
              loading="lazy"
              src={avatar}
              width={100}
              {...stylex.props(styles.avatar)}
            />
          </a>
          {statusIcon.length > 0 ? (
            <span {...stylex.props(styles.avatarEmoji)}>{statusIcon}</span>
          ) : null}
        </div>
      ) : null}

      <div {...stylex.props(styles.personInfo)}>
        <a href={person.url} {...stylex.props(styles.personName)}>
          <h2 {...stylex.props(styles.name)}>{person.data.title}</h2>
        </a>
        {showOrganizations
          ? organizations.map(organization => (
              <h3 key={organization.name}>{organization.name}</h3>
            ))
          : null}
        {showRole && person.data.role.length > 0 ? (
          <h3 {...stylex.props(styles.role)}>{person.data.role}</h3>
        ) : null}
        {showSocial ? (
          <ul {...stylex.props(styles.socialRow)}>
            {profiles
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
          </ul>
        ) : null}
        {showInterests && interests.length > 0 ? (
          <p {...stylex.props(styles.interests, blockStyles.muted)}>
            {interests.join(', ')}
          </p>
        ) : null}
      </div>
    </div>
  )
}

/**
 * Hugo resolved `*avatar*` inside the content bundle and served a resized WebP.
 * The migrated bundles are copied verbatim, so the avatar is referenced by name.
 */
const AVATARS: Record<string, string> = {
  congfu: 'avatar.jpg',
  cpsun: 'avatar.png',
  erichen: 'avatar.jpg',
  hdong: 'avatar.jpg',
  htquan: 'avatar.jpg',
  hua: 'avatar.jpg',
  jfchen: 'avatar.jpg',
  jrlei: 'avatar.jpg',
  lqhuang: 'avatar.jpg',
  lynn: 'avatar.jpg',
  sandy: 'avatar.jpg',
  shiling: 'avatar.jpg',
  sushanhe: 'avatar.png',
  tuzc: 'avatar.jpg',
  yhma: 'avatar.jpg',
}

function avatarFor(slug: string | undefined): string {
  if (slug === undefined) return ''
  const file = AVATARS[slug]
  return file === undefined ? '' : `/authors/${slug}/${file}`
}

export { avatarFor }
