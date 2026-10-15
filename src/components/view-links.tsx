import * as stylex from '@stylexjs/stylex'

import { styles } from './block.stylex.ts'
import { AttachmentIcon } from './citation.tsx'

/**
 * What the attachment row needs.
 *
 * Declared structurally rather than as `PublicationPage` so the same component
 * serves events, which carry the same `url_*` and `links` fields but come from a
 * different collection. Errors in a narrow type surface here instead of at
 * render time.
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
  /** Only publications carry a DOI; events have none. */
  doi?: string
  links: readonly { name?: string | undefined; url: string }[]
}

/**
 * Attachment buttons.
 *
 * Ports `layouts/partials/page_links.html`, including its ordering
 * (PDF, cite, code, dataset, poster, slides, video, source, DOI, then custom
 * `links:` entries) and the label casing. The `is_list` flag switches between
 * the small row used inside a citation and the large buttons used on a
 * publication page.
 */

interface Attachment {
  href: string
  icon: string | undefined
  key: string
  label: string
}

export interface AttachmentsProps {
  source: AttachmentSource
  size: 'large' | 'small'
}

/** The bundle's `cite.bib` is served at the same path the old site used. */
export function citeHref(source: AttachmentSource): string {
  return `/publications/${source.slugs.join('/')}/cite.bib`
}

function attachmentsFor(source: AttachmentSource): Attachment[] {
  const items: Attachment[] = []

  if (source.url_pdf.length > 0) {
    items.push({
      href: source.url_pdf,
      icon: 'document-text',
      key: 'pdf',
      label: 'PDF',
    })
  }
  items.push({
    href: citeHref(source),
    icon: 'document-duplicate',
    key: 'cite',
    label: 'Cite',
  })

  const optional: [keyof AttachmentSource, string, string][] = [
    ['url_code', 'code-bracket', 'Code'],
    ['url_dataset', 'circle-stack', 'Dataset'],
    ['url_poster', 'photo', 'Poster'],
    ['url_slides', 'presentation-chart-bar', 'Slides'],
    ['url_video', 'video-camera', 'Video'],
    ['url_source', 'document', 'Source'],
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

export function Attachments({ size, source }: AttachmentsProps) {
  const items = attachmentsFor(source)
  if (items.length === 0) return null

  return (
    <>
      {items.map(item => (
        <a
          href={item.href}
          key={item.key}
          rel="noopener noreferrer"
          target="_blank"
          {...stylex.props(
            styles.attachmentLink,
            size === 'small' && styles.attachmentSmall,
          )}
        >
          {item.icon === undefined ? null : <AttachmentIcon name={item.icon} />}
          {item.label}
        </a>
      ))}
    </>
  )
}
