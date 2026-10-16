import { site } from '@/site.config.ts'
import { robotsRoute } from '@yhma/site-kit/routes'

const route = robotsRoute(site)

export const GET = route.GET
export const getConfig = route.getConfig
