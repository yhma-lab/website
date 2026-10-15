import type { MDXContent } from 'mdx/types'
import type { ReactNode } from 'react'
import type { AuthorPage } from '../lib/source.ts'
import type { ExperienceEntry } from './bio-text.ts'

import * as stylex from '@stylexjs/stylex'

import { styles } from './biography.stylex.ts'
import { Icon } from './icon.tsx'
import { getMdxComponents } from './mdx.tsx'
import { avatarFor } from './people.tsx'

/** Renders an author's Markdown body with the shared prose mapping. */
export function AuthorBio({ body }: { body: MDXContent }) {
  const MDX = body
  return <MDX components={getMdxComponents()} />
}

export interface PersonHeaderProps {
  author: AuthorPage
  role?: string | undefined
  social?: ReactNode
}

/**
 * The avatar, name, role and affiliation block of a biography.
 *
 * Hugo resolved `*avatar*` inside the content bundle; the migrated bundles keep
 * their original file name, so `avatarFor` maps the directory to its file.
 */
export function PersonHeader({ author, role, social }: PersonHeaderProps) {
  const avatar = avatarFor(author.slugs.at(-1))
  const organizations = author.data.organizations

  return (
    <div {...stylex.props(styles.profile)}>
      <div {...stylex.props(styles.avatarWrap)}>
        {avatar.length > 0 ? (
          <img
            alt={author.data.title}
            height={150}
            src={avatar}
            width={150}
            {...stylex.props(styles.avatar)}
          />
        ) : null}
      </div>
      <div>
        <div {...stylex.props(styles.name)}>{author.data.title}</div>
        {role ? <h3 {...stylex.props(styles.role)}>{role}</h3> : null}
        {organizations.map(organization => (
          <div key={organization.name} {...stylex.props(styles.org)}>
            <ExternalLink
              href={organization.url.length > 0 ? organization.url : undefined}
            >
              {organization.name}
            </ExternalLink>
          </div>
        ))}
      </div>
      {social ? <ul {...stylex.props(styles.profileList)}>{social}</ul> : null}
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
    <a href={href} rel="noopener noreferrer" target="_blank">
      {children}
    </a>
  )
}
