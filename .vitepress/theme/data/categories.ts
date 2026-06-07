export type Locale = 'zh' | 'en'

export type Category = {
  slug: string
  name: string
  icon: string
  order: number
  locale: Locale
}

export function getCategory(categories: Category[], slug: string | undefined) {
  return categories.find((category) => category.slug === slug)
}
