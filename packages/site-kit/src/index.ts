/**
 * `@yhma/site-kit`.
 *
 * The root entry exports what an app's own wiring needs: the frame, the site
 * context the frame and pages read, and the types of the objects the app
 * constructs. Everything else is a subpath export (`./content`, `./routes`,
 * `./shell`, `./views`, `./waku-config`).
 */
export { SiteFrame } from './components/site-frame.tsx'
export type { SiteFrameProps } from './components/site-frame.tsx'
export { defineSite, siteContext } from './site-context.ts'
export type { SiteContextValue } from './site-context.ts'
export type { ContentInput, ContentSource } from './content/source.ts'
export type {
  AlternateSite,
  Locale,
  NavItem,
  SiteConfig,
} from './site/types.ts'
