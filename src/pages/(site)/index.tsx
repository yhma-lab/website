import { LandingPage } from '@/site/landing.tsx'

/** Home page: `content/pages/index.mdx` declares the hero, collections and people grid. */
export default function HomePage() {
  return <LandingPage prefix="" slugs={[]} />
}

export async function getConfig() {
  // Prerendered at build time, with document SSR disabled (see AGENTS.md).
  return { render: 'static', unstable_disableSSR: true } as const
}
