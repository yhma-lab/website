import { LandingPage } from '@/site/landing.tsx'
import { pages, standalonePageParams } from '@/lib/source.ts'
import { unstable_notFound } from 'waku/router/server'

const LOCALE = 'cn'

/**
 * Chinese standalone pages.
 *
 * No page is translated yet, so `standalonePageParams` returns no paths and the
 * route is not built. It exists so that adding `index.cn.mdx` to
 * `content.generated/pages/` is enough to publish the translated page.
 */
export default function Page({ slugs }: { slugs: string[] }) {
  const exists = pages.getPages(LOCALE).some((page) => sameSlugs(page.slugs, slugs))
  if (!exists) unstable_notFound()
  return <LandingPage prefix="/cn" slugs={slugs} />
}

function sameSlugs(a: string[], b: string[]): boolean {
  return a.length === b.length && a.every((segment, index) => segment === b[index])
}

export async function getConfig() {
  // Prerendered at build time, with document SSR disabled: see AGENTS.md and the
  // rendering-policy note in README.md before changing either flag.
  return {
    render: 'static',
    staticPaths: standalonePageParams(LOCALE),
    unstable_disableSSR: true,
  } as const
}
