import { defineSite } from '@yhma/site-kit'

import { site } from '../site.config.ts'
import { source } from './source.ts'

/**
 * This app's site context.
 *
 * Importing this module is what makes the shared components aware of which site
 * they are rendering: `_root.tsx` (the document shell) and `_layout.tsx` (the
 * frame) both import it, so it is defined before any page renders.
 */
export const context = defineSite({ locale: site.locale, site, source })
