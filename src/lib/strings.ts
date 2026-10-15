import type { Locale } from './i18n.ts'

/**
 * Localized UI strings.
 *
 * The previous build pulled these from Hugo's i18n bundles
 * (`i18n/en.toml` and friends) for the resume blocks, the paginator and the
 * attachment buttons. Only the strings the ported components actually render are
 * kept here.
 */

export interface UiStrings {
  /** `i18n "experience"` */
  experience: string
  /** `i18n "education"` */
  education: string
  /** `i18n "interests"` */
  interests: string
  /** `i18n "awards"` */
  awards: string
  /** `i18n "present"`, appended to an open-ended résumé date range. */
  present: string
  /** `i18n "btn_pdf"` and friends, used by `page_links.html`. */
  buttons: {
    cite: string
    code: string
    dataset: string
    pdf: string
    poster: string
    project: string
    slides: string
    source: string
    video: string
  }
}

const EN: UiStrings = {
  awards: 'Awards',
  buttons: {
    cite: 'Cite',
    code: 'Code',
    dataset: 'Dataset',
    pdf: 'PDF',
    poster: 'Poster',
    project: 'Project',
    slides: 'Slides',
    source: 'Source',
    video: 'Video',
  },
  education: 'Education',
  experience: 'Experience',
  interests: 'Interests',
  present: 'Present',
}

const CN: UiStrings = {
  awards: '荣誉和奖励',
  buttons: {
    cite: '引用',
    code: '代码',
    dataset: '数据集',
    pdf: 'PDF',
    poster: '海报',
    project: '项目',
    slides: '幻灯片',
    source: '源码',
    video: '视频',
  },
  education: '教育经历',
  experience: '工作经历',
  interests: '研究兴趣',
  present: '至今',
}

const BY_LOCALE: Record<Locale, UiStrings> = { cn: CN, en: EN }

export function translate(locale: Locale): UiStrings {
  return BY_LOCALE[locale]
}
