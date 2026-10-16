import type { ReactNode } from 'react'

import { SiteFrame } from '../components/site-frame.tsx'
import { RootShell } from '../shell/root-shell.tsx'
import { siteContext } from '../site-context.ts'

/**
 * Document shell and frame.
 *
 * These were `_root.tsx` and `_layout.tsx` in each app, and neither held
 * anything site-specific: both read the site from `siteContext()`. Registering
 * them from the shared table is what removes the last duplicated route files.
 */

/** `<html>`, `<head>` and the pre-paint scripts; the site supplies `lang` and `title`. */
export function SiteRoot({ children }: { children: ReactNode }) {
  return <RootShell site={siteContext().site}>{children}</RootShell>
}

/** Navbar, content column and footer, around every route. */
export function SiteLayout({ children }: { children: ReactNode }) {
  return <SiteFrame>{children}</SiteFrame>
}
