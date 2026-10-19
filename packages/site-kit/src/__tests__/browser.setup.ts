import { afterAll, beforeAll } from 'vitest'

// Load extracted rules after the test modules have been transformed by StyleX.
const stylesheet = document.createElement('link')
stylesheet.rel = 'stylesheet'
stylesheet.href = '/virtual:stylex.css'

beforeAll(async () => {
  await new Promise<void>((resolve, reject) => {
    stylesheet.onload = () => {
      resolve()
    }
    stylesheet.onerror = () => {
      reject(new Error('StyleX test stylesheet failed to load'))
    }
    document.head.append(stylesheet)
  })
})

afterAll(() => {
  stylesheet.remove()
})
