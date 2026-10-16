import { fsRouter } from 'waku'
import adapter from 'waku/adapters/default'

const router = fsRouter(import.meta.glob('./pages/**/*.{tsx,ts}'))

export default adapter(router)
