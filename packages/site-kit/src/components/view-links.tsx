import type { UiStrings } from '../content/strings.ts'

import * as stylex from '@stylexjs/stylex'

import { styles as blockStyles } from './block.stylex.ts'
import { Icon } from './icon.tsx'
import { actionLinkStyles } from './ui/action-link.stylex.ts'
import { ActionLink } from './ui/action-link.tsx'

/**
 * What the attachment row needs.
 *
 * Declared structurally rather than as `PublicationPage` so the same component
 * serves events and fundings, which carry the same `url_*` and `links` fields but
 * come from a different collection. Errors in a narrow type surface here instead
 * of at render time.
 */
export interface AttachmentSource {
  /** Resource slugs under `content/<section>/`, used to build the `cite.bib` path. */
  slugs: readonly string[]
  url_code: string
  url_dataset: string
  url_pdf: string
  url_poster: string
  url_slides: string
  url_source: string
  url_video: string
  /** Only publications carry a DOI; events and fundings have none. */
  doi?: string
  links: readonly { name?: string | undefined; url: string }[]
}

interface Attachment {
  href: string
  icon: string | undefined
  key: string
  label: string
}

export interface AttachmentsProps {
  source: AttachmentSource
  size: 'large' | 'small'
  /** Localized labels (`PDF`, `Cite`, …), supplied by the surrounding view. */
  labels: UiStrings['buttons']
  /**
   * Only publications publish a `cite.bib` beside the entry; events and fundings
   * must not offer a Cite chip that leads to a 404.
   */
  includeCite?: boolean
}

/** The bundle's `cite.bib` is served at the same path the old site used. */
export function citeHref(source: AttachmentSource): string {
  return `/publications/${source.slugs.join('/')}/cite.bib`
}

function attachmentsFor(
  source: AttachmentSource,
  labels: UiStrings['buttons'],
  includeCite: boolean,
): Attachment[] {
  const items: Attachment[] = []

  if (source.url_pdf.length > 0) {
    items.push({
      href: source.url_pdf,
      icon: 'document-text',
      key: 'pdf',
      label: labels.pdf,
    })
  }
  if (includeCite) {
    items.push({
      href: citeHref(source),
      icon: 'document-duplicate',
      key: 'cite',
      label: labels.cite,
    })
  }

  const optional: [keyof AttachmentSource, string, string][] = [
    ['url_code', 'code-bracket', labels.code],
    ['url_dataset', 'circle-stack', labels.dataset],
    ['url_poster', 'photo', labels.poster],
    ['url_slides', 'presentation-chart-bar', labels.slides],
    ['url_video', 'video-camera', labels.video],
    ['url_source', 'document', labels.source],
  ]
  for (const [field, icon, label] of optional) {
    const value = source[field]
    if (typeof value === 'string' && value.length > 0) {
      items.push({ href: value, icon, key: field, label })
    }
  }

  if (source.doi !== undefined && source.doi.length > 0) {
    items.push({
      href: `https://doi.org/${source.doi}`,
      icon: undefined,
      key: 'doi',
      label: 'DOI',
    })
  }

  for (const [index, link] of source.links.entries()) {
    if (link.url.length === 0) continue
    items.push({
      href: link.url,
      icon: 'link',
      key: `link-${String(index)}`,
      label: link.name ?? link.url,
    })
  }

  return items
}

/**
 * Attachment chips.
 *
 * Ordering matches `layouts/partials/page_links.html` (PDF, cite, code, dataset,
 * poster, slides, video, source, DOI, then authored `links:`) because readers
 * scan for the same position every time. Labels are text, never icon-only, and
 * they are localized by the caller.
 */
export function Attachments({
  includeCite = true,
  labels,
  size,
  source,
}: AttachmentsProps) {
  const items = attachmentsFor(source, labels, includeCite)
  if (items.length === 0) return null

  return (
    <>
      {items.map(item => (
        <ActionLink
          href={item.href}
          key={item.key}
          rel="noopener noreferrer"
          target="_blank"
          xstyle={[
            actionLinkStyles.attachment,
            size === 'large' && actionLinkStyles.attachmentLarge,
          ]}
        >
          {item.icon === undefined ? null : <AttachmentIcon name={item.icon} />}
          {item.label}
        </ActionLink>
      ))}
    </>
  )
}

/** Small glyph inside an attachment chip; the chip's text is the label. */
function AttachmentIcon({ name }: { name: string }) {
  return (
    <span aria-hidden="true" {...stylex.props(blockStyles.attachmentIcon)}>
      <Icon name={name} />
    </span>
  )
}
