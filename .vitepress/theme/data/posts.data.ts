import { createContentLoader } from 'vitepress'

export type PostItem = {
  url: string
  title: string
  category: string
  categorySlug: string
  date: string
  cover?: string
  hot?: boolean
  pinned?: boolean
  locale: 'zh' | 'en'
}

export default createContentLoader(['zh/posts/*.md', 'en/posts/*.md'], {
  transform(raw): PostItem[] {
    return raw
      .map(({ url, frontmatter }) => ({
        url,
        title: frontmatter.title,
        category: frontmatter.category,
        categorySlug: frontmatter.categorySlug,
        date: frontmatter.date,
        cover: frontmatter.cover,
        hot: Boolean(frontmatter.hot),
        pinned: Boolean(frontmatter.pinned),
        locale: url.startsWith('/en/') ? 'en' : 'zh'
      }))
      .sort(sortPosts)
  }
})

function sortPosts(a: PostItem, b: PostItem) {
  if (a.pinned !== b.pinned) {
    return a.pinned ? -1 : 1
  }

  return new Date(b.date).getTime() - new Date(a.date).getTime()
}
