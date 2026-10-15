import { LandingPage } from '@/site/landing.tsx'

/**
 * Home page.
 *
 * `content/pages/index.mdx` declares the hero, the featured publications
 * collection, the biography and the people grid, in that order.
 */
export default function HomePage() {
  return <LandingPage prefix="" slugs={[]} />
}

export function getConfig() {
  return Promise.resolve({ render: 'static' } as const)
}
