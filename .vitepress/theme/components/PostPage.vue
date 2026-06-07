<script setup lang="ts">
import { computed } from 'vue'
import { useData, useRoute } from 'vitepress'
import { data as posts } from '../data/posts.data'
import SiteHeader from './SiteHeader.vue'
import SiteFooter from './SiteFooter.vue'
import SidebarCategories from './SidebarCategories.vue'
import SidebarPosts from './SidebarPosts.vue'

const route = useRoute()
const { frontmatter } = useData()
const locale = computed(() => (route.path.startsWith('/en/') ? 'en' : 'zh'))
const localePosts = computed(() => posts.filter((post) => post.locale === locale.value))

const currentUrl = computed(() => route.path.replace(/\.html$/, '').replace(/\/$/, ''))
const relatedPosts = computed(() =>
  localePosts.value
    .filter((post) => post.categorySlug === frontmatter.value.categorySlug)
    .filter((post) => post.url.replace(/\/$/, '') !== currentUrl.value)
    .slice(0, 5)
)

const displayDate = computed(() => formatDate(frontmatter.value.date))

function formatDate(date: unknown) {
  if (!date) return ''

  const parsed = new Date(String(date))
  if (!Number.isNaN(parsed.getTime())) {
    const year = parsed.getFullYear()
    const month = String(parsed.getMonth() + 1).padStart(2, '0')
    const day = String(parsed.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  return String(date).slice(0, 10)
}
</script>

<template>
  <div class="site-shell">
    <SiteHeader />

    <main class="content-layout">
      <article class="post-panel">
        <header class="post-header">
          <h1>{{ frontmatter.title }}</h1>
          <div class="post-meta">
            <a :href="locale === 'en' ? `/en/category/${frontmatter.categorySlug}` : `/zh/category/${frontmatter.categorySlug}`">
              {{ frontmatter.category }}
            </a>
            <time>{{ displayDate }}</time>
          </div>
        </header>

        <div class="post-content">
          <slot />
        </div>
      </article>

      <aside class="sidebar-stack">
        <SidebarCategories :posts="posts" :locale="locale" />
        <SidebarPosts
          :title="locale === 'en' ? 'Related Articles' : '相关文章'"
          :posts="relatedPosts.length ? relatedPosts : localePosts.slice(0, 5)"
        />
      </aside>
    </main>

    <SiteFooter :locale="locale" />
  </div>
</template>
