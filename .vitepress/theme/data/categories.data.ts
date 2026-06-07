import { createContentLoader } from 'vitepress'
import type { Category, Locale } from './categories'

export default createContentLoader(['zh/category/*.md', 'en/category/*.md'], {
  transform(raw): Category[] {
    return raw
      .map(({ url, frontmatter }) => {
        const locale: Locale = url.startsWith('/en/') ? 'en' : 'zh'
        const slug = String(frontmatter.categorySlug || '').trim()

        return {
          slug,
          name: String(frontmatter.category || frontmatter.title || slug),
          icon: String(frontmatter.icon || slug),
          order: Number(frontmatter.order ?? 999),
          locale
        }
      })
      .filter((category) => category.slug)
      .sort((a, b) => {
        if (a.order !== b.order) return a.order - b.order
        return Math.random() - 0.5
      })
  }
})
